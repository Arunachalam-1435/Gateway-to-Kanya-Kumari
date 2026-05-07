<?php
namespace App\Controllers;
use App\Models\UserModel;
use App\Core\Database;
use PDO;
class UserController{
    private PDO $pdo;
	public function __construct(){
		$this->model = new UserModel();
        $conn = new Database();
        $this->pdo = $conn->connect();
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
                header("Location:/home#login-section");
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
            if(isset($_SESSION['user_id'])){
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
            if(isset($_SESSION['user_id'])){
                $result = $this->model->getOrders($_SESSION['user_id']);
                if($result != False){
                    http_response_code(200);
                    echo json_encode($result);
                }
                else{
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
        elseif($method == "DELETE"){
            $data = json_decode(file_get_contents("php://input"), true);
            if(isset($_SESSION['user_id'])){
                $result = $this->model->deleteOrder($_SESSION['user_id'], $data['order_id'], $data['product_name']);
                if($result != False){
                    http_response_code(200);
                    echo json_encode([
                        "status" => "success",
                        "message" => "Order Cancelled"
                    ]);
                }
                else{
                    echo json_encode([
                        "status" => "error",
                        "message" => "No orders found"
                    ]);
                }
            }
            else{
                http_response_code(401);
                echo json_encode([
                    "status" => "error", 
                    "message" => "User session is not available. Please login"
                ]);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET, POST, DELETE");
        }
    }
    public function roomsRequest($method){
        header("Content-Type: application/json");
        if($method == "POST"){
            $data = json_decode(file_get_contents("php://input"), true);
            if(isset($_SESSION['user_id'])){
                $result = $this->model->bookRoom($_SESSION['user_id'], $data['hotel_name'], 
                $data['price'], $data['check_in'], $data['check_out'], $data['person_count']);
                if($result != False){
                    http_response_code(201);
                    echo json_encode([
                        "status" => "success", 
                        "message" => "Room successfully booked"
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
            if(isset($_SESSION['user_id'])){
                $result = $this->model->getRoom($_SESSION['user_id']);
                if($result != False){
                    http_response_code(200);
                    echo json_encode($result);
                }
                else{
                    echo json_encode([
                        "status" => "error",
                        "message" => "No rooms found"
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
        elseif($method == "DELETE"){
            if(isset($_SESSION['user_id'])){
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->model->cancelRoom($_SESSION['user_id'], $data['room_id'], $data['hotel_name']);
                if($result != False){
                    http_response_code(200);
                    echo json_encode([
                        "status" => "success",
                        "message" => "Booking Cancelled"
                    ]);
                }
                else{
                    echo json_encode([
                        "status" => "error",
                        "message" => "No orders found"
                    ]);
                }
            }
            else{
                http_response_code(401);
                echo json_encode([
                    "status" => "error", 
                    "message" => "User session is not available. Please login"
                ]);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET, POST, DELETE");
        }
    }
    public function userRequest($method){
        header("Content-Type: application/json");
        $data = json_decode(file_get_contents("php://input"), true);
        if($method == "GET"){
            $stmt = "SELECT * FROM users.users";
            $result = $this->pdo->query($stmt);
            $result = $result->fetchAll();
            if(!empty($result)){
                echo json_encode($result);
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "No user Found"
                ]);
            }
        }
        elseif($method == "DELETE"){
            $user_id = $data['user_id'];
            $stmt = $this->pdo->prepare("DELETE FROM users.users WHERE 
            id=:user_id");
            $stmt->bindValue(':user_id', $user_id);
            if($stmt->execute()){
                echo json_encode([
                    "status" => "success",
                    "message" => "User Deleted Successfully"
                ]);
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "something went wrong"
                ]);
            }
        }
        else{
            echo json_encode([
                "status" => "error",
                "message" => "Something went wrong"
            ]);
        }
    }
    public function allOrders($method){
        $data = json_decode(file_get_contents("php://input"), true);
        header("Content-Type: application/json");
        if($method == "GET"){
            $stmt = "SELECT * FROM users.orders";
            $result = $this->pdo->query($stmt);
            $result = $result->fetchAll();
            if(!empty($result)){
                echo json_encode($result);
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "No order Found"
                ]);
            }
        }
        elseif($method == "DELETE"){
            $stmt = $this->pdo->prepare("DELETE FROM users.orders WHERE user_id=:user_id AND order_id=:order_id");
            $stmt->bindValue(':user_id', $data['user_id']);
            $stmt->bindValue(':order_id', $data['order_id']);
            if($stmt->execute()){
                echo json_encode([
                    "status" => "success",
                    "message" => "Order Successfully deleted"
                ]);
            }
            else{
                echo json_encode([
                    "status" => "success",
                    "message" => "Can't cancel order"
                ]);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET, DELETE");
        }
    }
    public function allBookings($method){
        header("Content-Type: application/json");
        if($method == "GET"){
            $stmt = $this->pdo->prepare("SELECT * FROM users.rooms");
            $stmt->execute();
            $result = $stmt->fetchAll();
            if(!empty($result)){
                echo json_encode($result);
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "No bookings found"
                ]);
            }
        }
        elseif($method == "DELETE"){
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $this->pdo->prepare("DELETE FROM users.rooms WHERE user_id=:user_id AND room_id=:room_id");
            $stmt->bindValue(':user_id', $data['user_id']);
            $stmt->bindValue(':room_id', $data['room_id']);
            if($stmt->execute()){
                $stmt = $this->pdo->prepare("UPDATE business.hotels SET available_rooms = available_rooms + 1 WHERE name = ?");
                if($stmt->execute([$data['hotel_name']])){
                    echo json_encode([
                        "status" => "success",
                        "message" => "Booking Successfully cancelled"
                    ]);
                }
                else{
                    echo json_encode([
                        "status" => "error",
                        "message" => "Can't cancel booking"
                    ]);
                }
            }
            else{
                echo json_encode([
                    "status" => "error",
                    "message" => "Can't execute query"
                ]);
            }
        }
        else{
            http_response_code(405);
            header("Allow: GET, DELETE");
        }
    }
}