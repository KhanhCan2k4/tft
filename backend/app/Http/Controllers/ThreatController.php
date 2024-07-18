<?php

namespace App\Http\Controllers;

use App\Models\Threat;
use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThreatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Threat::orderByDesc("created_at")->get()->load("comments");
    }

    public function show(Threat $threat)
    {
        return $threat->load("comments");
    }

    public function getThreatAnalysis()
    {
        $dates = [];
        $comments = [];
        $likes = [];
        for ($i = 0; $i < 30; $i++) {
            $d = date("Y-m-d", strtotime("-$i days"));
            $date = date("d/m", strtotime("-$i days"));

            $dates = [$date, ...$dates];
            $likes = [Threat::where("created_at", "LIKE", "%$d%")->orWhere("updated_at", "LIKE", "%$d%")->sum("likes"), ...$likes];
            $threats = Threat::where("created_at", "LIKE", "%$d%")->orWhere("updated_at", "LIKE", "%$d%")->get()->load("comments");

            $sql = "SELECT count(*) as comments FROM comments WHERE comments.threat_id IN (SELECT id FROM threats WHERE created_at LIKE '%$d%' OR updated_at LIKE '%$d%')";
            $comments = [DB::select($sql)[0]->comments ?? 0, ...$comments];
        }

        return json_encode([
            "status" => 200,
            "dates" => array_values($dates),
            "likes" => array_values($likes),
            "comments" => array_values($comments),
        ]);
    }

    public function getAllWithPagination($page)
    {
        $total = Threat::all()->count();
        $threats = Threat::orderByDesc("created_at")->forPage($page, 5)->get()->load("comments");

        return json_encode([
            "total" => $total,
            "threats" => [...$threats],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $threat = new Threat();

        //filter bad word in content then save
        $path = public_path() . '/storage/files/bad_words.json';
        $badWords = json_decode(file_get_contents($path), true);

        $contentArr = explode(" ", $request->content);
        $count = 0;
        foreach ($contentArr as $key => $value) {
            if (in_array($value, $badWords)) {
                $contentArr[$key] = str_repeat("*", strlen($value));
                $count++;
            }
        }

        if ($count <= 3) {
            $threat->content = implode(" ", $contentArr);
            $threat->save();

            return json_encode([
                "status" => 200,
                "message" => "Add threat successfully",
                "threat" => $threat,
            ]);
        }

        return json_encode([
            "status" => 422,
            "message" => "Add threat unsuccessfully",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Threat $threat)
    {
        $threat->delete();
        return json_encode([
            "status" => 200,
            "message" => "Add threat successfully",
        ]);
    }

    public function like(Threat $threat)
    {
        $threat->likes += 1;
        $threat->save();
        return json_encode(["like" => $threat->likes]);
    }

    public function unlike(Threat $threat)
    {
        $threat->likes = 0 ? 0 : $threat->likes - 1;
        $threat->save();
        return json_encode(["like" => $threat->likes]);
    }

    public function view(Threat $threat)
    {
        $threat->views += 1;
        $threat->save();
        return json_encode(["view" => $threat->views]);
    }
}
