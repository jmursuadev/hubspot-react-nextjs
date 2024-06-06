<?php

namespace App\Backend\Controllers;

use GuzzleHttp\Client;
use App\Backend\Config\Config;

class AuthController
{
    public function getAccessToken()
    {
        return isset($_COOKIE['access_token']) ? $_COOKIE['access_token'] : null;
    }

    public function getRefreshToken()
    {
        return isset($_COOKIE['refresh_token']) ? $_COOKIE['refresh_token'] : null;
    }

    public function redirectToHubSpot()
    {
        $authorizationUrl = 'https://app.hubspot.com/oauth/authorize?' . http_build_query([
            'client_id' => Config::$clientId,
            'redirect_uri' => Config::$redirectUri,
            'scope' => Config::$scope
        ]);

        header('Location: ' . $authorizationUrl);
        exit;
    }

    public function handleCallback()
    {
        if (isset($_GET['code'])) {
            $code = $_GET['code'];

            $client = new Client();
            $response = $client->post('https://api.hubapi.com/oauth/v1/token', [
                'form_params' => [
                    'grant_type' => 'authorization_code',
                    'client_id' => Config::$clientId,
                    'client_secret' => Config::$clientSecret,
                    'redirect_uri' => Config::$redirectUri,
                    'code' => $code
                ]
            ]);

            $body = $response->getBody();
            $data = json_decode($body, true);
            
            if (isset($data['access_token']) && isset($data['refresh_token'])) {
                $_SESSION['refresh_token'] = $data['refresh_token'];

                // save access token as http only cookie
                setcookie('access_token', $data['access_token'], time() + 3600, '/', 'localhost', false, true);
                setcookie('refresh_token', $data['refresh_token'], time() + 3600, '/', 'localhost', false, true);
                header('Location: ' . Config::$frontendUrl);
                exit;
            } else {
                echo "Error retrieving access token.";
            }
        } else {
            echo "No authorization code received.";
        }
    }

    public function refreshAccessToken()
    {
        if ($this->getRefreshToken()) {
            $client = new Client();
            $response = $client->post('https://api.hubapi.com/oauth/v1/token', [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'client_id' => Config::$clientId,
                    'client_secret' => Config::$clientSecret,
                    'refresh_token' => $this->getRefreshToken()
                ]
            ]);

            $body = $response->getBody();
            $data = json_decode($body, true);

            if (isset($data['access_token'])) {
                // save access token as http only cookie
                setcookie('access_token', $data['access_token'], time() + 3600, '/', 'localhost', false, true);
                setcookie('refresh_token', $data['refresh_token'], time() + 3600, '/', 'localhost', false, true);
                if (isset($data['refresh_token'])) {
                    $_SESSION['refresh_token'] = $data['refresh_token'];
                }
                return true;
            } else {
                return false;
            }
        }
        
        return false;
    }
}
