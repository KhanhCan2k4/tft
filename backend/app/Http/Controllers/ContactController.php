<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
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

    public function getAllWithPagination($page)
    {
        $total = Contact::all()->count();
        $contacts = Contact::all()->forPage($page, 5);

        return json_encode([
            "total" => $total,
            "contacts" =>  [...$contacts],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate(
            [
                'name' => 'required',
                'email' => 'required',
                'content' => 'required'
            ],
            [
                'name.required' => 'Name is required',
                'email.required' => 'Email is required',
                'content.required' => 'Email is required'
            ]
        );

        $contact = new Contact($validated);

        $contact->save();

        return json_encode([
            'status' => 200,
            'message' => "Store successfully"
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return $contact;
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
