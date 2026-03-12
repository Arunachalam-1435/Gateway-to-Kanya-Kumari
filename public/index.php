<?php
declare(strict_types=1);
use App\Core\Router;
require __DIR__ . '/../vendor/autoload.php';
header("Content-type: application/json; charset=UTF-8");
$parts = explode("/", $_SERVER['REQUEST_URI']);
if(empty($parts[1])){
    http_response_code(404);
    echo json_encode(['error' => 'endpoint does not exists']);
    exit;
}
$path = $parts[1];
$id = $parts[2] ?? null;
$router = new Router();
$router->dispatch($_SERVER['REQUEST_METHOD'], $path, $id);