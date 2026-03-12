<?php
namespace App\Controllers;
class PlaceController{
    public function placeController(string $method, ?string $id):void{
        if($id){
            $this->resourceRequest($method);
        }
        else{
            $this->collectionRequest($method);
        }
    }
    public function resourceRequest($method){
        if($method == "GET"){
            http_response_code(200);
            echo json_encode(['status' => 'resource exists']);
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }             
    }
    public function collectionRequest($method){
        if($method == "GET"){
            http_response_code(200);
            echo json_encode(['status' => 'resources exists in database']);
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }
    }
}