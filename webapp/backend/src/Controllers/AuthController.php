<?php

namespace App\Backend\Controllers;

use GuzzleHttp\Client;

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
            'client_id' => $_ENV['CLIENT_ID'],
            'redirect_uri' => $_ENV['REDIRECT_URI'],
            'scope' => $_ENV['SCOPE']
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
                    'client_id' => $_ENV['CLIENT_ID'],
                    'client_secret' => $_ENV['CLIENT_SECRET'],
                    'redirect_uri' => $_ENV['REDIRECT_URI'],
                    'code' => $code
                ]
            ]);

            $body = $response->getBody();
            $data = json_decode($body, true);
            
            if (isset($data['access_token']) && isset($data['refresh_token'])) {
                // save access token as http only cookie
                setcookie('access_token', $data['access_token'], time() + 3600, '/', 'localhost', false, true);
                setcookie('refresh_token', $data['refresh_token'], time() + 3600, '/', 'localhost', false, true);
                header('Location: ' . $_ENV['FRONTEND_URL']);
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
                    'client_id' => $_ENV['CLIENT_ID'],
                    'client_secret' => $_ENV['CLIENT_SECRET'],
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
                    $_COOKIE['refresh_token'] = $data['refresh_token'];
                }
                return true;
            } else {
                return false;
            }
        }
        
        return false;
    }
}
