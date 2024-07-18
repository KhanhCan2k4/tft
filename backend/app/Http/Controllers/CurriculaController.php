<?php

namespace App\Http\Controllers;

use App\Models\Curricula;
use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CurriculaController extends Controller
{
    public function index()
    {
        return Curricula::all();
    }

    public function uploadProgram(Request $request, $year)
    {
        $curricula = Curricula::where("course", $year)->first();

        if (!$curricula && $year >= 2018 && $year <= date("Y") + 2) {
            $curricula = new Curricula();
            $curricula->course = $year;
        }

        if (isset($curricula) && $request->has("file")) {
            @unlink(public_path() . "/storage/files/" . $curricula->program);

            $file = $request->file("file");
            $fileName = "Chương trình đào tạo CNTT TFT khoá $year.pdf";


            $path = public_path() . '/storage/files/curriculums/';

            $file->move($path, $fileName);

            $curricula->program = "curriculums/" . $fileName;

            $curricula->save();

            return json_encode([
                "status" => 200,
                "message" => "Updated Curricula successfully",
            ]);
        }

        return json_encode([
            "status" => 422,
            "message" => "Updated Curricula unsuccessfully",
        ]);
    }

    public function uploadProgress(Request $request, $year)
    {
        $curricula = Curricula::where("course", $year)->first();

        if (!$curricula && $year >= 2018 && $year <= date("Y") + 2) {
            $curricula = new Curricula();
            $curricula->course = $year;
        }

        if ($curricula && $request->has("file")) {
            @unlink(public_path() . "/storage/files/" . $curricula->progress);

            $file = $request->file("file");
            $fileName = "Tiến trình đào tạo CNTT TFT khoá $year.jpg";

            $path = public_path() . '/storage/files/curriculums/';
            $file->move($path, $fileName);

            $curricula->progress = "curriculums/" . $fileName;
            $curricula->save();

            return json_encode(([
                "status" => 200,
                "message" => "Updated Curricula successfully",
            ]));
        }

        return json_encode(([
            "status" => 422,
            "message" => "Updated Curricula unsuccessfully",
        ]));
    }

    public function removeProgram($year)
    {
        $curricula = Curricula::where("course", $year)->first();

        if (isset($curricula)) {
            @unlink(public_path() . "/storage/files/" . $curricula->program);

            $curricula->program = "";
            $curricula->save();

            return json_encode(([
                "status" => 200,
                "message" => "Remove program successfully",
            ]));
        }

        return json_encode(([
            "status" => 422,
            "message" => "Remove program unsuccessfully",
        ]));
    }

    public function removeProgress($year)
    {
        $curricula = Curricula::where("course", $year)->first();

        if ($curricula) {
            @unlink(public_path() . "/storage/files/" . $curricula->progress);

            $curricula->progress = "";
            $curricula->save();

            return json_encode(([
                "status" => 200,
                "message" => "Remove progress successfully",
            ]));
        }

        return json_encode(([
            "status" => 422,
            "message" => "Remove progress unsuccessfully",
        ]));
    }

    public function getProgram($year)
    {
        $curricula = Curricula::where("course", $year)->first();


        if (isset($curricula)) {
            $file_path = public_path("storage/files/" . $curricula->program);

            if (file_exists($file_path)) {

                return response()->download(
                    $file_path,
                    "Chương trình đào tạo CNTT TFT khoá $year.pdf",
                    [
                        'Content-Type' => 'application/pdf',
                    ]
                );
            }
        }

        return null;
    }

    public function getProgress($year)
    {
        $curricula = Curricula::where("course", $year)->first();

        if (isset($curricula)) {
            $file_path = public_path("storage/files/" . $curricula->progress);

            if (file_exists($file_path)) {

                return response()->download(
                    $file_path,
                    "Tiến trình đào tạo CNTT TFT khoá $year.jpg",
                    [
                        'Content-Type' => 'image/jpeg',
                    ]
                );
            }
        }

        return null;
    }
}
