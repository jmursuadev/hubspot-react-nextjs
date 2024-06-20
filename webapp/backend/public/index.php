<?php

// define('APP_INIT', true);

require '../vendor/autoload.php';

use App\Backend\Controllers\AuthController;
use App\Backend\Controllers\ContactController;
use App\Backend\Gateway\Router;
use Symfony\Component\Dotenv\Dotenv;

(new Dotenv())->load(__DIR__ . '/../.env');

session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$authController = new AuthController();
$router = Router::instance();

$router->get('/oauth/redirect', AuthController::class, 'redirectToHubSpot');
$router->get('/oauth/callback', AuthController::class, 'handleCallback');
$router->get('/api/contacts', ContactController::class, 'getContacts');

$router->handle();