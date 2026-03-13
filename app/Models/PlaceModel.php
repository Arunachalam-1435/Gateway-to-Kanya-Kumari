<?php
namespace App\Models;
use App\Core\Database;
use PDO;
class PlaceModel{
	private PDO $pdo;
	public function __construct(){
		$conn = new Database();
        $this->pdo = $conn->connect();
	}
	public function getPlace($id):array{
		$query = "SELECT name, ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lon FROM geo.tourist_places WHERE id=$id;";
		$result = $this->pdo->query($query);
		$result = $result->fetchAll();
		if(empty($result)){
			return array();
		}
		else{
			return $result;
		}
	}
	public function getAllPlaces():array{
		$query = "SELECT id, name, ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lon FROM geo.tourist_places;";
		$result = $this->pdo->query($query);
		$result = $result->fetchAll();
		return $result;
	}
}