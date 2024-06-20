<?php

namespace App\Backend\Services\Hubspot\Endpoints;

abstract class Endpoint {
    protected $client;

    public function __construct($client) {
        $this->client = $client;
    }

    abstract function getObjectSlug();

    public function search($params = []) {
        $response = $this->client->post(sprintf('objects/%s/search', $this->getObjectSlug()), [
            'json' => $params
        ]);

        $body = $response->getBody();
        $data = json_decode($body, true);

        return $data;
    }

    public function searchDefaultParams($request = [], $params = []): array {
        $page = isset($request['page']) ? intval($request['page']) : 1;
        $limit = isset($request['limit']) ? intval($request['limit']) : 10;
        $offset = ($page - 1) * $limit;

        return array_merge([
            'limit' => $limit,
            'after' => $offset
        ], $params);
    }
}