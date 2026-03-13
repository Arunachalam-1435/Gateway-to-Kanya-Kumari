<?php
namespace App\Core;
use PDO;
use PDOException;
use Dotenv\Dotenv;
require __DIR__ . '/../../vendor/autoload.php';
class Database{
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private ?PDO $pdo = null;

    public function __construct(){
        $dotenv = Dotenv::createImmutable(__DIR__.'/../../');
        $dotenv->load();
        $this->host = $_ENV['DB_HOST'];
        $this->port = 5432;
        $this->db_name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASSWORD'];
    }
    public function connect(): PDO{
        if($this->pdo == null){
            try{
                $dsn = "pgsql:host=$this->host;port=$this->port;dbname=$this->db_name";
                $this->pdo = new PDO($dsn, $this->username, $this->password,[
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
            }
            catch(PDOException $e){
                die("DB connection failed. Because ".$e->getMessage());
            }
        }
        return $this->pdo;
    }
}