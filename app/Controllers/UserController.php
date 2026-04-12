<?php
namespace App\Controllers;
use App\Models\UserModel;
class UserController{
	public function __construct(){
		$this->model = new UserModel();
	}
    public function getUser($method){
        header("Content-Type: application/json");    
        if($method == "GET"){
            if(isset($_SESSION['user_id'])){
                echo json_encode([
                "status" => "success",
                "username" => $_SESSION['username'],
                "email" => $_SESSION['email_id']
                ]);
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "redirect" => "/home#login-secion"
                ]);
            }
        }
        else{
            echo json_encode([
                "status" => "error",
                "redirect" => "/home#login-section"
            ]);
        }
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

        header("Content-Type: application/json");
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
                session_regenerate_id(true);
                $_SESSION['user_id'] = $result['id'];
                $_SESSION['username'] = $result['username'];
                $_SESSION['email_id'] = $result['email'];
                http_response_code(200);
                echo json_encode([
                    "status" => "success"
                ]);
            }
            else{
                http_response_code(400);
                echo json_encode([
                    "status" => "error",
                    "message" => "Invalid Password",
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
    public function ordersRequest($method){
        header("Content-Type: application/json");
        if($method == "POST"){
            $data = json_decode(file_get_contents("php://input"), true);
            if($_SESSION){
                $result = $this->model->setOrder($_SESSION['user_id'], $data['product_name'], 
                $data['price'], $data['order_date']);
                if($result != False){
                    http_response_code(201);
                    echo json_encode([
                        "status" => "success", 
                        "message" => "Order successfully placed"
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
            else{
                http_response_code(404);
                echo json_encode([
                    "status" => "error", 
                    "message" => "User session is not available. Please login"
                ]);
            }
        }
        elseif($method == "GET"){
            if($_SESSION){
                $result = $this->model->getOrders($_SESSION['user_id']);
                if($result != False){
                    http_response_code(200);
                    echo json_encode($result);
                }
                else{
                    http_response_code(404);
                    echo json_encode([
                        "status" => "error",
                        "message" => "No orders found"
                    ]);
                }
            }
            else{
                http_response_code(404);
                echo json_encode([
                    "status" => "error", 
                    "message" => "User session is not available. Please login"
                ]);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET, POST");
        }
    }
}