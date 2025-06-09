let productList = [];

// Lắng nghe khi nội dung được load vào #content-area
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('#menu-list a');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      links.forEach(x => x.classList.remove('active'));
      link.classList.add('active');

      const type = link.getAttribute('data-type');
      const defaultLink = document.querySelector('#menu-list a.active[data-page]');

      if (defaultLink) {
        if (type === 'all') {
          loadPage(defaultLink.dataset.page);
        } else {
          loadPage(defaultLink.dataset.page, type);
        }
      }
    });
  });

  // Tải mặc định khi load trang
  const defaultLink = document.querySelector('#menu-list a.active[data-page]');
  if (defaultLink) {
    const type = defaultLink.getAttribute('data-type');
    loadPage(defaultLink.dataset.page, type);
  }
});

// Hàm tải trang & lọc sản phẩm nếu có type
function loadPage(url, filterType = null) {
  fetch(url)
    .then(res => res.ok ? res.text() : Promise.reject('Không thể load'))
    .then(html => {
      document.getElementById('content-area').innerHTML = html;

      // Sau khi nội dung load xong, lấy lại danh sách sản phẩm
      const cards = document.querySelectorAll('.card');
      productList = [];
      cards.forEach(card => {
        productList.push({
          name: card.querySelector('.card-title')?.innerText.trim() || '',
          oldprice: card.querySelector('.card-price-old')?.innerText.trim() || '',
          newprice: card.querySelector('.card-price-new')?.innerText.trim() || '',
          imgsrc: card.querySelector('img')?.getAttribute('src') || '',
          discount: card.querySelector('.card-discount')?.innerText.trim() || '',
          type: card.getAttribute('data-type')
        });
      });

      // Cập nhật bộ lọc loại sản phẩm
      if (filterType) {
        currentType = filterType;
      }
      applyFilters();
    })
    .catch(err => {
      console.error(err);
      document.getElementById('content-area').innerHTML = '<p>Không thể tải nội dung.</p>';
    });
}

// Gắn sự kiện cho radio và checkbox lọc
const priceRadios = document.querySelectorAll('input[name="price"]');
const statusCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// Bộ lọc hiện tại
let currentType = 'all';
let currentPrice = null;
let currentStatus = [];

// Hàm áp dụng các bộ lọc hiện tại
function applyFilters() {
  let filtered = productList;

  // Lọc theo loại
  if (currentType !== 'all') {
    filtered = filtered.filter(item => item.type === currentType);
  }

  // Lọc theo giá
  if (currentPrice) {
    filtered = filtered.filter(item => {
      let price = parseFloat(item.newprice.replace(/[^\d]/g, ''));
      if (currentPrice === 'under-1') return price < 1000000;
      if (currentPrice === '1-5') return price >= 1000000 && price <= 5000000;
      if (currentPrice === '5-10') return price > 5000000 && price <= 10000000;
      if (currentPrice === '10-20') return price > 10000000 && price <= 20000000;
      if (currentPrice === 'above-20') return price > 20000000;
      return true;
    });
  }

  // Lọc theo trạng thái giảm giá
  if (currentStatus.length > 0) {
    filtered = filtered.filter(item => {
      return currentStatus.every(status =>
        item.discount.toLowerCase().includes(status)
      );
    });
  }

  render(filtered);
}

// Gán sự kiện click cho các link danh mục
document.querySelectorAll('#menu-list a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('#menu-list a').forEach(x => x.classList.remove('active'));
    link.classList.add('active');
    currentType = link.getAttribute('data-type');
    applyFilters();
  });
});

// Gán sự kiện thay đổi radio lọc giá
priceRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    currentPrice = document.querySelector('input[name="price"]:checked')?.value || null;
    applyFilters();
  });
});

// Gán sự kiện thay đổi checkbox trạng thái
statusCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    currentStatus = Array.from(statusCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());
    applyFilters();
  });
});

// Hàm render danh sách sản phẩm sau khi lọc
function render(list) {
  const row = document.querySelector('#content-area .row');
  if (!row) return;

  row.innerHTML = '';

  list.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-sm-4';
    col.style = 'max-width: 335px;';

    let priceStr = item.newprice;
    let priceInt = parseInt(priceStr.replace(/,/g, '').replace(/\D+$/, ''));
    const tempId = `${item.name}-${priceInt}`;

    col.innerHTML = `
      <div class="card rounded-4" data-type="${item.type}">
        <div class="card-discount p-1 text-white">${item.discount}</div>
        <img src="${item.imgsrc}" class="img-fluid-top rounded-4">
        <div class="card-body">
          <h3 class="card-title mt-3">${item.name}</h3>
          <p class="card-price-old">${item.oldprice}</p>
          <p class="card-price-new">${item.newprice}</p>
          <button class="card-btn add-to-cart" data-id="${tempId}" data-name="${item.name}" data-price="${priceInt}" style="max-width: 250px;">🛒 Thêm giỏ hàng</button>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  attachAddToCartEvents();
}

function updateCartCount() {
  const btnCart = document.querySelector('.rounded-circle');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  btnCart.innerHTML = totalQuantity;
}

function attachAddToCartEvents() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
      const id = this.dataset.id || `${this.dataset.name}-${this.dataset.price}`;
      const name = this.dataset.name;
      const price = Number(this.dataset.price);

      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingProduct = cart.find(p => p.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();

      // ✅ Hiển thị thông báo tick nổi
      const tickDiv = document.createElement('div');
      tickDiv.className = 'tick-popup';
      tickDiv.innerHTML = '✔️ Đã thêm vào giỏ';

      // Thêm vào body tại vị trí gần nút
      document.body.appendChild(tickDiv);

      // Lấy vị trí của nút
      const rect = this.getBoundingClientRect();
      tickDiv.style.top = `${rect.top + window.scrollY - 30}px`;
      tickDiv.style.left = `${rect.left + window.scrollX + this.offsetWidth / 2 - 60}px`;

      setTimeout(() => {
        tickDiv.remove();
      }, 30000);
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
