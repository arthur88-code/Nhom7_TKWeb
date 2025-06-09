document.querySelector('.icon').addEventListener('click', function () {
    showModal('login');
});

document.querySelector('.icon2').addEventListener('click', function () {
    window.location.href = 'paymentpage.html';
});
document.addEventListener('DOMContentLoaded', function () {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
        onLoginSuccess(storedUser.fullname);
    }
});


function showModal(type) {
    const modal = document.getElementById("authModal");
    const content = document.getElementById("authContent");

    if (type === "login") {
        content.innerHTML = `
        <div class="login-box px-3 py-2">
            <h2 class="text-center mb-3">ĐĂNG NHẬP</h2>
            
            <form onsubmit="return loginUser();">
                <div class="mb-3">
                    <input type="text" class="form-control rounded-2 username" id="username" placeholder="Tài khoản" style="width: 100%;">
                </div>
                <div class="mb-3 position-relative">
                    <input type="password" class="form-control rounded-2 z-1 password" id="password" placeholder="Mật khẩu" style="width: 100%;">
                    <span class="toggle-password z-2 position-absolute top-50 start-70 translate-middle-y ps-2" onclick="togglePassword('password')">👁️‍🗨️</span>
                </div>
                <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-dark">Đăng nhập</button>
                </div>
            </form>
            
            <div class="text-center">
                <a href="#" onclick="showModal('register'); return false;" class="text-black">ĐĂNG KÝ NGAY</a>
            </div>

            <p class="text-center text-danger mt-2" id="error-msg"></p>
        </div>
        `;
    } else {
        content.innerHTML = `
        <div class="register-box">
            <h2>Đăng ký tài khoản</h2>
            <form onsubmit="return registerUser();">
                <div class="mb-3">
                    <label for="fullname" class="form-label">Họ và tên</label>
                    <input type="text" class="form-control rounded-2 w-100 input_rg" id="fullname" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control rounded-2 w-100 input_rg" id="email" required>
                </div>
                <div class="mb-3 position-relative">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <input type="password" class="form-control rounded-2 w-100 z-1 input_rg" id="password" required>
                    <span class="toggle-password z-2" onclick="togglePassword('password')">👁️‍🗨️</span>
                </div>
                <div class="mb-3 position-relative">
                    <label for="confirm-password" class="form-label">Xác nhận mật khẩu</label>
                    <input type="password" class="form-control rounded-2 w-100 z-1 input_rg" id="confirm-password" required>
                    <span class="toggle-password z-2" onclick="togglePassword('confirm-password')">👁️‍🗨️</span>
                </div>
                <div class="d-grid">
                    <button type="submit" class="btn btn-register">Đăng ký</button>
                </div>
            </form>
            <p class="text-center mt-3">
                Đã có tài khoản? <a href="#" onclick="showModal('login'); return false;">Đăng nhập</a>
            </p>
            <p class="text-center text-danger mt-2" id="error-msg"></p>
        </div>
        `;
    }


    modal.style.display = "flex";

    // Bắt sự kiện chuyển form trong modal
    content.querySelectorAll('.switch-form').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.dataset.target;
            showModal(target);
        });
    });

}

function closeModal() {
    document.getElementById("authModal").style.display = "none";
}
function onLoginSuccess(username) {
    const loginIcon = document.querySelector('.login-icon');
    loginIcon.innerHTML = `
        <div class="user-info dropdown text-center ms-auto">
            <img src="Images/icon_Dangnhap.png" alt="login" style="max-width: 35px; cursor: pointer;" class="icon d-block mx-auto dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="username dropdown-toggle d-block mt-1 fw-semibold text-white text-uppercase text-end" 
                data-bs-toggle="dropdown" aria-expanded="false" style="cursor:pointer;">${username}</span>
            <ul class="dropdown-menu dropdown-menu-end mt-1" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="#" onclick="logoutUser()">Đăng xuất</a></li>
            </ul>
        </div>
    `;


    // Gán lại sự kiện click cho icon mới
    const newIcon = document.querySelector('.login-icon .icon');
    if (newIcon) {
        newIcon.addEventListener('click', function () {
            showModal('login'); 
        });
    }
}
function logoutUser() {
    localStorage.removeItem("userInfo");
    location.reload(); 
}

function registerUser() {
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorMsg = document.getElementById("error-msg");

    if (password !== confirmPassword) {
        errorMsg.textContent = "Mật khẩu xác nhận không khớp!";
        return false;
    }

    // Tạo object người dùng
    const user = {
        fullname: fullname,
        email: email,
        password: password
    };

    // Lưu vào localStorage
    localStorage.setItem("userInfo", JSON.stringify(user));

    // alert("Đăng ký thành công!");
    closeModal();
    return false;
}

function togglePassword(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
}


function loginUser() {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    const storedUser = JSON.parse(localStorage.getItem("userInfo"));

    if (!storedUser) {
        errorMsg.textContent = "Không tìm thấy tài khoản. Hãy đăng ký trước.";
        return false;
    }

    if (email === storedUser.email && password === storedUser.password) {
        // alert("Đăng nhập thành công!");
        onLoginSuccess(storedUser.fullname);
        closeModal();
    } else {
        errorMsg.textContent = "Email hoặc mật khẩu không đúng!";
    }

    return false;
}
