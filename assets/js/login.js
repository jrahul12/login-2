
function snackBar(title, icon, timer = 2500) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: timer,
    });
}

snackBar("New User Create SuccessFully","Success");

const cl = console.log;

let BASE_URL = "https://auth-git-main-iamrkjs-projects.vercel.app";

let LOGIN_URL = `${BASE_URL}/api/auth/login`;

const loginUpForm = document.getElementById('loginUpForm');
const loginUpEmail = document.getElementById('loginUpEmail');
const loginUpPassword = document.getElementById('loginUpPassword');

async function onLoginSubmit(eve) {
    eve.preventDefault();
    let createObj_1 = {
        email: loginUpEmail.value,
        password: loginUpPassword.value
    };
    try {
        let res = await fetch(LOGIN_URL, {
            method: "POST",
            body: JSON.stringify(createObj_1),
            headers: {
                "content-type": "application/json"
            }
        })
        let data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || data.message || "Something went wrong");
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('userRole', data.userRole)
        snackBar("Login successfully!", "success");
        window.location.href = "dashboard.html";
        loginUpForm.reset();
    } catch (err) {
        snackBar(err.message, "error");
    }
}

loginUpForm.addEventListener('submit', onLoginSubmit);