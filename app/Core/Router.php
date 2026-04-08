<?php
declare(strict_types=1);
namespace App\Core;
use App\Controllers\PlaceController;
use App\Controllers\HotelController;
class Router{
    public function dispatch(string $method, ?string $path1, ?string $path2, ?string $id):void{
        switch($path1){
            case "home":
                require __DIR__.'/../../public/pages/index.html';
                break;
            case "api":
                if(!empty($path2)){
                    if($path2 == "places"){
                        header("Content-Type: application/json");
                        $this->p_controller = new PlaceController();
                        $this->p_controller->placeController($method, $id);
                        break;
                    }
                    elseif($path2 == "hotels"){
                        header("Content-Type: application/json");
                        $this->h_controller = new HotelController();
                        $this->h_controller->hotelController($method, $id);
                        break;
                    }
                    else{
                        header("Content-Type: application/json");
                        echo json_encode(['error' => 'endpoint does not exist']);
                        break;
                    }
                }
                else{
                    require __DIR__.'/../../public/pages/404.html';
                    break;
                }
            case "signup":
                require __DIR__.'/../../public/pages/signup.html';
                break;
            default:
                require __DIR__.'/../../public/pages/404.html';
                break;
        }
    }
}