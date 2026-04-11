<?php
namespace App\Controllers;
use App\Models\ProductModel;
class ProductController{
	public function __construct(){
		$this->model = new ProductModel();
	}
    public function productRequest($method){
        if($method == "GET"){
            $result = $this->model->getAllProducts();
            header("Content-Type: application/json");
            echo json_encode($result);
        }
        else{
            http_response_code(405);
            header("Allow: GET");
        }
    }
}