<?php 
namespace App\Models;
use App\Core\Database;
use PDO;
use Exception;
class UserModel{
    private PDO $pdo;
    public function __construct(){
        $conn = new Database();
        $this->pdo = $conn->connect();
    }
    public function createUser($username, $email, $password): bool{
        try{
            $stmt = $this->pdo->prepare("
            INSERT INTO users.users (username, email, password) 
            VALUES (:username, :email, :password)
            ");
            $stmt->bindValue(':username', $username);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':password', $password);
            if($stmt->execute()){
                return true;
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
    public function authUser($email): array|bool{
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM users.users WHERE email = ?");
            $stmt->execute([$email]);
            $result = $stmt->fetch();
            if(!empty($result)){
                return $result;
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
    public function getOrders($user_id):array|bool{
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM users.orders WHERE user_id = ? ORDER BY order_id ASC");
            $stmt->execute([$user_id]);
            $result = $stmt->fetchAll();
            if(!empty($result)){
                return $result;
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
    public function setOrder($user_id, $product_name, $price, $order_date):bool{
        try{
            $stmt = $this->pdo->prepare("INSERT INTO users.orders(user_id, product_name, price, order_date)
            VALUES (:user_id, :product_name, :price, :order_date)");
            $stmt->bindValue(':user_id', $user_id);
            $stmt->bindValue(':product_name', $product_name);
            $stmt->bindValue(':price', $price);
            $stmt->bindValue(':order_date', $order_date);
            if($stmt->execute()){
                return true;
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
    public function deleteOrder($user_id, $order_id):bool{
        try{
            $stmt = $this->pdo->prepare("DELETE FROM users.orders WHERE user_id=:user_id AND order_id=:order_id");
            $stmt->bindValue(':user_id', $user_id);
            $stmt->bindValue(':order_id', $order_id);
            if($stmt->execute()){
                return true;
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
    public function bookRoom($user_id, $hotel_name, $price, $check_in, $check_out, $person_count):bool{
        try{
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("INSERT INTO users.rooms(user_id, hotel_name, price, check_in, check_out, person_count)
            VALUES (:user_id, :hotel_name, :price, :check_in, :check_out, :person_count)");
            
            $stmt->bindValue(':user_id', $user_id);
            $stmt->bindValue(':hotel_name', $hotel_name);
            $stmt->bindValue(':price', $price);
            $stmt->bindValue(':check_in', $check_in);
            $stmt->bindValue(':check_out', $check_out);
            $stmt->bindValue(':person_count', $person_count);
            $stmt->execute();
            
            $stmt2 = $this->pdo->prepare("UPDATE business.hotels SET available_rooms = available_rooms - 1 WHERE name = ?
            AND available_rooms > 0");
            $stmt2->execute([$hotel_name]);
            
            if($stmt2->rowCount() === 0){
                $this->pdo->rollBack();
                return false;
            }

            $this->pdo->commit();
            return true;
        }
        catch(Exception $e){
            $this->pdo->rollBack();
            return false;
        }
    }
    public function getRoom($user_id):bool|array{
        try{
            $stmt = $this->pdo->prepare("SELECT * FROM users.rooms WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $result = $stmt->fetchAll();
            if(!empty($result)){
                return $result;
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
    public function cancelRoom($user_id, $room_id, $hotel_name){
        try{
            $stmt = $this->pdo->prepare("DELETE FROM users.rooms WHERE user_id=:user_id AND room_id=:room_id");
            $stmt->bindValue(':user_id', $user_id);
            $stmt->bindValue(':room_id', $room_id);
            if($stmt->execute()){
                $stmt = $this->pdo->prepare("UPDATE business.hotels SET available_rooms = available_rooms + 1 WHERE name = ?");
                if($stmt->execute([$hotel_name])){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        catch(Exception $e){
            return false;
        }
    }
}