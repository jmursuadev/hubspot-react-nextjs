<?php

namespace App\Backend\Services\Hubspot\Endpoints;

class Contact extends Endpoint {

    public function getObjectSlug() {
        return 'companies';
    }

    public function search($request = []) {
        $params = [
            'properties' => [
                'name',
                'domain'
            ]
        ];

        return parent::search($this->searchDefaultParams($request, $params));
    }
}