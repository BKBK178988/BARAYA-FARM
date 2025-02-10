<?php
// **********************
// ตัวอย่างโค้ดส่งเมลพื้นฐาน (PHP) 
// **********************

// ตรวจสอบข้อมูลที่ส่งมาจาก fetch/POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name         = $_POST['name']         ?? '';
    $email        = $_POST['email']        ?? '';
    $address      = $_POST['address']      ?? '';
    $phone        = $_POST['phone']        ?? '';
    $orderDetails = $_POST['orderDetails'] ?? '';
    $totalPrice   = $_POST['totalPrice']   ?? '';

    // ตั้งค่าหัวข้อและเนื้อหาอีเมล
    $to       = "Barame07042536@gmail.com"; // เปลี่ยนเป็นอีเมลผู้ขาย (ปลายทาง)
    $subject  = "New Order from " . $name;
    $message  = "Name: $name\nEmail: $email\nPhone: $phone\nAddress: $address\n";
    $message .= "Order Details:\n$orderDetails\n";
    $message .= "Total Price: $totalPrice\n";

    $headers  = "From: ".$email."\r\n".
                "Reply-To: ".$email."\r\n".
                "Content-type: text/plain; charset=UTF-8\r\n";

    // พยายามส่งอีเมล
    if (mail($to, $subject, $message, $headers)) {
        echo "Email sent successfully!";
    } else {
        echo "Failed to send email.";
    }
} else {
    echo "Invalid request method.";
}
