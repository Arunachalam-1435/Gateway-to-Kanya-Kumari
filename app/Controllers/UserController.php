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
            header("Allow: POST");
            return;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;
        $email = $data['email'] ?? null;

        header("Content-Type: application/json");
        if(empty($username) || empty($password) || empty($email)){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "some input field is missing"
            ]);
            return;
        }
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Invalid email address format"
            ]);
            return;
        }
        if(strlen($password) < 8){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Password mush have at least 8 characters"
            ]);
            return;
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $result = $this->model->createUser($username, $email, $hash);
        
        if($result != false){ 
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "redirect" => "/home#login-section"
            ]);
        }
        else{
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "something went wrong"
            ]);
        }
    }
    public function userLogin($method){
        if($method != "POST"){
            http_response_code(405);
            header("Allow: POST");
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if(empty($email) || empty($password)){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "some input field is missing"
            ]);
            return;
        }

        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            http_response_code(400);
            echo json_encode([
                "status" => "error",
                "message" => "Invalid email address format"
            ]);
            return;
        }

        $result = $this->model->authUser($email);

        if($result != false){
            if(password_verify($password, $result['password'])){
                http_response_code(200);
                echo json_encode([
                    "status" => "success",
                    "username" => $result["username"],
                    "email" => $result["email"]
                ]);
            }
            else{
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "message" => "Invalid Password",
                    "password_hash" => $result['password'],
                    "password" => $password,
                    "hash" => $hash
                ]);
            }
        }
        else{
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "User Not Found"
            ]);
        }
    }
}