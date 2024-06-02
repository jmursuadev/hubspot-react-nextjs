<?php

// create base class for api
namespace Sona\Backend\Services;

use GuzzleHttp\Client;
use Sona\Backend\Config\Config;
use Sona\Backend\Controllers\AuthController;

class Api {
    protected $client;
    protected $authController;

    public function __construct() {
        $this->client = new Client();
        $this->authController = new AuthController();
    }

    public function refreshToken() {
        $refreshToken = $this->authController->getRefreshToken();

        if ($refreshToken) {
            $response = $this->client->post('https://api.hubapi.com/oauth/v1/token', [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'client_id' => Config::$clientId,
                    'client_secret' => Config::$clientSecret,
                    'refresh_token' => $refreshToken
                ]
            ]);

            $body = $response->getBody();
            $data = json_decode($body, true);

            if (isset($data['access_token'])) {
                $_SESSION['access_token'] = $data['access_token'];
            }
        }
    }

    public function request($method, $url, $options = []) {
        $accessToken = $this->authController->getAccessToken();
        
        if ($accessToken) {
            $options['headers']['Authorization'] = 'Bearer ' . $accessToken;
        }

        $response = $this->client->request($method, $url, $options);

        return $response;
    }

    public function get($url, $options = []) {
        return $this->request('GET', $url, $options);
    }

    public function post($url, $options = []) {
        return $this->request('POST', $url, $options);
    }
}