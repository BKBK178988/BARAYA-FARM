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
}

);

function confirmOrder() {
  let lang = localStorage.getItem("language") || "th";
  let totalPriceFarm = localStorage.getItem("totalPriceFarm") || 0;

  let name = document.getElementById("customer-name").value.trim();
  let address = document.getElementById("customer-address").value.trim();
  let phone = document.getElementById("customer-phone").value.trim();
  let email = document.getElementById("customer-email").value.trim();
  let slipFile = document.getElementById("slipUpload").files[0];

  if (!name || !address || !phone || !email || !slipFile) {
    alert(translations[lang]["form-incomplete"]);
    return;
  }

  const MAX_WIDTH = 400;

  const img = new Image();
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result;
  };

  img.onload = function () {
    const canvas = document.createElement('canvas');
    const scaleSize = MAX_WIDTH / img.width;
    canvas.width = MAX_WIDTH;
    canvas.height = img.height * scaleSize;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // ปรับ quality ตามต้องการ

    let cartFarm = JSON.parse(localStorage.getItem("cartFarm")) || [];
    let orderDetails = cartFarm.map(item =>
      `${item.name} x${item.quantity} = ${item.price * item.quantity} ${translations[lang]["currency"]}`
    ).join("\n");
    let order_id = "BRY-" + Math.floor(100000 + Math.random() * 900000);

    const templateParams = {
      name,
      address,
      phone,
      email,
      order: orderDetails,
      total: totalPriceFarm,
      order_id,
      slip_image: compressedBase64
    };

    emailjs.send("service_8arkcft", "template_7s28pv9", templateParams)
      .then(function (response) {
        alert(translations[lang]["order-success"]);
        localStorage.removeItem("cartFarm");
        localStorage.removeItem("totalPriceFarm");
        window.location.href = "farm.html";
      }, function (error) {
        alert("❌ เกิดข้อผิดพลาด: " + JSON.stringify(error));
      });
  };

  reader.readAsDataURL(slipFile);
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
