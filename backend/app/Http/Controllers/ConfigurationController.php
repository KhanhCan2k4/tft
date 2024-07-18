<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use Validator;

class ConfigurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($page)
    {
        $total = Configuration::all()->count();
        $configs = Configuration::orderByDesc("updated_at")->orderByDesc("created_at")->forPage($page, 5)->get();

        return json_encode([
            "total" => $total,
            "configs" => [...$configs],
        ]);
    }

    public function getAllFromUser()
    {
        $configs = Configuration::where("key", "<>", "AD_PASS")->get(["key", "value"]);

        return $configs;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $key)
    {
        $validator = FacadesValidator::make(
            $request->all(),
            [
                'key' => 'required',
                'value' => 'required',
            ],
            [
                'key.required' => 'Key is required',
                'value.required' => 'Value is required',
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 422,
                'message' => $validator->errors()->getMessages(),
            ]);
        }

        if ($key === "AD_PASS") {
            $newPass = Hash::make($request->value);

            $user = User::find(1);
            $user->password = $newPass;
            $user->save();

            //remove all token
            DB::update("DELETE FROM tokens WHERE user_id = 1");

            if (DB::table("configurations")->where("key", $key)->update(["value" => $newPass])) {
                return json_encode([
                    'status' => 200,
                    'message' => 'Update Successfully',
                ]);
            }
        } else {
            if ($key === "AD_NAME") {
                $user = User::find(1);
                $user->name = $request->value;
                $user->save();
            }

            if (DB::table("configurations")->where("key", $key)->update(["value" => $request->value])) {
                return json_encode([
                    'status' => 200,
                    'message' => 'Update Successfully',
                ]);
            }
        }

        return json_encode([
            'status' => 422,
            'message' => "Update Unsuccessfully",
        ]);
    }
}
