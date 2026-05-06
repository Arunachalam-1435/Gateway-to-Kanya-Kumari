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
	public function addHotel($name, $img_src, $fee, $available_rooms):bool{
		$query = $this->pdo->prepare("INSERT INTO business.hotels (name, img_src, fee, available_rooms)
		VALUES (:name, :img_src, :fee, :available_rooms)");
		$query->bindValue(':name', $name);
		$query->bindValue('img_src', $img_src);
		$query->bindValue(':fee', $fee);
		$query->bindValue('available_rooms', $available_rooms);
		if($query->execute()){
			return true;
		}
		else{
			return true;
		}
	}
	public function deleteHotel($id){
		$stmt = $this->pdo->prepare("DELETE FROM business.hotels WHERE id =:id");
		$stmt->bindValue(':id', $id);
		if($stmt->execute()){
			return true;
		}
		else{
			return false;
		}
	}
}