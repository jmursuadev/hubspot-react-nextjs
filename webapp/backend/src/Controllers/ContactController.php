<?php

namespace App\Backend\Controllers;

use App\Backend\Resources\ContactResource;
use App\Backend\Services\HubspotApi;

class ContactController {

    public function getContacts($request)
    {
        echo json_encode(ContactResource::collection((new HubspotApi())->getContacts($request)));
    }
}