<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TokenController extends Controller
{
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($t)
    {
        $token = Token::where("token", $t);
        $token->delete();
    }
}
