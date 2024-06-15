<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use App\Http\Controllers\Controller;
use App\Models\ToForum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ForumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Forum::with('users', 'posts.comments', "toForums")->orderByDesc("updated_at")->get();
    }

    public function getPublicForums()
    {
        return Forum::where("public", 1)->with('users', 'posts.comments')->get();

    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                "name" => "required|max:255|unique:forums,name",
            ],
            [
                "name.required" => "Tên cộng đồng không được để trống",
                "name.unique" => "Tên cộng đồng đã tồn tại",
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }

        $forum = new Forum();
        $forum->name = $request->name;
        $forum->public = $request->public;
        $forum->cover = 'forums/default.jpg';

        if ($request->hasFile("cover")) {

            $file = $request->file("cover");
            $fileName = str_replace(
                ['.', ',', '/', '\\'],
                '',
                bcrypt(now() . $file->getClientOriginalName())
            )
                . ".jpg";

            $path = public_path() . '/storage/images/forums/';
            $file->move($path, $fileName);

            $forum->cover = 'forums/' . $fileName;
        }

        $forum->save();

        return json_encode([
            'status' => 200,
            'message' => "Thêm cộng đồng thành công",
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Forum $forum)
    {
        return $forum->load("users");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Forum $forum)
    {

        $validator = Validator::make(
            $request->all(),
            [
                "name" => "required|max:255",
            ],
            [
                "name.required" => "Tên cộng đồng không được để trống",
                "name.unique" => "Tên cộng đồng đã tồn tại",
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }

        $forum->name = $request->name;
        $forum->public = $request->public;

        if ($request->hasFile("cover")) {

            //unlink the cover
            @unlink(public_path() . "/" . $forum->cover);

            $file = $request->file("cover");
            $fileName = str_replace(
                ['.', ',', '/', '\\'],
                '',
                bcrypt(now() . $file->getClientOriginalName())
            )
                . ".jpg";

            $path = public_path() . '/storage/images/forums/';
            $file->move($path, $fileName);

            $forum->cover = 'forums/' . $fileName;
        }

        $forum->save();

        return json_encode([
            'status' => 200,
            'message' => "Cập nhật cộng đồng thành công",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Forum $forum)
    {
        $forum->delete();
        $forum->users()->detach();
        $forum->posts()->detach();

        return 200;
    }

    public function toForum(Request $request, Forum $forum)
    {
        $validator = Validator::make(
            $request->all(),
            [
                "mssv" => "regex:/\d{5}TT\d{4}/g",
            ],
            [
                "mssv.regex" => "MSSV không hợp lệ",
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages()[0],
            ]);
        }

        $toForum = new ToForum();

        $toForum->mssv = $request->mssv;
        $toForum->forum_id = $forum->id;
        $toForum->note = $request->note;

        $toForum->save();

        $toForum->forum = $forum;

        return json_encode([
            'status' => 200,
            'message' => "Gửi yêu cầu thành công",
        ]);
    }
}
