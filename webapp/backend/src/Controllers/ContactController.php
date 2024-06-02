<?php

namespace Sona\Backend\Controllers;

use Sona\Backend\Resources\ContactResource;
use Sona\Backend\Services\HubspotApi;

class ContactController {

    public function getContacts($request)
    {
        echo json_encode(ContactResource::collection((new HubspotApi())->getContacts($request)));
    }
}