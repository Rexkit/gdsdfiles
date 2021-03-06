<?php

header('Content-Type: application/json; charset=UTF-8');
include 'config/core.php';
include 'models/Post.php';

// POST
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    sendJsonResponse(['error' => 'Bad Request Method'], 405);
}

$title = $_POST['title'];
$description = $_POST['description'];
$price = $_POST['price'];
$category_id = $_POST['category_id'];
$user_id = $_POST['user_id'];
$exchangeable = $_POST['exchangeable'];
$status = $_POST['status'];
$city = $_POST['city'];
$created_at = $_POST['created_at'];

$post = new Post();

$post->title = $title;
$post->description = $description;
$post->price = $price;
$post->category_id = $category_id;
$post->user_id = $user_id;
$post->exchangeable = $exchangeable;
$post->status = $status;
$post->city = $city;
$post->created_at = $created_at;
// sendJsonResponse(['error' => $post], 400);
$result = $post->create();
$upm_p_id = $result;
// sendJsonResponse($result, 201);

if ((int) $result <= 0) {
    sendJsonResponse(['error' => 'The request could not be completed'], 400);
}
$count = count($_FILES['fileselect']['name']);
$uploadDirectory = "uploads/";
for ($i = 0; $i < $count; $i++) {
    if (isset($_FILES['fileselect'])) {
        $fileName = $_FILES['fileselect']['name'][$i];
        $fileTmpName = $_FILES['fileselect']['tmp_name'][$i];
        $fileNameCmps = explode(".", $fileName);
		// $fileExtension = strtolower(end($fileNameCmps));
		$fileExtension = substr($fileName, strrpos($fileName, '.', -1), strlen($fileName));
		$fileName = time().rand(10,10000) . '-' . $result;
        $newFileName = $fileName  . $fileExtension;
		$upm_status = 1;
        $dest_path = $uploadDirectory . $newFileName;
		move_uploaded_file($fileTmpName, $dest_path);
		$post->uploadPostImg($fileExtension, $fileName, $upm_status, $upm_p_id);
    }
}

sendJsonResponse($upm_p_id, 201);
