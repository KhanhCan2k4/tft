<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Token;
use App\Models\User;
use Exception;
use Faker\Factory;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\DomCrawler\Crawler;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::where("role_id", "<>", "1")->get();
    }

    public function indexHasGrades()
    {
        $users = User::where("role_id", "<>", "1")->get();

        foreach ($users as $user) {

            //get and save grade
            $response = Http::get("http://online.tdc.edu.vn/Portlets/Uis_Myspace/Professor/Marks.aspx?StudentID=" . $user->mssv);

            if ($response->successful()) {
                $htmlContent = $response->body();

                //filer the grade
                $crawler = new Crawler($htmlContent);
                $grade = explode(": ", $crawler->filter("#tbSource + div b")->text());

                if (count($grade) >= 4) {
                    $grade = (float) $grade[3];
                    $user->grade = $grade;
                    $user->save();
                }
            }

        }
        return $users;
    }

    public function getAllWithPagination($page)
    {
        $total = User::all()->count() - 1;
        $users = User::where("role_id", "<>", "1")->orderByDesc("updated_at")->orderByDesc("created_at")->forPage($page, 5)->get();

        foreach ($users as $user) {
            //get and save grade
            $response = Http::get("http://online.tdc.edu.vn/Portlets/Uis_Myspace/Professor/Marks.aspx?StudentID=" . $user->mssv);

            if ($response->successful()) {
                $htmlContent = $response->body();

                //filer the grade
                $crawler = new Crawler($htmlContent);
                $grade = explode(": ", $crawler->filter("#tbSource + div b")->text());

                if (count($grade) >= 4) {
                    $grade = (float) $grade[3];
                    $user->grade = $grade;
                    $user->save();
                }
            }
        }

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
        $count = 0;
        if ($request->has("users")) {
            foreach ($request->users as $user) {
                $validator = Validator::make(
                    $user,
                    [
                        'mssv' => 'required|regex:/^\d{5}[tT]{2}\d{4}$/|unique:users,mssv',
                        'class' => 'required|regex:/^[cC]{1}[Dd]{1}\d{2}[tT]{2}\d{1,2}$/',
                    ],
                    [],
                );

                if (!$validator->fails()) {
                    $newUser = new User();
                    $newUser->mssv = strtoupper($user["mssv"]);
                    $newUser->password = Hash::make($newUser->mssv);
                    $newUser->avatar = "";
                    $newUser->achievements = "";
                    $newUser->class = strtoupper($user["class"]);

                    //get and save grade
                    $response = Http::get("http://online.tdc.edu.vn/Portlets/Uis_Myspace/Professor/Marks.aspx?StudentID=" . $newUser->mssv);

                    if ($response->successful()) {
                        $htmlContent = $response->body();

                        //filer the grade
                        $crawler = new Crawler($htmlContent);
                        try {
                            $grade = explode(": ", $crawler->filter("#tbSource + div b")->text());
                            if (count($grade) >= 4) {
                                $grade = (float) $grade[3];
                                $newUser->grade = $grade;
                            }
                            $sv = $crawler->filter("span#lbInfo.StudentInfoDetails_normal_dl")->text();
                            $sv = rtrim($sv, "]");
                            $sv = explode(" [Mã số:", $sv);

                            if (count($sv) >= 2) {
                                $sv = $sv[0];
                                $newUser->name = $sv;
                            }
                        } catch (Exception $e) {
                            if (isset($user["grade"]) && $user["grade"] >= 0 && $user["grade"] <= 10 && isset($user["name"])) {
                                $newUser->grade = $user["grade"];
                                $newUser->name = $user["name"];
                            }
                        }

                    } else {
                        if (isset($user["grade"]) && $user["grade"] >= 0 && $user["grade"] <= 10 && isset($user["name"])) {
                            $newUser->grade = $user["grade"];
                            $newUser->name = $user["name"];
                        }
                    }
                    $newUser->save();
                    $count++;
                }
            }
        }

        return json_encode(["count" => $count]);
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
                'class' => 'required|regex:/^[cC]{1}[Dd]{1}\d{2}[tT]{2}\d{1,2}$/',
                'grade' => 'required|min:0|max:10',
            ],
            [
                'class.required' => 'Class cannot be empty',
                'class.regex' => 'Class is invalid',
                'grade.min' => 'Grade must be between 0 and 10',
                'grade.max' => 'Grade must be between 0 and 10',
                'grade.required' => 'Grade is invalid',
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

            if (\strlen($request->newPass) < 6) {
                return json_encode([
                    'status' => 422,
                    'message' => "Password must be at least 6 characters",
                ]);
            }

            if (\strlen($request->newPass) > 50) {
                return json_encode([
                    'status' => 422,
                    'message' => "Password must be at most 50 characters",
                ]);
            }
            $user->password = Hash::make($request->newPass);
        }

        $user->class = $request->class;
        $user->grade = $request->grade;
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
                'password.required' => 'Password cannot be empty',
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

        $user = User::where('mssv', $request->mssv)->first();

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

                if (!$user->mssv) {
                    return json_encode(null);
                }
                return $user;
            }
        }

        return json_encode(null);
    }

    public function getAllClasses()
    {
        $classes = User::select("class")->distinct()->where("class", "<>", "")->get();

        return $classes;
    }

    public function getHonors()
    {
        $classes = User::select("class")->distinct()->where("class", "<>", "")->get();
        $honors = [];

        foreach ($classes as $key) {
            $honor = User::where("class", (array) $key['class'])->where("grade", ">=", 8)->orderByDesc("grade")->get()->take(5);
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

        //remove all token
        DB::update("DELETE FROM tokens WHERE user_id = $user->id");

        return true;
    }

    public function updateForgotPassword(Request $request)
    {
        $user = User::where('mssv', $request->mssv)->first();

        if ($user) {
            $password = substr(Hash::make($request->mssv), 0, 20);
            $user->password = Hash::make($password);

            $to_name = "Sinh viên " . $request->mssv;
            $to_email = $request->mssv . "@mail.tdc.edu.vn";
            $data = array("name" => "Cloudways (sender_name)", "body" => "A test mail");

            Mail::send([], $data, function ($message) use ($to_name, $to_email) {
                $message->to($to_email, $to_name)
                    ->subject("Laravel Test Mail");
                $message->from("levietkhanh2k4@gmail.com", "Test Mail");
            });
        }
    }

    public function setAvatar(Request $request, User $user)
    {
        @unlink($user->avatar);
        if ($request->hasFile("avatar")) {
            $file = $request->file("avatar");
            $fileName = str_replace(
                ['.', ',', '/', '\\'],
                '',
                bcrypt(now() . $file->getClientOriginalName())
            )
                . ".jpg";

            $path = public_path() . '/storage/images/users/';
            $file->move($path, $fileName);

            $user->avatar = 'users/' . $fileName;
            $user->save();

            return json_encode([
                "status" => 200,
                "message" => "Upload avatars successfully",
                "avatar" => $user->avatar,
            ]);
        }

        return json_encode([
            "status" => 422,
            "message" => "Upload avatars unsuccessfully",
        ]);
    }
}
