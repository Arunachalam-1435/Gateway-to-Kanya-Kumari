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
        elseif($method == "POST"){
            header("Content-Type: application/json");
            $name = $_POST['name'];
            $fee  = $_POST['fee'];
            $available_rooms = $_POST['available_rooms'];
            $fname = $_FILES['img']['name'];
            $tmp = $_FILES['img']['tmp_name'];
            $path = "/home/romeo/Gateway-to-Kanya-Kumari/public/images/".$fname;
            if(move_uploaded_file($tmp, $path)){
                $path = "/images/".$fname;
                $result = $this->model->addHotel($name, $path, $fee, $available_rooms);
                if($result == true){
                    echo json_encode([
                        "status" => "success",
                        "message" => "Hotel added successfully"
                    ]);
                }
                else{
                    echo json_encode([
                        "status" => "error",
                        "message" => "Can't add hotel"
                    ]);
                }
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "Cant upload images"
                ]);
            }
        }
        elseif($method == "DELETE"){
            header("Content-Type: application/json");
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'];
            $result = $this->model->deleteHotel($id);
            if($result == true){
                echo json_encode([
                    "status" => "success",
                    "message" => "Hotel sucessfully deleted"
                ]);
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "Can't delete hotel"
                ]);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }
    }
}