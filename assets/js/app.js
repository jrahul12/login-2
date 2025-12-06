const cl = console.log;

let BASE_URL = "https://auth-git-main-iamrkjs-projects.vercel.app";

let LOGIN_URL = `${BASE_URL}/api/auth/login`;
let SIGN_UP_URL = `${BASE_URL}/api/auth/register`;

function snackBar(title, icon, timer = 2500) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: timer,
    });
}

// ---------------- SIGN UP -----------------
const signUpForm = document.getElementById('signUpForm');
const signUpEmail = document.getElementById('signUpEmail');
const signUpPassword = document.getElementById('signUpPassword');
const userRole = document.getElementById('userRole');

async function onSignUpSubmit(eve) {
    eve.preventDefault();

    if (!signUpEmail.value || !signUpPassword.value) {
        return snackBar("Email and password are required", "error");
    }

    let createObj = {
        email: signUpEmail.value,
        password: signUpPassword.value,
        userRole: userRole.value
    };

    cl(createObj);

    try {
        let res = await fetch(SIGN_UP_URL, {
            method: "POST",
            body: JSON.stringify(createObj),
            headers: {
                "Content-Type": "application/json"
            }
        });

        let data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || data.message || "Something went wrong");
        }
        window.location.href='signup.html';
        snackBar("Account created successfully!", "success");
        signUpForm.reset();

    } catch (err) {
        snackBar(err.message, "error");
    }
}

signUpForm.addEventListener("submit", onSignUpSubmit);

// ---------------- LOG IN -----------------

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
        // snackBar("Login successfully!", "success");
        window.location.href = "dashboard.html";
        loginUpForm.reset();
    } catch (err) {
        snackBar(err.message, "error");
    }
}

loginUpForm.addEventListener('submit', onLoginSubmit);
snackBar('logout successfully', "success");