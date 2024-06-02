<?php

namespace Sona\Backend\Resources;

class ContactResource {
    public static $perPage = 10;

    public static function collection($collection) {
        $data = array_map(function($item){
            return self::transform($item);
        }, $collection['results']);

        $after = isset($collection['paging']['next']['after']) ? $collection['paging']['next']['after'] : 0;
        $currentPage = intval(max(isset($_GET['page']) ? $_GET['page'] : 1, 1));
        $lastPage = ceil($collection['total'] / self::$perPage);

        return [
            'data' => $data,
            'total' => $collection['total'],
            'meta' => [
                'current_page' => $currentPage,
                'next_page' => $currentPage > $lastPage ? null : $currentPage + 1,
                'prev_page' => $currentPage <= 1 ? null : $currentPage - 1,
                'last_page' => $lastPage
            ]
        ];
    }

    public static function transform($item) {
        return [
            'id' => $item['id'],
            'firstname' => $item['properties']['firstname'],
            'lastname' => $item['properties']['lastname'],
            'email' => $item['properties']['email'],
            'customer_date' => $item['properties']['hs_lifecyclestage_customer_date'],
            'lead_date' => $item['properties']['hs_lifecyclestage_lead_date'],
            'created_date' => $item['properties']['createdate']
        ];
    }
}