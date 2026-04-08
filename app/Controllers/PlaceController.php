<?php
namespace App\Controllers;
use App\Models\PlaceModel;
class PlaceController{
	public function __construct(){
		$this->model = new PlaceModel();
	}
    public function placeController(string $method, ?string $id):void{
        if($id){
            $this->resourceRequest($method, $id);
        }
        else{
            $this->collectionRequest($method);
        }
    }
    public function resourceRequest($method, $id){
        if($method == "GET"){
			$result = $this->model->getPlace($id);
            if(empty($result)){
                header("Content-Type: application/json");
                http_response_code(404);
                echo json_encode(["error" => "Given Place does not exists"]);

            }
            else{
                header("Content-Type: application/json");
                echo json_encode($result);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }             
    }
    public function collectionRequest($method){
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
