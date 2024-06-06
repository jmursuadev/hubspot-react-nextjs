<?php

namespace App\Backend\Services;

use GuzzleHttp\Exception\ClientException;

class HubspotApi extends Api {

    public function postContacts($request) {
        $page = isset($request['page']) ? intval($request['page']) : 1;
        $offset = ($page - 1) * 10;

        $filter = isset($request['filter']) ? $request['filter'] : null;
        $dateFrom = isset($filter['from']) ? $filter['from'] : null;
        $dateTo = isset($filter['to']) ? $filter['to'] : null;

        $filterData = [];

        if ($dateFrom) {
            $filterData[] = [
                'propertyName' => 'hs_lifecyclestage_customer_date',
                'operator' => 'GTE',
                'value' => $dateFrom
            ];
        }

        if ($dateTo) {
            $filterData[] = [
                'propertyName' => 'hs_lifecyclestage_customer_date',
                'operator' => 'LTE',
                'value' => $dateTo
            ];
        }

        $filterGroup = [];
        $filterGroup[] = [
            'filters' => $filterData
        ];

        $response = $this->post('https://api.hubapi.com/crm/v3/objects/contacts/search', [
            'json' => [
                'limit' => 10,
                'after' => $offset,
                'properties' => [
                    'email',
                    'firstname',
                    'lastname',
                    'hs_lifecyclestage_customer_date',
                    'hs_lifecyclestage_lead_date',
                    'createdate'
                ],
                'filterGroups' => $filterGroup
            ]
        ]);

        $body = $response->getBody();
        $data = json_decode($body, true);

        return $data;
    }

    public function getContacts($request) {
        try{
            return $this->postContacts($request);
        }catch (ClientException $e) {
            // If the access token has expired, refresh it
            if ($e->getResponse()->getStatusCode() == 401) {
                if ($this->authController->refreshAccessToken()) {
                    return $this->postContacts($request);
                } else {
                    echo 'Failed to refresh access token. Please authenticate again.';
                    exit;
                }
            } else {
                echo 'API request failed: ' . $e->getMessage();
                exit;
            }
        }


    }
}