<?php
ini_set('display_errors', 0);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
if(isset($_POST["submit"])){
   
    $email = 'pahattutip@gmail.com';
    $fromWho = 'pahattutip@gmail.com';
    $message = 'pahattutip@gmail.com';

    //Load composer's autoloader
    $mail = new PHPMailer(true);                            
    try {
        //Server settings
        $mail->isSMTP();                                     
        $mail->Host = 'smtp.gmail.com';                      
        $mail->SMTPAuth = true;                             
        $mail->Username = 'pahattutip@gmail.com';     
        $mail->Password = 'dqdpvxhnwyszkebj';             
        $mail->SMTPOptions = array(
            'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
            )
        );                         
        $mail->SMTPSecure = 'ssl';                           
        $mail->Port = 465;                                   

        //Send Email
        $mail->setFrom('pahattutip@gmail.com');
        
        //Recipients
        $mail->addAddress($email);              
        $mail->addReplyTo('pahattutip@gmail.com');
        
        //Content
        $mail->isHTML(true);                                  
        $mail->Subject = "STUDENTS FEEDBACK";
        $mail->Body = "Full Name: " . $_POST["name"] . "<br>";
        // $mail->Body .= "Category: " . $_POST["category"] . "<br>";
        $mail->Body .= "Email: " . $_POST["email"] . "<br>";
        $mail->Body .= "Phone Number: " . $_POST["phone"] . "<br>";
        $mail->Body .= "Message: " . $_POST["message"] . "<br>";
      
        $mail->send();
    echo "<script>alert('Email sent successfully!');</script>";
} catch (Exception $e) {
    echo "<script>alert('An error occurred while sending the email: " . $mail->ErrorInfo . "');</script>";
}
}

?><!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>UiTM BUS Shah Alam</title>
    <link rel="icon" href="img/logoUiTM.png" type="image/x-icon">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="Free HTML Templates" name="keywords">
    <meta content="Free HTML Templates" name="description">

    <!-- Favicon -->
    <link href="img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="css/style.css" rel="stylesheet">
</head>

<body>



    <!-- Navbar Start -->
    <div class="container-fluid p-0">
        <nav class="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-lg-5">
            <a href="index.html" class="navbar-brand ml-lg-3">
                <h4 class="m-0 display-5"><img src="img/logoUiTM.png" style="width: 40px; padding-right: 5px;">UiTM BUS Shah Alam</h4>
            </a>
            <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
                <div class="navbar-nav m-auto py-0">
                    <a href="index.php" class="nav-item nav-link">Home</a>
                    <a href="schedule.html" class="nav-item nav-link">Schedule</a>
                    <a href="route.html" class="nav-item nav-link">Route</a>
                    <a href="nearest.html" class="nav-item nav-link">Nearest Bus Stop</a>
                    <a href="location.html" class="nav-item nav-link">Location</a>
                    <a href="feedbackform.php" class="nav-item nav-link active">Feedback</a>
                </div>
            </div>
        </nav>
    </div>
    <!-- Navbar End -->


    <!-- Header Start -->
    <div class="jumbotron jumbotron-fluid mb-5">
        <div class="container text-center py-5">
            <h1 class="text-white display-3">Feedback</h1>
            <div class="d-inline-flex align-items-center text-white">
                <p class="m-0"><a class="text-white" href="index.php">Home</a></p>
                <i class="fa fa-circle px-3"></i>
                <p class="m-0">Feedback</p>
            </div>
        </div>
    </div>
    <!-- Header End -->


   <!-- Form -->
   <div class="container mt-5">
        <h1>Feedback Form</h1>
        <p>Please share your feedback regarding our system!</p>
        <form class="categoryID pt-4" method="post" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']; ?>"> 
                <div class="form-group">
                    <label for="name">Name :</label>
                    <input type="text" class="form-control" id="name" name= "name" placeholder="Enter your name">
                </div>
                
                <div class="form-group">
                    <label for="email">Email :</label>
                    <input type="email" class="form-control" id="email" name= "email" placeholder="Enter your email">
                </div>

                <div class="form-group">
                    <label for="email">Phone no :</label>
                    <input type="phone" class="form-control" id="phone" name= "phone" placeholder="Enter your phone no">
                </div>

                <div class="form-group">
                    <label for="message">Message :</label>
                    <textarea class="form-control" id="message" rows="4"name= "message" placeholder="Enter your message"></textarea>
                </div>
            <button type="submit" name="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>

  


    <!-- Footer Start -->
    <div class="container-fluid bg-dark text-white mt-5 py-5 px-sm-3 px-md-5">
        <div class="row pt-5">
            <div class=" col-md-6 mb-5">
                <h3 class="text-primary mb-4">Get In Touch</h3>
                    <p><i class="fa fa-map-marker-alt mr-2"></i>Jalan Ilmu 1/1, 40450 Shah Alam, Selangor</p>
                    <p><i class="fa fa-phone-alt mr-2"></i>+603-5544 2000</p>
                    <p><i class="fa fa-envelope mr-2"></i>uitmshahalam@biz.com</p>
            </div>

            <div class="col-md-6 mb-4">
                <h3 class="text-primary mb-4">Quick Links</h3>
                    <div class="d-flex flex-column justify-content-start">
                        <a class="text-white mb-2" href="schedule.html"><i class="fa fa-angle-right mr-2"></i>Schedule</a>
                        <a class="text-white mb-2" href="route.html"><i class="fa fa-angle-right mr-2"></i>Route</a>
                        <a class="text-white mb-2" href="nearest.html"><i class="fa fa-angle-right mr-2"></i>Nearest Bus Stop</a>
                        <a class="text-white" href="location.html"><i class="fa fa-angle-right mr-2"></i>Location</a>
                        <a class="text-white" href="feedback.html"><i class="fa fa-angle-right mr-2"></i>Feedback</a>
                    </div>
            </div>
        </div>
    </div>
    <!-- Footer End -->


    <!-- Back to Top -->
    <a href="#" class="btn btn-lg btn-primary back-to-top"><i class="fa fa-angle-double-up"></i></a>


    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
    <script src="lib/easing/easing.min.js"></script>
    <script src="lib/waypoints/waypoints.min.js"></script>
    <script src="lib/counterup/counterup.min.js"></script>
    <script src="lib/owlcarousel/owl.carousel.min.js"></script>

    <!-- Contact Javascript File -->
    <script src="mail/jqBootstrapValidation.min.js"></script>
    <script src="mail/contact.js"></script>

    <!-- Template Javascript -->
    <script src="js/main.js"></script>
</body>
</html>