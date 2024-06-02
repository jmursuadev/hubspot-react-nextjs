<?php

require '../vendor/autoload.php';

use Sona\Backend\Controllers\AuthController;
use Sona\Backend\Controllers\ContactController;
use Sona\Backend\Gateway\Router;

session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$authController = new AuthController();
$router = Router::instance();

$router->get('/oauth/redirect', AuthController::class, 'redirectToHubSpot');
$router->get('/oauth/callback', AuthController::class, 'handleCallback');
$router->get('/api/contacts', ContactController::class, 'getContacts');

$router->handle();