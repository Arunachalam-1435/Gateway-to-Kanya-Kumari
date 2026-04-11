<?php
namespace App\Models;
use App\Core\Database;
use PDO;
class ProductModel{
	private PDO $pdo;
	public function __construct(){
		$conn = new Database();
        $this->pdo = $conn->connect();
	}
	public function getAllProducts():array{
		$query = "SELECT * FROM business.shop;";
		$result = $this->pdo->query($query);
		$result = $result->fetchAll();
		return $result;
	}
}