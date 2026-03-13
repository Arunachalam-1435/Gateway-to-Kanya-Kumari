<?php
declare(strict_types=1);
namespace App\Core;
use App\Controllers\PlaceController;
use App\Controllers\HotelController;
class Router{
    public function dispatch(string $method, string $path, ?string $id):void{
        switch($path){
            case "home":
                require __DIR__.'/../../public/pages/index.html';
                break;
            case "places":
                $this->p_controller = new PlaceController();
                $this->p_controller->placeController($method, $id);
                break;
            case 'hotels':
                $this->h_controller = new HotelController();
                $this->h_controller->hotelController($method, $id);
                break;
            default:
                echo json_encode(['error' => "endpoint does not exist"]);
                break;
        }
    }
}