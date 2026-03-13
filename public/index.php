<?php
declare(strict_types=1);
use App\Core\Router;
use Dotenv\Dotenv;
require __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv::createImmutable(__DIR__.'/../');
$dotenv->load();
$parts = explode("/", $_SERVER['REQUEST_URI']);
$router = new Router();
if(empty($parts[1])){
    http_response_code(302);
    header("Location: /home");
}
else{
    if($parts[1] == 'api'){
        header("Content-type: application/json; charset=UTF-8");
        $path = $parts[2];
        $id = $parts[3] ?? null;
        $router->dispatch($_SERVER['REQUEST_METHOD'], $path, $id);
    }
    else{
        $path = $parts[1];
        $id = $parts[2] ?? null;
        $router->dispatch($_SERVER['REQUEST_METHOD'], $path, $id);
    }
}