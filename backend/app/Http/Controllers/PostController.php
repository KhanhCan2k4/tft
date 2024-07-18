<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Contracts\Session\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Session\Session as SessionSession;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Post::where("id", "<>", 1)->orderByDesc("updated_at")->orderByDesc("created_at")->get()->load("tags");
    }

    public function getPostAnalysis()
    {
        $dates = [];
        $views = [];
        $likes = [];
        for ($i = 0; $i < 30; $i++) {
            $d = date("Y-m-d", strtotime("-$i days"));
            $date = date("d/m", strtotime("-$i days"));

            $dates = [$date, ...$dates];
            $likes = [Post::where("created_at", "LIKE", "%$d%")->orWhere("updated_at", "LIKE", "%$d%")->sum("likes"), ...$likes];
            $views = [Post::where("created_at", "LIKE", "%$d%")->orWhere("updated_at", "LIKE", "%$d%")->sum("views"), ...$views];
        }

        return json_encode([
            "status" => 200,
            "dates" => array_values($dates),
            "likes" => array_values($likes),
            "views" => array_values($views),
        ]);
    }

    public function indexWithPaginate($page = 1)
    {
        $posts = Post::where("id", "<>", 1)->orderByDesc("updated_at")->orderByDesc("created_at")->get()->load("tags")->forPage($page, 5);

        return ["posts" => [...$posts], "total" => Post::all()->count() - 1];
    }

    public function getEnrollPosts()
    {
        $posts = Post::all();

        $posts = $posts->filter(function (Post $post) {
            $tags = $post->tags;
            return $tags->contains(1);
        })->reverse()->load("tags");

        return $posts;
    }

    public function getEnrollPostsWithPaginate($page = 1)
    {
        $posts = Post::all();

        $posts = $posts->filter(function (Post $post) {
            $tags = $post->tags;
            return $tags->contains(1);
        });

        $count = $posts->count();

        $posts = $posts->reverse()->load("tags")->forPage($page, 5);

        return ["posts" => $posts, "total" => $count];
    }

    public function getPostsByTags(Request $request, $page = 1)
    {
        $ids = $request->ids;
        $posts = Post::whereHas('tags', function ($query) use ($ids) {
            $query->whereIn('tags.id', $ids);
        })->get();

        $total = count($posts);

        if ($request->has('perpage')) {
            $posts = $posts->load("tags")->forPage($page, $request->perpage);
        } else {
            $posts = $posts->load("tags")->forPage($page, 5);
        }

        return ["posts" => [...$posts], "total" => $total];
    }

    public function getPostsByIds(Request $request)
    {
        $ids = $request->ids;

        $posts = Post::whereIn('id', $ids)->take(6)->get();

        return $posts;
    }

    public function getStudentPostsWithPaginate($page = 1)
    {
        $posts = Post::all();

        $posts = $posts->filter(function (Post $post) {
            $tags = $post->tags;
            return $tags->contains(2);
        });

        $count = $posts->count();

        $posts = $posts->reverse()->load("tags")->forPage($page, 5);

        return ["posts" => $posts, "total" => $count];
    }

    public function getRecentPosts()
    {
        $posts = Post::orderByDesc("created_at")->take(6)->get()->load("tags");

        return $posts;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required|max:255',
                'content' => 'required',
            ],
            [
                'title.required' => 'Chưa nhập tiêu đề bài viết',
                'title.max' => 'Tiêu đề bài viết quá dài',
                'content.required' => 'Chưa nhập nội dung bài viết',
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }

        $post = new Post();
        $post->title = $request->title;
        $post->content = $request->content;
        $post->image = "";
        $post->save();

        $tags = [];
        if ($request->has("tags") && isset($request->tags)) {
            foreach ($request->tags as $id) {
                $tag = Tag::find($id);
                array_push($tags, $tag->id);
            }
        }

        if ($request->has("newTag") && isset($request->newTag)) {
            $tag = new Tag();
            $tag->name = $request->newTag;
            $tag->save();
            array_push($tags, $tag->id);
        }
        $post->tags()->attach($tags);

        return json_encode([
            'status' => 200,
            'message' => "Thêm bài viết thành công",
            "post" => $post,
        ]);
    }

    public function storeCover(Request $request, Post $post)
    {
        @unlink(public_path() . "/storage/images/" . $post->image);
        if ($request->hasFile("image")) {
            $file = $request->file("image");
            $fileName = str_replace(
                ['.', ',', '/', '\\'],
                '',
                bcrypt(now() . $file->getClientOriginalName())
            )
                . ".jpg";

            $path = public_path() . '/storage/images/posts/';
            $file->move($path, $fileName);

            $post->image = 'posts/' . $fileName;
            $post->save();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return $post->load("tags");
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'title' => 'required|max:255',
                'content' => 'required',
            ],
            [
                'title.required' => 'Chưa nhập tiêu đề bài viết',
                'title.max' => 'Tiêu đề bài viết quá dài',
                'content.required' => 'Chưa nhập nội dung bài viết',
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }


        $post->title = $request->title;
        $post->content = $request->content;
        $post->save();

        $tags = [];
        if ($request->has("tags") && isset($request->tags)) {
            foreach ($request->tags as $id) {
                $tag = Tag::find($id);
                array_push($tags, $tag->id);
            }
        }

        if ($request->has("newTag") && isset($request->newTag)) {
            $tag = new Tag();
            $tag->name = $request->newTag;
            $tag->save();
            array_push($tags, $tag->id);
        }
        $post->tags()->sync($tags);

        return json_encode([
            'status' => 200,
            'message' => "Update successfully",
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //unlink cover
        @unlink(public_path() . "/storage/images/" . $post->image);

        if ($post->delete()) {
            return json_encode([
                'status' => 200,
                'message' => "Delete successfully"
            ]);
        }

        return json_encode([
            'status' => 422,
            'message' => "Delete unsuccessfully"
        ]);
    }

    public function like(Post $post)
    {
        $post->likes += 1;
        $post->save();

        return json_encode(["like" => $post->likes]);
    }

    public function unlike(Post $post)
    {
        $post->likes = $post->likes == 0 ? 0 : $post->likes - 1;
        $post->save();

        return json_encode(["like" => $post->likes]);
    }

    public function view(Post $post)
    {
        $post->views += 1;
        $post->save();

        return json_encode(["view" => $post->views]);
    }
}
