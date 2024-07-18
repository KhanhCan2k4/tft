<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Type\Integer;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Contact::all();
    }

    public function getContactAnalysis()
    {
        $contacts = [];
        $contactsWithGrade = [];
        $dates = [];
        for ($i = 0; $i < 30; $i++) {
            $d = date("Y-m-d", strtotime("-$i days"));
            $date = date("d/m", strtotime("-$i days"));

            $dates = [$date, ...$dates];
            $contacts = [Contact::where("created_at", "LIKE", "%$d%")->orWhere("updated_at", "LIKE", "%$d%")->where("math", "=", 0)->where("eng", "=", 0)->count(), ...$contacts];
            $contactsWithGrade = [Contact::where("created_at", "LIKE", "%$d%")->orWhere("updated_at", "LIKE", "%$d%")->where("math", "<>", 0)->where("eng", "<>", 0)->count(), ...$contactsWithGrade];
        }

        return json_encode([
            "status" => 200,
            "dates" => array_values($dates),
            "contacts" => array_values($contacts),
            "has_grade_contacts" => array_values($contactsWithGrade),
        ]);
    }

    public function getExported()
    {
        $results = [];
        $targetYear = (int) date("Y");

        for ($i = 2019; $i <= $targetYear; $i++) {
            $contacts = Contact::where("created_at", "LIKE", "%$i%")->orWhere("updated_at", "LIKE", "%$i%")->orderByDesc('created_at')->get()->toArray();
            $results = [...$results, $i => $contacts];
        }


        return [...$results];
    }

    public function getAllWithPagination($page)
    {
        $total = Contact::all()->count();
        $contacts = Contact::orderByDesc("created_at")->forPage($page, 5)->get();

        return json_encode([
            "total" => $total,
            "contacts" => [...$contacts],
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
                'name' => 'required',
                'email' => "required|email:rfc,dns",
                'content' => 'required'
            ],
            [
                'name.required' => 'Name is required',
                'email.required' => 'Email is required',
                'content.required' => 'Content is required'
            ]
        );

        if ($validator->fails()) {
            return json_encode([
                'status' => 200,
                'message' => $validator->errors()->getMessages()
            ]);
        }

        $contact = Contact::where("email", trim(strtolower($request->email)))->first();

        if (!isset($contact)) {
            //create new contact
            $contact = new Contact();
            $contact->email = strtolower($request->email);
        }
        $contact->name = $request->name;
        $contact->content = $request->content;

        if ($request->has("phone") && preg_match("/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/", $request->phone)) {
            $contact->phone = $request->phone;
        }

        if ($request->has("eng") && preg_match("/^1(\.[2468])?$|^[2-9](\.[02468])?$|^10(\.0)?$/", $request->eng) && $request->has("math") && preg_match("/^1(\.[2468])?$|^[2-9](\.[02468])?$|^10(\.0)?$/", $request->math)) {
            //update grades
            $contact->math = $request->math;
            $contact->eng = $request->eng;
        }

        $contact->save();

        return json_encode([
            'status' => 200,
            'message' => "Store successfully"
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {

        $validated = $request->validate(
            [
                'name' => 'required',
                'email' => 'required'
            ],
            [
                'name.required' => 'Name is required',
                'email.required' => 'Email is required'
            ]
        );

        $contact->name = $validated['name'];

        $contact->save();

        return json_encode([
            'status' => 200,
            'message' => "Update successfully"
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        //
        $contact->delete();
        return json_encode([
            'status' => 200,
            'message' => "Delete successfully"
        ]);
    }
}
