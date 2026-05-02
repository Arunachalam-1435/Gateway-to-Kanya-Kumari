<?php
namespace App\Controllers;
use App\Models\PlaceModel;
class PlaceController{
	public function __construct(){
		$this->model = new PlaceModel();
	}
    public function placeController(string $method):void{
       if($method == "GET"){
            $result = $this->model->getAllPlaces();
            header("Content-Type: application/json");
            echo json_encode($result);
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }
    }
}