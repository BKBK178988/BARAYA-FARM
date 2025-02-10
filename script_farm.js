// Updated code to ensure cart toggles properly
// and fix typical mistakes (ID mismatch, event handlers, etc.)

// 1) Declare cartFarm only once
if (typeof cartFarm === 'undefined') {
    var cartFarm = [];
  }
  
  // 2) Load cart from localStorage on DOMContentLoaded
  // and update the cart display.
  document.addEventListener("DOMContentLoaded", function() {
      try {
          let storedCart = localStorage.getItem("cartFarm");
          let storedTotal = localStorage.getItem("totalPriceFarm");
  
          if (storedCart) {
              cartFarm = JSON.parse(storedCart);
          }
      } catch (error) {
          console.error(getTranslation("localStorage-error"), error);
      }
  
      updateCartFarm();
  });
  
  function addToCartFarm(name, price) {
      let existingItem = cartFarm.find(item => item.name === name);
      if (existingItem) {
          existingItem.quantity++;
      } else {
          cartFarm.push({ name, price, quantity: 1 });
      }
      updateCartFarm();
  }
  
  function removeFromCartFarm(name) {
      if (cartFarm.length === 0) return;
  
      let itemIndex = cartFarm.findIndex(item => item.name === name);
      if (itemIndex !== -1) {
          if (cartFarm[itemIndex].quantity > 1) {
              cartFarm[itemIndex].quantity--;
          } else {
              cartFarm.splice(itemIndex, 1);
          }
      }
      updateCartFarm();
  }
  
  function updateCartFarm() {
      let cartList = document.getElementById("cart-items-farm");
      let totalPriceElement = document.getElementById("total-price-farm");
      let cartCountElement = document.getElementById("cart-count-farm");
      let lineOrderButton = document.getElementById("lineOrderButtonFarm");
  
      if (!cartList || !totalPriceElement || !cartCountElement || !lineOrderButton) {
        console.warn("DOM elements for cart not found.");
        return;
      }
  
      cartList.innerHTML = "";
      let total = 0;
      let totalItems = 0;
  
      cartFarm.forEach(item => {
          let li = document.createElement("li");
          li.innerHTML = `
              ${item.name} x${item.quantity} - ${item.price * item.quantity} ${getTranslation("currency")} 
              <button onclick=\"removeFromCartFarm('${item.name}')\">❌ ${getTranslation("remove")}</button>
          `;
          cartList.appendChild(li);
  
          total += item.price * item.quantity;
          totalItems += item.quantity;
      });
  
      cartCountElement.textContent = totalItems;
      totalPriceElement.textContent = `${getTranslation("total-price")}: ${total} ${getTranslation("currency")}`;
  
      localStorage.setItem("cartFarm", JSON.stringify(cartFarm));
      localStorage.setItem("totalPriceFarm", total);
  
      let message = cartFarm.length > 0
          ? `${getTranslation("order-message-start")}\n${cartFarm.map(item => `${item.name} x${item.quantity} - ${item.price * item.quantity} ${getTranslation("currency")}`).join("\n")}`
          : getTranslation("order-message-empty");
  
      let lineURL = `https://line.me/ti/p/~bk0704?text=${encodeURIComponent(message)}`;
      lineOrderButton.href = lineURL;
  }
  
  function toggleCartFarm() {
      let cartElement = document.getElementById("cart-farm");
      if (!cartElement) {
          console.error(getTranslation("cart-not-found"));
          return;
      }
      cartElement.classList.toggle("hidden");
  }
  
  function getTranslation(key) {
      const translations = {
          th: {
              "localStorage-error": "❌ localStorage ใช้งานไม่ได้:",
              "remove": "ลบ",
              "currency": "บาท",
              "total-price": "ราคารวม",
              "order-message-start": "สวัสดี! ฉันต้องการสั่งซื้อสินค้า:",
              "order-message-empty": "สวัสดี! ฉันต้องการสอบถามข้อมูลเพิ่มเติมเกี่ยวกับสินค้า",
              "cart-not-found": "❌ ไม่พบ <div id='cart-farm'> ใน HTML"
          },
          en: {
              "localStorage-error": "❌ localStorage is not accessible:",
              "remove": "Remove",
              "currency": "THB",
              "total-price": "Total Price",
              "order-message-start": "Hello! I would like to order the following products:",
              "order-message-empty": "Hello! I would like to inquire about the products.",
              "cart-not-found": "❌ <div id='cart-farm'> not found in HTML"
          },
          zh: {
              "localStorage-error": "❌ localStorage 无法使用:",
              "remove": "删除",
              "currency": "泰铢",
              "total-price": "总价",
              "order-message-start": "你好！我想订购以下商品:",
              "order-message-empty": "你好！我想咨询有关产品的信息。",
              "cart-not-found": "❌ HTML 中未找到 <div id='cart-farm'>"
          }
      };
      let lang = localStorage.getItem("language") || "th";
      return translations[lang][key] || key;
  }
  
  // Optional: Prevent checkout if empty cart
  const checkoutLink = document.getElementById("checkoutLink");
  if (checkoutLink) {
    checkoutLink.addEventListener("click", function(e) {
      if (!cartFarm || cartFarm.length === 0) {
        e.preventDefault();
        alert("❌ กรุณาเพิ่มสินค้าลงตะกร้าก่อนดำเนินการสั่งซื้อ");
      }
    });
  }
  
  /*
   =============================
   Test Cases:
   =============================
   1) Empty cart => Checkout => Alert.
   2) Add items => Checkout => Goes to checkout_farm.html.
   3) Toggle cart => cart-farm visible/hidden.
   4) Switch language => text changes.
  */
  
