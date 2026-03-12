<?php
    declare(strict_types=1);
    $path =  parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    require "router.php";
    $router = new Router;
    $router->add("/", function(){
        echo "This is home page";
    });
    $router->add("/about", function(){
        echo "This is about page";
    });
    $router->add("/products/{id}", function($id){
        echo "This is the page for product $id";
    });
    $router->dispatch($path);