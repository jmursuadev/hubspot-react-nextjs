<?php

namespace App\Backend\Services\Hubspot;

use App\Backend\Services\Hubspot\Endpoints\Contact;
use GuzzleHttp\Client;

class Hubspot {

    static $instance;
    
    protected $accessToken;
    protected $baseUri = "https://api.hubapi.com/crm/v3/";

    public static function instance($config = []) {
        if (!self::$instance) {
            self::$instance = new Hubspot($config);
        }

        return self::$instance;
    }

    public function __construct($config = [])
    {
        $this->setToken($config['token'] ?? null);
    }

    public function client() {
        $headers = [];

        if ($this->accessToken) {
            $headers['Authorization'] = 'Bearer ' . $this->accessToken;
        }

        return new Client([
            'base_uri' => $this->baseUri,
            'headers' => $headers
        ]);
    }

    public function setToken($token) {
        $this->accessToken = $token ?? null;
    }

    public function contact() {
        return new Contact($this->client());
    }
}

function hubspot($config = []) {
    return Hubspot::instance($config);
}