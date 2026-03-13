<?php
namespace App\Controllers;
use App\Models\HotelModel;
class HotelController{
    public function __construct(){
		$this->model = new HotelModel();
	}
    public function hotelController(string $method, ?string $id):void{
        if($id){
            $this->resourceRequest($method, $id);
        }
        else{
            $this->collectionRequest($method);
        }
    }
    public function resourceRequest($method, $id){
        if($method == "GET"){
            $result = $this->model->getHotel($id);
            if(empty($result)){
                http_response_code(404);
                echo json_encode(["error" => "Given hotel name does not exists"]);
            }
            else{
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
            $result = $this->model->getAllHotels();
            echo json_encode($result);
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }
    }
}