/************************************************
 * EmailJS Init
 ************************************************/
emailjs.init("EUHurGnUrY9Q-SbaO");

document.addEventListener("DOMContentLoaded", function() {
    let cartData = localStorage.getItem("cart");
    let totalPrice = localStorage.getItem("totalPrice");

    if (!cartData || cartData === "[]") {
        alert(getTranslation("cart-empty"));
        window.location.href = "index.html";
        return;
    }

    let cart = JSON.parse(cartData);
    let qrImage = document.getElementById("qr-code");

    let promptpayNumber = "0639392988";
    let qrLink = `https://promptpay.io/${promptpayNumber}/${totalPrice}.png`;

    if (qrImage) {
        qrImage.src = qrLink;
    } else {
        console.error(getTranslation("qr-error"));
    }
});

function sendOrderToEmail(name, email, address, phone, orderDetails, totalPrice, slipFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const slipBase64 = event.target.result;
            const order_id = "BRY-" + Math.floor(100000 + Math.random() * 900000);

            const templateParams = {
                name,
                email,
                address,
                phone,
                order: orderDetails,
                total: totalPrice,
                order_id,
                slip_image: slipBase64
            };

            emailjs.send("service_8arkcft", "template_7s28pv9", templateParams)
                .then(function(response) {
                    alert(getTranslation("order-success"));
                    resolve();
                }, function(error) {
                    console.error(getTranslation("email-error"), error);
                    alert(getTranslation("email-fail"));
                    reject(error);
                });
        };

        reader.onerror = function(error) {
            console.error(getTranslation("email-error"), error);
            alert(getTranslation("email-fail"));
            reject(error);
        };

        reader.readAsDataURL(slipFile);
    });
}

function confirmOrder() {
    let name = document.getElementById("customer-name").value;
    let email = document.getElementById("customer-email").value;
    let address = document.getElementById("customer-address").value;
    let phone = document.getElementById("customer-phone").value;
    let slipFile = document.getElementById("slipUpload").files[0];

    if (!name || !email || !address || !phone || !slipFile) {
        alert(getTranslation("form-incomplete"));
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert(getTranslation("cart-empty"));
        return;
    }

    let orderDetails = cart.map(item => `📦 ${item.name} x${item.quantity} - ${item.price * item.quantity} ${getTranslation("currency")}`).join("\n");
    let totalPrice = localStorage.getItem("totalPrice");

    sendOrderToEmail(name, email, address, phone, orderDetails, totalPrice, slipFile)
    .then(() => {
        alert(getTranslation("order-success"));

        localStorage.removeItem("cart");
        localStorage.removeItem("totalPrice");

        window.location.href = "index.html";
    })
    .catch(error => {
        console.error(getTranslation("order-error"), error);
    });
}

function getTranslation(key) {
    const translations = {
        th: {
            "cart-empty": "⚠️ ตะกร้าสินค้าว่างเปล่า! กลับไปเลือกสินค้าก่อนทำการชำระเงิน",
            "qr-error": "❌ ไม่พบ <img id='qr-code'> ใน HTML",
            "email-error": "❌ เกิดข้อผิดพลาดในการส่งอีเมล",
            "email-fail": "❌ เกิดข้อผิดพลาดในการส่งอีเมล",
            "form-incomplete": "⚠️ กรุณากรอกข้อมูลให้ครบถ้วน และแนบสลิปการโอนเงิน!",
            "order-success": "✅ สั่งซื้อสำเร็จ! อีเมลแจ้งเตือนถูกส่งแล้ว",
            "order-error": "❌ เกิดข้อผิดพลาดในการสั่งซื้อ",
            "currency": "บาท"
        },
        en: {
            "cart-empty": "⚠️ Your cart is empty! Please select products before proceeding to checkout.",
            "qr-error": "❌ <img id='qr-code'> not found in HTML",
            "email-error": "❌ Error sending email",
            "email-fail": "❌ Failed to send email",
            "form-incomplete": "⚠️ Please fill in all fields and upload the payment slip!",
            "order-success": "✅ Order placed successfully! A confirmation email has been sent.",
            "order-error": "❌ Error placing order",
            "currency": "THB"
        },
        zh: {
            "cart-empty": "⚠️ 购物车为空！请先选择商品再结账。",
            "qr-error": "❌ HTML 中未找到 <img id='qr-code'>",
            "email-error": "❌ 发送电子邮件时出错",
            "email-fail": "❌ 电子邮件发送失败",
            "form-incomplete": "⚠️ 请填写所有字段并上传付款凭证！",
            "order-success": "✅ 订单已成功下单！确认电子邮件已发送。",
            "order-error": "❌ 订单提交失败",
            "currency": "泰铢"
        }
    };
    let lang = localStorage.getItem("language") || "th";
    return translations[lang][key] || key;
}
