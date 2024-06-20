<?php

namespace App\Backend\Controllers;

use App\Backend\Resources\ContactResource;
use function App\Backend\Services\Hubspot\hubspot;
use function App\Backend\Core\{response};

class ContactController {

    protected $authController;

    public function __construct()
    {
        $this->authController = new AuthController();
    }

    public function getContacts($request)
    {
        try{
            response(ContactResource::collection(
                hubspot([
                    'token' => $this->authController->getAccessToken()
                ])->contact()->search($request)
            ), 200);
        }catch(\Exception $e){
            return response([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}