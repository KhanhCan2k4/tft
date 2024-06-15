<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Tag::all();
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
        //
        $validator = Validator::make(
            $request->all(), [
                'name' => 'required',
            ],
            [
                'name.required' => 'Bạn chưa điền tên danh mục',
            ]
        );

        if($validator->fails()){
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }

        $tag = new Tag();

        $tag->name = $request->name;
        $tag->author = 0;

        $tag->save();


        return json_encode([
            'status' => 200,
            'message' => 'Thêm thành công',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        return $tag;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        //
        $validator = Validator::make(
            $request->all(), [
               'name' => 'required',
           ],
           [
               'name.required' => 'Bạn chưa điền tên danh mục',
           ]
       );

       if($validator->fails()){
           return json_encode([
               'status' => 422,
               'message' => $validator->errors()->getMessages(),
           ]);
       }

       $tag->name = $request->name;
       $tag->author = 0;

       $tag->save();


       return json_encode([
           'status' => 200,
           'message' => 'Chỉnh sửa thành công',
       ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        //
        if($tag->delete()){
            return json_encode([
                'status' => 200,
                'message' => 'Xóa thành công'
            ]);
        }

        return json_encode([
            'status' => 400,
            'message' => 'Xóa không thành công'
        ]);
    }
}
