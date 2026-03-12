<?php
    require 'vendor/autoload.php';
    $dotenv = Dotenv\Dotenv::createImmutable("/home/panther/Gateway-to-Kanya-Kumari");
    $dotenv->load();
    $host = $_ENV['DB_HOST'];
    $port = 5432;
    $db_name = $_ENV['DB_NAME'];
    $username = $_ENV['DB_USER'];
    $password = $_ENV['DB_PASSWORD'];
    try{
        $dsn = "pgsql:host=$host;port=$port;dbname=$db_name";
        $pdo = new PDO($dsn, $username, $password,[
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    }
    catch(PDOException $e){
        echo $e."\n";
        die("DB connection failed");
    }