<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\CurriculaController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\ThreatController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [UserController::class, "login"]);
Route::post('/isAdmin', [UserController::class, "isAdmin"]);
Route::post('/login/admin', [UserController::class, "loginAdmin"]);
Route::post('/login/auth/admin', [UserController::class, "isAdmin"]);
Route::post('/login/auth/user', [UserController::class, "isUser"]);
Route::post('/user/new/pass/{user}', [UserController::class, "resetPassword"]);
Route::post('/login/forgot', [UserController::class, "updateForgotPassword"]);
Route::delete('/tokens/{t}', [TokenController::class, "destroy"]);
Route::post('/user/new/achievements/{user}', [UserController::class, "setArchievement"]);
Route::post('/user/avatar/{user}', [UserController::class, "setAvatar"]);

Route::get("posts/enroll/pagination/{page}", [PostController::class, "getEnrollPostsWithPaginate"]);
Route::get("posts/enroll", [PostController::class, "getEnrollPosts"]);

Route::get("posts/student/pagination/{page}", [PostController::class, "getStudentPostsWithPaginate"]);
Route::get("posts/student", [PostController::class, "getStudentPosts"]);

Route::get("posts/recent", [PostController::class, "getRecentPosts"]);
Route::get("posts/new", [PostController::class, "getRecentPosts"]);
Route::post("posts/ids", [PostController::class, "getPostsByIds"]);

Route::get("posts/pagination/{page}", [PostController::class, "indexWithPaginate"]);
Route::post("posts/tags", [PostController::class, "getPostsByTags"]);

Route::post("posts/cover/{post}", [PostController::class, "storeCover"]);
Route::get("posts/like/{post}", [PostController::class, "like"]);
Route::get("posts/unlike/{post}", [PostController::class, "unlike"]);
Route::get("posts/view/{post}", [PostController::class, "view"]);
Route::post("posts/tags/pagination/{page}", [PostController::class, "getPostsByTags"]);
Route::get("posts/analysis", [PostController::class, "getPostAnalysis"]);
Route::resource("posts", PostController::class);

Route::resource("tags", TagController::class);

Route::post("users/import", [UserController::class, "storeMultiple"]);
Route::get("users/pagination/{page}", [UserController::class, "getAllWithPagination"]);
Route::get("users/classes", [UserController::class, "getAllClasses"]);
Route::get("users/honors", [UserController::class, "getHonors"]);
Route::get("users/grades", [UserController::class, "indexHasGrades"]);
Route::resource("users", UserController::class);

Route::resource("comments", CommentController::class);

Route::post("forums/to/{forum}", [ForumController::class, "toForum"]);
Route::post("forums/{forum}", [ForumController::class, "update"]);
Route::resource("forums", ForumController::class);

Route::get("contacts/pagination/{page}", [ContactController::class, "getAllWithPagination"]);
Route::get("contacts/export", [ContactController::class, "getExported"]);
Route::get("contacts/analysis", [ContactController::class, "getContactAnalysis"]);
Route::resource("contacts", ContactController::class);

Route::get("banners/{banner}/{priority}", [BannerController::class, "setPriority"]);
Route::post("banners/{banner}", [BannerController::class, "update"]);
Route::resource("banners", BannerController::class);

Route::get("threats/analysis", [ThreatController::class, "getThreatAnalysis"]);
Route::resource("threats", ThreatController::class);
Route::get("threats/pagination/{page}", [ThreatController::class, "getAllWithPagination"]);
Route::get("threats/like/{threat}", [ThreatController::class, "like"]);
Route::get("threats/unlike/{threat}", [ThreatController::class, "unlike"]);
Route::get("threats/view/{threat}", [ThreatController::class, "view"]);

Route::get("curriculums", [CurriculaController::class, "index"]);
Route::post("curriculums/program/{year}", [CurriculaController::class, "uploadProgram"]);
Route::post("curriculums/progress/{year}", [CurriculaController::class, "uploadProgress"]);
Route::delete("curriculums/program/{year}", [CurriculaController::class, "removeProgram"]);
Route::delete("curriculums/progress/{year}", [CurriculaController::class, "removeProgress"]);
Route::get("curriculums/program/{year}", [CurriculaController::class, "getProgram"]);
Route::get("curriculums/progress/{year}", [CurriculaController::class, "getProgress"]);

Route::get("configs/pagination/{page}", [ConfigurationController::class, "index"]);
Route::put("configs/{key}", [ConfigurationController::class, "update"]);
Route::get("configs", [ConfigurationController::class, "getAllFromUser"]);

Route::get("templates", [TemplateController::class, "index"]);
