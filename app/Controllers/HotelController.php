<?php
namespace App\Controllers;
use App\Models\HotelModel;
class HotelController{
    public function __construct(){
		$this->model = new HotelModel();
	}
    public function hotelController(string $method):void{
        if($method == "GET"){
            $result = $this->model->getAllHotels();
            header("Content-Type: application/json");
            echo json_encode($result);
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }
    }
}