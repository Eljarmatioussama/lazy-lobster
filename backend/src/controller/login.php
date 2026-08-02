<?php 

session_start();

include('../classes/csrf.php');
require '../admin/config.php';
require '../admin/functions.php';

$csrf = new CSRF();

$connect = connect($database);

if(!$connect){
    header('Location: ./error.php');
}

$errors = '';

$captcha_enabled = !empty($security_config['captcha_enabled']);

if ($_SERVER['REQUEST_METHOD'] == 'POST'){

$captchaUser = $captcha_enabled ? cleardata($_POST["captcha"]) : '';

if(!$captcha_enabled || (isset($_SESSION['CAPTCHA_CODE']) && $_SESSION['CAPTCHA_CODE'] == $captchaUser)){

        if ($csrf->validate('login-token')) {

			$manager_email = cleardata(strtolower($_POST['manager_email']));
			$manager_password = cleardata($_POST['manager_password']);
			$password = hash('sha512', $manager_password);

			try{        
			$connect;

			}catch (PDOException $e){

			echo "Error: ." . $e->getMessage();  

			}
			$statement = $connect->prepare("SELECT * FROM managers WHERE manager_email = :manager_email AND manager_password = :manager_password AND manager_status = 1");
			$statement->execute(array(
			':manager_email' => $manager_email,
			':manager_password' => $password

			));

			$result_login = $statement->fetch();

			if ($result_login !== false){
			$_SESSION['signedin'] = true;
			$_SESSION['manager_email'] = $manager_email;
			$_SESSION['manager_name'] = $result_login['manager_name'];

			header('Location: ./home.php');

			}else{

			$errors .= "INCORRECT LOGIN DATA OR ACCESS DENIED";
			}

        }

	        else {

				$errors .= "INVALID LOGIN TOKEN";
	        }

       } else {

			$errors .= "INVALID CAPTCHA";
        }

	  }
	  

require '../views/header.view.php';
require '../views/login.view.php';
require '../views/footer.view.php';

?>