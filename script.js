document.getElementById("education-btn").addEventListener("click", function() {
    alert("I am studying B.Tech CSE (IoT) at B. S. Abdur Rahman Crescent Institute Of Science and Technology (2023-2027).");
});

document.getElementById("contact-form").addEventListener("submit", function(event) {
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phonePattern = /^[6-9]\d{9}$/;

    if (!emailPattern.test(email)) {
        alert("Invalid email format! Example: example@email.com");
        event.preventDefault();
        return false;
    }
    
    if (!phonePattern.test(phone)) {
        alert("Invalid phone number! Enter a 10-digit valid number starting with 6-9.");
        event.preventDefault();
        return false;
    }

    alert("Form submitted successfully!");
    return true;
});
