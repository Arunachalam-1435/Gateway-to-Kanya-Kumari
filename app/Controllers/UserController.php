<?php
namespace App\Controllers;
use App\Models\UserModel;
class UserController{
	public function __construct(){
		$this->model = new UserModel();
	}
    public function userRegister($method){
        if($method != "POST"){
            http_response_code(405);
            header("Allow:POST");
        }
        $data = json_decode(file_get_contents("php://input"), true);
        $username = $data['username'];
        $password = $data['password'];
        $email = $data['email'];
        $hash = password_hash($password, PASSWORD_DEFAULT);

        if(empty($username) || empty($password) || empty($email)){
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "some input field is missing"
            ]);
            return;
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Invalid email address format"
            ]);
            return;
        }
        if(strlen($password) < 8){
            header("Content-Type: application/json");
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Password mush have 8 characters"
            ]);
            return;
        }
        
        $result = $this->model->createUser($username, $email, $hash);
        
        if($result != false){ 
            header("Content-Type: application/json");
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Account created successfully"
            ]);
        }
        else{
            header("Content-Type: application/json");
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Something went wrong"
            ]);
            return;
        }
    }
}