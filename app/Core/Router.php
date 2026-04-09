<?php
declare(strict_types=1);
namespace App\Core;
use App\Controllers\PlaceController;
use App\Controllers\HotelController;
use App\Controllers\UserController;
class Router{
    public function dispatch(string $method, ?string $path1, ?string $path2, ?string $id):void{
        switch($path1){
            case "home":
                require __DIR__.'/../../public/pages/index.html';
                break;
            case "api":
                if(!empty($path2)){
                    if($path2 == "places"){
                        $this->p_controller = new PlaceController();
                        $this->p_controller->placeController($method, $id);
                        break;
                    }
                    elseif($path2 == "hotels"){
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
            case "register":
                $this->controller = new UserController();
                $this->controller->userRegister($method);
                break;
            case "login":
                $this->controller = new UserController();
                $this->controller->userLogin($method);
                break;
            case "dashboard":
                if(isset($_SESSION['user_id'])){
                    require __DIR__.'/../../public/pages/dashboard.html';
                }
                else{
                    header("Location: /home");
                    exit;
                }
                break;
            case "logout":
                session_unset();
                session_destroy();
                header("Location: /home");
                exit;
            case "user":
                $this->controller = new UserController();
                $this->controller->getUser($method);
                break;
            case "shop":
                require __DIR__.'/../../public/pages/shop.html';
                break;
            case "places":
                require __DIR__.'/../../public/pages/places.html';
                break;
            case "my-activity":
                require __DIR__.'/../../public/pages/my-activity.html';
                break;
            default:
                require __DIR__.'/../../public/pages/404.html';
                break;
        }
    }
}