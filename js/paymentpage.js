// Hàm chỉnh số giỏ hàng
function updateCartCount() {
  const btnCart = document.querySelector('.rounded-circle');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  btnCart.innerHTML = totalQuantity;
}

// Chỉnh giỏ hàng
// Hàm format số thành chuỗi tiền VNĐ
function formatCurrency(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Load dữ liệu giỏ hàng từ localStorage
function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const tbody = document.querySelector('#cart-table tbody');
  tbody.innerHTML = '';

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Giỏ hàng của bạn đang trống.</td></tr>';
    document.getElementById('total-price').textContent = 'Tổng tiền: 0 VNĐ';
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const totalItemPrice = item.price * item.quantity;
    totalPrice += totalItemPrice;

    const tr = document.createElement('tr');

    tr.innerHTML = `
          <td>${item.name}</td>
          <td>${formatCurrency(item.price)}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(totalItemPrice)}</td>
          <td><button data-index="${index}" class="btn-remove">Xóa</button></td>
        `;

    tbody.appendChild(tr);
  });

  document.getElementById('total-price').textContent = `Tổng tiền: ${formatCurrency(totalPrice)} VNĐ`;

  // Gán sự kiện xóa từng sản phẩm
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function () {
      const idx = Number(this.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      loadCart(); // tải lại giỏ hàng
    });
  });
}
// Load giỏ hàng khi mở trang
window.onload = loadCart;

//Thêm giỏ hàng
document.addEventListener('DOMContentLoaded', function () {
  // Lắng nghe tất cả các nút có class add-to-cart
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = Number(this.dataset.price);

      // Lấy giỏ hàng hiện tại trong localStorage hoặc tạo mới
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingProduct = cart.find(p => p.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      // Lưu lại giỏ hàng
      localStorage.setItem('cart', JSON.stringify(cart));

      alert(`${name} đã được thêm vào giỏ hàng!`);
      updateCartCount();
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});

//
document.querySelector('.btn-outline-success').addEventListener('click', function () {
  // Lấy thông tin từ form
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const message = document.getElementById('message').value.trim();

  // Lấy giỏ hàng
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Nếu form chưa điền đủ
  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.");
    return;
  }

  // Tính tổng
  let totalPrice = 0;
  let productHTML = '';

  cart.forEach(item => {
    const totalItemPrice = item.price * item.quantity;
    totalPrice += totalItemPrice;

    productHTML += `
            <p>- ${item.name} | SL: ${item.quantity} | Giá: ${formatCurrency(item.price)} VNĐ | Tổng: ${formatCurrency(totalItemPrice)} VNĐ</p>
        `;
  });

  const summary = `
        <h5>✅ Thông tin giao hàng:</h5>
        <p><strong>Họ và tên:</strong> ${name}</p>
        <p><strong>Số điện thoại:</strong> ${phone}</p>
        <p><strong>Địa chỉ:</strong> ${address}</p>
        <p><strong>Ghi chú:</strong> ${message || 'Không có'}</p>
        <hr>
        <h5>🛒 Thông tin sản phẩm:</h5>
        ${productHTML || '<p>Giỏ hàng trống</p>'}
        <hr>
        <h5>💰 Tổng tiền: ${formatCurrency(totalPrice)} VNĐ</h5>
    `;

  // Đưa vào div #order-summary
  document.getElementById('order-summary').innerHTML = summary;
});

