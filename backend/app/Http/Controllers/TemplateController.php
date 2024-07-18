<?php

namespace App\Http\Controllers;

use App\Models\Template;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index()
    {
        return Template::all();
    }
}
