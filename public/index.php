<?php
declare(strict_types=1);
use App\Core\Router;
use Dotenv\Dotenv;
session_start();
require __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv::createImmutable(__DIR__.'/../');
$dotenv->load();
$parts = explode("/", $_SERVER['REQUEST_URI']);
$router = new Router();

if(empty($parts[1])){
    http_response_code(302);
    header("Location: /home");
    exit;
}

else{
    $path1 = $parts[1] ?? null;
    $path2 = $parts[2] ?? null;
    $id    = $parts[3] ?? null;
    $router->dispatch($_SERVER['REQUEST_METHOD'], $path1, $path2, $id);
    exit;
}