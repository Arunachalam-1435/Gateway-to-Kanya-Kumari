<?php
    declare(strict_types=1);
    require 'config/db.php';
    header("Content-type: application/json; charset=UTF-8");
    $parts = explode("/", $_SERVER['REQUEST_URI']);
    print_r($parts);