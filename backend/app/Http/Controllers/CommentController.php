<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Controllers\Controller;
use App\Models\Token;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Comment::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $comment = new Comment();

        if (isset($request->token)) {
            $token = Token::select("user_id")->where('token', $request->token)->first();

            if (!isset($token)) {
                return json_encode([
                    "status" => 422,
                    "message" => "Add comment unsuccessfully",
                ]);
            }
            $comment->author = $token->user_id ?? 0;
        } else {
            return json_encode([
                "status" => 422,
                "message" => "Add comment unsuccessfully",
            ]);
        }

        $comment->threat_id = $request->threat;

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
            $comment->content = implode(" ", $contentArr);
            $comment->save();

            return json_encode([
                "status" => 200,
                "message" => "Add comment successfully",
                "comments" => $comment->threat->comments,
                "comment" => $comment,
            ]);
        }

        return json_encode([
            "status" => 422,
            "message" => "Add comment unsuccessfully",
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        return $comment;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return json_encode([
            "status" => 200,
            "message" => "Remove comment successfully",
        ]);

    }
}
