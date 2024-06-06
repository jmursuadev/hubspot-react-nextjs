<?php

namespace App\Backend\Gateway;

class Router {
    private $requestUri;
    private $requestMethod;
    private $routes = [];
    private static $instance;

    public function __construct() {
        $this->requestUri =  $_SERVER['REQUEST_URI'];
        $this->requestMethod = $_SERVER['REQUEST_METHOD'];
    }

    public static function instance() {
        if(is_null(self::$instance)){
            self::$instance = new self();
        }
        
        return self::$instance;
    }

    public function matches($requestUri, $requestMethod) {
        $parts = parse_url($this->requestUri);
        return $parts['path'] === $requestUri && $this->requestMethod === $requestMethod;
    }

    public function getRequestUri() {
        return $this->requestUri;
    }

    public function getRequestMethod(): string{
        return $this->requestMethod;
    }

    public function getRoutes(): array{
        return $this->routes;
    }

    public function get($requestUri, $controller, $function): void{
        $this->register($requestUri, 'GET', $controller, $function);
    }

    public function post($requestUri, $controller, $function): void{
        $this->register($requestUri, 'POST', $controller, $function);
    }

    public function put($requestUri, $controller, $function): void{
        $this->register($requestUri, 'PUT', $controller, $function);
    }

    public function register($requestUri, $requestMethod, $controller, $function): void{
        $route = new Route($requestUri, $requestMethod, $controller, $function);
        
        $this->addRoute($route);
    }

    public function addRoute($route): void{
        $this->routes[] = $route;
    }

    public function handle(): void{
        foreach ($this->routes as $route) {
            if($this->matches($route->getRequestUri(), $this->requestMethod)) {
                $route->run();
                return;
            }
        }

        header("HTTP/1.0 404 Not Found");
        echo json_encode(["message" => "Endpoint not found"]);
    }
}