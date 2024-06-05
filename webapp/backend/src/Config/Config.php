<?php

namespace Sona\Backend\Config;

class Config
{
    public static $clientId = '';
    public static $clientSecret = '';
    public static $redirectUri = 'http://localhost:8080/oauth/callback';
    public static $scope = 'crm.objects.contacts.read';
    public static $frontendUrl = 'http://localhost:3000';
}
