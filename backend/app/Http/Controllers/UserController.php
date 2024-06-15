<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::all();
    }

    public function getAllWithPagination($page)
    {
        $total = User::all()->count() - 1;
        $users = User::where("role_id", "<>", "1")->orderByDesc("updated_at")->orderByDesc("created_at")->forPage($page, 5)->get();

        return json_encode([
            "total" => $total,
            "users" => [...$users],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|min:6|max:50',
                'mssv' => 'required|regex:/^\d{5}[tT]{2}\d{4}$/',
                'class' => 'required|regex:/^[cC]{1}[Dd]{1}\d{2}[tT]{2}\d{2}$/',
            ],
            [
                'name.required' => 'Name cannot be empty',
                'mssv.required' => 'MSSV cannot be empty',
                'class.required' => 'Class cannot be empty',
                'name.min' => 'Name is invalid',
                'name.max' => 'Name is invalid',
                'mssv.regex' => 'MSSV is invalid',
                'class.regex' => 'Class is invalid',
            ]
        );

        if ($validator->fails()) {
            if ($validator->fails()) {
                return json_encode([
                    'status' => 422,
                    'message' => $validator->errors()->getMessages(),
                ]);
            }
        }

        try {
            $user = new User();
            $user->name = $request->name;
            $user->mssv = strtoupper($request->mssv);
            $user->class = strtoupper($request->class);
            $user->save();
        } catch (\Throwable $th) {
            //ignore
        }

        return json_encode([
            'status' => 200,
            'message' => "Store successfully",
            'user' => json_encode([
                'name' => $user->name,
                'mssv' => $user->mssv,
                'class' => $user->class,
            ])
        ]);
    }

    public function storeMultiple(Request $request)
    {
        if ($request->has("users")) {
            foreach ($request->users as $user) {
                $validator = Validator::make(
                    $user,
                    [
                        'name' => 'required|min:6|max:50',
                        'mssv' => 'required|regex:/^\d{5}[tT]{2}\d{4}$/|unique:users,mssv',
                        'class' => 'required|regex:/^[cC]{1}[Dd]{1}\d{2}[tT]{2}\d{1,2}$/',
                    ],
                    [],
                );

                if (!$validator->fails()) {
                    $newUser = new User();
                    $newUser->name = $user["name"];
                    $newUser->mssv = strtoupper($user["mssv"]);
                    $newUser->password = Hash::make($newUser->mssv);
                    $newUser->avatar = "";
                    $newUser->achievements = "";
                    $newUser->class = strtoupper($user["class"]);
                    $newUser->save();
                }

            }

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $token = Token::where('token', $request->token)->first();
        return User::find($token->user_id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required|min:6|max:50',
                'mssv' => 'required|regex:/^\d{5}[tT]{2}\d{4}$/',
                'class' => 'required|regex:/^[cC]{1}[Dd]{1}\d{2}[tT]{2}\d{1,2}$/',
            ],
            [
                'name.required' => 'Name cannot be empty',
                'mssv.required' => 'MSSV cannot be empty',
                'class.required' => 'Class cannot be empty',
                'name.min' => 'Name is invalid',
                'name.max' => 'Name is invalid',
                'mssv.regex' => 'MSSV is invalid',
                'class.regex' => 'Class is invalid',
            ]
        );

        if ($validator->fails()) {
            if ($validator->fails()) {
                return json_encode([
                    'status' => 422,
                    'message' => $validator->errors()->getMessages(),
                ]);
            }
        }

        if ($request->has("newPass") && isset($request->newPass)) {
            $user->password = Hash::make($request->newPass);
        }


        $user->name = $request->name;
        $user->mssv = $request->mssv;
        $user->class = $request->class;
        $user->save();

        return json_encode([
            'status' => 200,
            'message' => "Update successfully"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        $user->delete();
        return json_encode([
            'status' => 200,
            'message' => "Delete successfully"
        ]);
    }


    public function login(Request $request)
    {

        $validator = Validator::make(
            $request->all(),
            [
                'password' => 'required|min:6|max:50',
                'mssv' => 'required|regex:/^\d{5}[tT]{2}\d{4}$/',
            ],
            [
                'password.required' => 'p\Password cannot be empty',
                'mssv.required' => 'MSSV cannot be empty',
                'password.min' => 'Password must be at least 6 characters',
                'password.max' => 'Password mus to be at most 50 characters',
                'mssv.regex' => 'MSSV is invalid',
            ]
        );

        if ($validator->fails()) {
            if ($validator->fails()) {
                return json_encode([
                    'status' => 422,
                    'message' => $validator->errors()->getMessages(),
                ]);
            }
        }

        $user = User::where([['mssv', $request->mssv], ['role_id', "<>", 1]])->first();

        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                //create token
                $token = new Token();
                $token->token = Hash::make(Hash::make($user->password . now()));
                $token->user_id = $user->id;
                $token->save();

                return json_encode([
                    'token' => $token->token,
                ]);
            }
        }

    }

    public function loginAdmin(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'name' => 'required',
                'password' => 'required',
            ],
            [
                'name.required' => 'Name cannot be empty',
                'password.required' => 'Password cannot be empty',
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }

        $user = User::where('name', $request->name)->first();

        if ($user) {
            if (Hash::check($request->password, $user->password) && $user->role_id == '1') {
                //create token
                $token = new Token();
                $token->token = Hash::make(Hash::make($user->password . now()));
                $token->user_id = $user->id;
                $token->save();

                return json_encode([
                    'status' => 200,
                    'token' => $token->token,
                ]);
            }
        }

        return json_encode([
            'status' => 422,
            'message' => "Wrong username or password",
        ]);
    }

    public function isAdmin(Request $request)
    {
        if ($request->has('token')) {
            $token = Token::where('token', $request->get('token'))->first();

            if ($token) {
                return $token->user_id === 1 ? 200 : null;
            }
        }

        return null;
    }

    public function isUser(Request $request)
    {
        if ($request->has('token')) {
            $token = Token::where('token', $request->get('token'))->first();

            if ($token) {
                $user = User::find($token->user_id);
                return $user;
            }
        }

        return json_encode(null);
    }

    public function getAllClasses()
    {
        $classes = User::select("class")->distinct()->get();

        return $classes;
    }

    public function getHornors()
    {
        $classes = User::select("class")->distinct()->get();
        $honors = [];

        foreach ($classes as $key) {
            $honor = User::where("class", (array) $key['class'])->get();
            array_push($honors, $honor);
        }

        return $honors;
    }

    public function setArchievement(Request $request, User $user)
    {
        $user->achievements = $request->achievements;
        $user->save();

        return json_encode(["achievements" => $user->achievements]);
    }

    public function resetPassword(Request $request, User $user)
    {
        $user->password = Hash::make($request->password);
        $user->save();

        return true;
    }
}
