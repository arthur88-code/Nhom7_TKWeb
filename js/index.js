const items = document.querySelectorAll('.product-item');
const itemsPerPage = 3;
let currentPage = 0;

function showItems() {
    items.forEach((item, index) => {
        item.style.display = (index >= currentPage * itemsPerPage && index < (currentPage + 1) * itemsPerPage) ? 'block' : 'none';
    });
}

document.querySelector('.carousel-controls button:first-child').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        showItems();
    }
});

document.querySelector('.carousel-controls button:last-child').addEventListener('click', () => {
    if ((currentPage + 1) * itemsPerPage < items.length) {
        currentPage++;
        showItems();
    }
});

// Hiển thị sản phẩm ban đầu
showItems();