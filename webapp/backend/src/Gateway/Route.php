<?php

namespace Sona\Backend\Gateway;

class Route {
    private $requestUri;
    private $requestMethod;
    private $controller;
    private $function;

    public function __construct($requestUri, $requestMethod, $controller, $function) {
        $this->requestUri = $requestUri;
        $this->requestMethod = $requestMethod;
        $this->controller = $controller;
        $this->function = $function;
    }

    public function matches($requestUri, $requestMethod) {
        return $this->requestUri === $requestUri && $this->requestMethod === $requestMethod;
    }

    public function getRequestUri() {
        return $this->requestUri;
    }

    public function getRequestMethod(): string{
        return $this->requestMethod;
    }

    public function getController() {
        return $this->controller;
    }

    public function run(): void {
        $request = json_decode(file_get_contents('php://input'), true);

        if($request === null){
            $request = array();
        }

        $request = array_merge($request, $_GET);
        
        if(is_string($this->controller) && class_exists($this->controller))
        {
            $controller = new $this->controller();
        }else{
            $controller = new $this->controller();
        }

        $controller->{$this->function}($request);
    }
}