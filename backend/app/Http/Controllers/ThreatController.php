<?php

namespace App\Http\Controllers;

use App\Models\Threat;
use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class ThreatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Threat::orderByDesc("created_at")->get()->load("comments");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $threat = new Threat();
        $threat->content = $request->content;
        $threat->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(Threat $threat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Threat $threat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Threat $threat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Threat $threat)
    {
        //
    }

    public function like(Threat $threat)
    {
        $threat->likes += 1;
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
