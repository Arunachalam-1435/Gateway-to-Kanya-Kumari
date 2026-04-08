<?php 
namespace App\Models;
use App\Core\Database;
use PDO;
class UserModel{
    private PDO $pdo;
    public function __construct(){
        $conn = new Database();
        $this->pdo = $conn->connect();
    }
    /*public function authUser($username, $password){
        $stmt = $pdo->prepare("SELECT * FROM users.users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if($user && password_verify($password, $user['password'])){
            
        }
        else{

        }
    }*/
    public function createUser($username, $email, $password):string{
        $stmt = $pdo->prepare("INSERT INTO users.users (username, email, password) 
                                VALUES (:username, :email, :password) RETURNING id");
        $stmt->execute([
            'username' => $username,
            'email' => $email,
            'password' => $password
        ]);
        $result = $stmt->fetchColumn();
        if(!empty($result)){
            return "success";
        }
        else{
            return "failed";
        }
    }
}