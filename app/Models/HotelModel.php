<?php
namespace App\Models;
use App\Core\Database;
use PDO;
class HotelModel{
	private PDO $pdo;
	public function __construct(){
		$conn = new Database();
        $this->pdo = $conn->connect();
	}
	public function getAllHotels():array{
		$query = "SELECT * FROM business.hotels ORDER BY id ASC;";
		$result = $this->pdo->query($query);
		$result = $result->fetchAll();
		return $result;
	}
}