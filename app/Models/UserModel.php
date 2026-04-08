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
    public function createUser($username, $email, $password):bool{
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
}