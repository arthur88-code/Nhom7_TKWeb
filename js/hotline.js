document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    document.getElementById("exampleModalLabel").innerHTML = `<strong>${subject}</strong>`;
    document.querySelector("#exampleModal .modal-body").innerHTML = `
      <p><strong>Họ và tên:</strong> ${name}</p>
      <p><strong>Số điện thoại:</strong> ${phone}</p>
      <p><strong>Nội dung:</strong> ${message}</p>
    `;

    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
  });