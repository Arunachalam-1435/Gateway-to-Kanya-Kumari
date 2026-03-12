<?php
declare(strict_types=1);
namespace App\Core;
use App\Controllers\PlaceController;
use App\Controllers\HotelController;
class Router{
    public array $routes = array("places", "hotels");
    public function __construct(){
		$this->p_controller = new PlaceController();
        $this->h_controller = new HotelController();
	}
    public function dispatch(string $method, string $path, ?string $id):void{
        switch($path){
            case "places":
                $this->p_controller->placeController($method, $id);
                break;
            case 'hotels':
                $this->h_controller->hotelController($method, $id);
                break;
            default:
                echo json_encode(['error' => "endpoint does not exist"]);
                break;
        }
    }
}