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
		$query = "SELECT name,ST_X(location::geometry), ST_Y(location::geometry) FROM geo.tourist_places WHERE id=$id;";
		$result = $this->pdo->query($query);
		$result = $result->fetchAll();
		if(empty($result)){
			return array("error" => "Given Place does not exists");
		}
		else{
			return $result;
		}
	}
}