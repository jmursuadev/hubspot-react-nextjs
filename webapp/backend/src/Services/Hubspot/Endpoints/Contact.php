<?php

namespace App\Backend\Services\Hubspot\Endpoints;

class Contact extends Endpoint {

    public function getObjectSlug() {
        return 'contacts';
    }

    public function search($request = []) {
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

        $params = [
            'properties' => [
                'email',
                'firstname',
                'lastname',
                'hs_lifecyclestage_customer_date',
                'hs_lifecyclestage_lead_date',
                'createdate'
            ],
            'filterGroups' => [
                [
                    'filters' => $filterData
                ]
            ]
        ];

        return parent::search($this->searchDefaultParams($request, $params));
    }
}