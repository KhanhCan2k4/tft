<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Banner::orderBy("priority")->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->hasFile("img")) {
            $banner = new Banner();
            $banner->title = "";

            $file = $request->file("img");
            $fileName = str_replace(
                ['.', ',', '/', '\\'],
                '',
                bcrypt(now() . $file->getClientOriginalName())
            )
                . ".jpg";

            $path = public_path() . '/storage/images/banners/';
            $file->move($path, $fileName);

            $banner->img = 'banners/' . $fileName;
            $banner->priority = Banner::all()->count() + 1;

            $banner->save();

            return json_encode([
                'status' => 200,
                'message' => "Thêm banner thành công",
                'banner' => $banner,
            ]);
        }

        return json_encode([
            'status' => 422,
            'message' => "Thêm banner không thành công",
        ]);
    }

    public function setPriority(Banner $banner, int $priority)
    {
        if ($banner->priority > $priority) {
            Banner::where("priority", ">=", $priority)->where("priority", "<", $banner->priority)->increment("priority");
        } else {
            Banner::where("priority", "<=", $priority)->where("priority", ">", $banner->priority)->decrement("priority");
        }

        if (!($priority > Banner::all()->count() || $priority < 1 || $priority > 10)) {
            $banner->priority = $priority;
            $banner->save();
        }

        return json_encode([
            "status" => 200,
            "banners" => Banner::orderBy("priority")->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        return $banner;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        if ($request->hasFile("img")) {

            //unlink the old file
            @unlink(public_path() . "/" . $banner->img);

            $file = $request->file("img");
            $fileName = str_replace(
                ['.', ',', '/', '\\'],
                '',
                bcrypt(now() . $file->getClientOriginalName())
            )
                . ".jpg";

            $path = public_path() . '/storage/images/banners/';
            $file->move($path, $fileName);

            $banner->img = 'banners/' . $fileName;

            $banner->save();

            return json_encode([
                'status' => 200,
                'message' => "Thay ảnh banner thành công",
                'banners' => Banner::orderBy("priority")->get(),
            ]);
        }

        return json_encode([
            'status' => 422,
            'message' => "Thay ảnh banner không thành công",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        Banner::where("priority", ">", $banner->priority)->decrement("priority");
        @unlink(public_path() . "/storage/images/" . $banner->img);
        $banner->delete();

        return json_encode([
            "status" => 200,
            "message" => "Xoá banner thành công",
            "banners" => Banner::orderBy("priority")->get(),
        ]);
    }
}
