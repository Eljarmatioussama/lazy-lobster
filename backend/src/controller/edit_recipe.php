<?php 

session_start();
if (isset($_SESSION['manager_email'])){
    
    
require '../admin/config.php';
require '../admin/functions.php';
require '../views/header.view.php';
require '../views/navbar.view.php'; 

$connect = connect($database);
if(!$connect){
	header ('Location: ' . SITE_URL . '/controller/error.php');
	}

if ($_SERVER['REQUEST_METHOD'] == 'POST'){

	$diet_title = cleardata($_POST['diet_title']);
	$diet_description = $_POST['diet_description'];
	$diet_ingredients = $_POST['diet_ingredients'];
	$diet_category = cleardata($_POST['diet_category']);
	$diet_directions = $_POST['diet_directions'];
	$diet_calories = cleardata($_POST['diet_calories']);
	$diet_carbs = cleardata($_POST['diet_carbs']);
	$diet_protein = cleardata($_POST['diet_protein']);
	$diet_fat = cleardata($_POST['diet_fat']);
	$diet_time = cleardata($_POST['diet_time']);
	$diet_featured = cleardata($_POST['diet_featured']);
	$diet_status = cleardata($_POST['diet_status']);
	$diet_price = cleardata($_POST['diet_price']);
	$diet_servings = cleardata($_POST['diet_servings']);
	$diet_id = cleardata($_POST['diet_id']);
	$diet_image_save = $_POST['diet_image_save'];
	$diet_image = $_FILES['diet_image'];
	$attributeLabels = $_POST['attribute_label'] ?? [];
	$attributeValues = $_POST['attribute_value'] ?? [];
	$attributeColors = $_POST['attribute_color'] ?? [];

	if (empty($diet_image['name'])) {
		$diet_image = $diet_image_save;
	} else{
			$imagefile = explode(".", $_FILES["diet_image"]["name"]);
			$renamefile = round(microtime(true)) . '.' . end($imagefile);
		$diet_image_upload = '../' . $items_config['images_folder'];
		move_uploaded_file($_FILES['diet_image']['tmp_name'], $diet_image_upload . 'recipe_' . $renamefile);
		$diet_image = 'recipe_' . $renamefile;
	}


$statment = $connect->prepare(
	'UPDATE diets SET diet_title = :diet_title, diet_description = :diet_description, diet_ingredients = :diet_ingredients, diet_category = :diet_category, diet_directions = :diet_directions, diet_calories = :diet_calories, diet_carbs = :diet_carbs, diet_protein = :diet_protein, diet_fat = :diet_fat, diet_time = :diet_time, diet_servings = :diet_servings, diet_featured = :diet_featured, diet_status = :diet_status, diet_price = :diet_price, diet_image = :diet_image WHERE diet_id = :diet_id'
	);

	$statment->execute(array(

		':diet_title' => $diet_title,
		':diet_description' => $diet_description,
		':diet_ingredients' => $diet_ingredients,
		':diet_category' => $diet_category,
		':diet_directions' => $diet_directions,
		':diet_calories' => $diet_calories,
		':diet_carbs' => $diet_carbs,
		':diet_protein' => $diet_protein,
		':diet_fat' => $diet_fat,
		':diet_time' => $diet_time,
		':diet_servings' => $diet_servings,
		':diet_featured' => $diet_featured,
		':diet_status' => $diet_status,
		':diet_price' => $diet_price,
		':diet_image' => $diet_image,
		':diet_id' => $diet_id

		));

	$connect->prepare('DELETE FROM diet_attributes WHERE diet_id = ?')->execute([$diet_id]);
	$attributeStatement = $connect->prepare('INSERT INTO diet_attributes (diet_id, attribute_label, attribute_value, attribute_color, attribute_order) VALUES (?, ?, ?, ?, ?)');
	foreach (is_array($attributeLabels) ? $attributeLabels : [] as $order => $rawLabel) {
		$label = trim((string)$rawLabel);
		$value = trim((string)($attributeValues[$order] ?? ''));
		$color = trim((string)($attributeColors[$order] ?? '#10e689'));
		if ($label !== '' && $value !== '') $attributeStatement->execute([$diet_id, $label, $value, $color, $order]);
	}

header('Location: ' . $_SERVER['HTTP_REFERER']);

} else{

$id_diet = id_diet($_GET['id']);
    
if(empty($id_diet)){
	header('Location: ' . SITE_URL . '/controller/home.php');
	}

$diet = get_diet_per_id($connect, $id_diet);
    
    if (!$diet){
    header('Location: ' . SITE_URL . '/controller/home.php');
}

$diet = $diet['0'];
$diet_attributes = $connect->prepare('SELECT attribute_label AS label, attribute_value AS value, attribute_color AS color FROM diet_attributes WHERE diet_id = ? ORDER BY attribute_order, attribute_id');
$diet_attributes->execute([$id_diet]);
$diet_attributes = $diet_attributes->fetchAll(PDO::FETCH_ASSOC);

}

$categories_lists = get_all_categories($connect);

require '../views/edit.recipe.view.php';
require '../views/footer.view.php';
    
} else {
		header('Location: ' . SITE_URL . '/controller/login.php');		
		}


?>
