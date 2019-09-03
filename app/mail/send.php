<?php

// подключаем файл класса для отправки почты 
require 'class.phpmailer.php'; 

$type  = htmlspecialchars(trim($_POST["type"]));
$name  = htmlspecialchars(trim($_POST["name"]));
$phone = htmlspecialchars(trim($_POST["phone"]));
$email = htmlspecialchars(trim($_POST["email"]));
$text  = htmlspecialchars(trim($_POST["mess"]));

$mail = new PHPMailer();
$mail->CharSet = 'utf-8';
$mail->From = 'info@gmail.by';                              // от кого 
$mail->FromName = 'Название вашего сайта';                  // от кого 
$mail->AddAddress('alexey-xxx@mail.ru', 'owner');           // кому - адрес, Имя 
$mail->IsHTML(true);                                        // выставляем формат письма HTML 

$message = '
        <div align="left">
            <table width="100%">
                <tr width="100%">
                    <td width="100%" colspan="2" style="padding: 5px 0; font-size: 20px;" valign="top"><b>' . $type . '</b></td>
                </tr>
                <tr width="100%">
                    <td width="20%" style="padding: 5px 0;" valign="top"><b>Имя</b></td>
                    <td width="80%" style="padding: 5px 0;" valign="top">' . $name . '</td>
                </tr>
                <tr width="100%">
                    <td width="20%" style="padding: 5px 0;" valign="top"><b>Телефон</b></td>
                    <td width="80%" style="padding: 5px 0;" valign="top">' . $phone . '</td>
                </tr>
                <tr width="100%">
                    <td width="20%" style="padding: 5px 0;" valign="top"><b>Email</b></td>
                    <td width="80%" style="padding: 5px 0;" valign="top">' . $email . '</td>
                </tr>
                <tr width="100%">
                    <td width="20%" style="padding: 5px 0;" valign="top"><b>Сообщение</b></td>
                    <td width="80%" style="padding: 5px 0;" valign="top">' . $text. '</td>
                </tr>
            </table>
        </div>';

$mail->Subject = "Заявка с сайта";

// Если был файл, то прикрепляем его к письму 
if(isset($_FILES['attachfile'])) { 
    if($_FILES['attachfile']['error'] == 0){ 
            $mail->AddAttachment($_FILES['attachfile']['tmp_name'], $_FILES['attachfile']['name']); 
    } 
}

// Если было изображение, то прикрепляем его в виде картинки к телу письма. 
if(isset($_FILES['attachimage'])) { 
     if($_FILES['attachimage']['error'] == 0){ 
        if (!$mail->AddEmbeddedImage($_FILES['attachimage']['tmp_name'], 'my-attach', 'image.gif', 'base64', $_FILES['attachimage']['type'])) 
             die ($mail->ErrorInfo); 
        $message .= 'А вот и наша картинка:<br /><img src="cid:my-attach" border=0><br />я показал как ее прикреплять, соответственно Вам осталось вставить ее в нужное место Вашего письма ;-) '; 
     } 
}
                

$mail->Body = $message;
$mail->Send();

// Ответ в формате JSON
$test = array("111","222","333");
echo json_encode($test);