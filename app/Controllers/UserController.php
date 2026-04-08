<?php
namespace App\Controllers;
use App\Models\UserModel;
class UserController{
	public function __construct(){
		$this->model = new UserModel();
	}
    public function userRegister(){
        $data = json_decode(file_get_contents("php://input"), true);
        $username = $data['username'];
        $password = $data['password'];
        $email = $data['email'];
        $hash = password_hash($password, PASSWORD_DEFAULT);

        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Invalid email address format"
            ]);
        }
        if(strlen($password) < 8){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Password mush have 8 characters"
            ]);
        }
        if(empty($username) || empty($password) || empty($email)){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "some input field is missing"
            ]);
        }
        
        $result = $this->model->createUser($username, $email, $password);
        if($result != "failed"){
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Account created successfully"
            ]);
        }
        else{
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Something went wrong"
            ]);
        }
    }
}