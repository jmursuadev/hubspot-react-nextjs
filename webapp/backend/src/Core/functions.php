<?php

namespace App\Backend\Core;

function response($data = [], $code = 200) {
    switch ($code) {
        case 200:
            header('HTTP/1.1 200 OK');
            break;
        case 422:
            header('HTTP/1.1 422 Unprocessable Entity');
            break;
        case 400:
            header('HTTP/1.1 400 Bad Request');
            break;
        case 500:
            header('HTTP/1.1 500 Internal Server Error');
            break;
        default:
            break;
    }

    echo json_encode($data);
    exit;
}
