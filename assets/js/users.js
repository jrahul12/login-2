const cl = console.log;

const userForm = document.getElementById("userForm");
const nameControl = document.getElementById("name");
const usernameControl = document.getElementById("username");
const emailControl = document.getElementById("email");
const phoneControl = document.getElementById("phone");
const websiteControl = document.getElementById("website");
const companyControl = document.getElementById("companyName");
const streetControl = document.getElementById("street");
const cityControl = document.getElementById("city");
const zipcodeControl = document.getElementById("zipcode");

const addUserBtn = document.getElementById("addUser");
const updateUserBtn = document.getElementById("updateUser");

const postContainer = document.getElementById("postContainer");

let BASE_URL = "https://blog-80452-default-rtdb.firebaseio.com";
let POST_URL = `${BASE_URL}/user`;

function objToArr(obj) {
    let arr = [];
    for (const key in obj) {
        obj[key].id = key;
        arr.push(obj[key]);
    }
    return arr;
}

const createUser = (arr) => {
    let result = arr.map(user => {
        return `
        <div class="card mt-3" id="${user.id}">
            <div class="card-header">
                <h5 class="m-0">${user.name}</h5>
            </div>

            <div class="card-body">
                <p class="m-0"><strong>Username:</strong> ${user.username}</p>
                <p class="m-0"><strong>Email:</strong> ${user.email}</p>
                <p class="m-0"><strong>Phone:</strong> ${user.phone}</p>
                <p class="m-0"><strong>Website:</strong> ${user.website}</p>

                <hr>

                <p class="m-0"><strong>Address:</strong></p>
                <p class="m-0">${user.street}</p>
                <p class="m-0">${user.city} - ${user.zipcode}</p>

                <hr>

                <p class="m-0"><strong>Company:</strong></p>
                <p class="m-0">${user.companyName}</p>
            </div>

            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-sm btn-success" onClick="onEdit(this)">Edit User</button>
                <button class="btn btn-sm btn-danger" onClick="onRemove(this)">Delete User</button>
            </div>
        </div>
        `;
    }).join("");

    postContainer.innerHTML = result;
};

function fetchUser() {
    fetch(`${POST_URL}.json`)
        .then(res => res.json())
        .then(data => {
            let arr = objToArr(data)
            createUser(arr);
        })
        .catch(err => console.log(err));
}

fetchUser();

function onSubmit(eve) {
    eve.preventDefault();

    let createObj = {
        name: nameControl.value,
        username: usernameControl.value,
        email: emailControl.value,
        phone: phoneControl.value,
        website: websiteControl.value,
        street: streetControl.value,
        city: cityControl.value,
        zipcode: zipcodeControl.value,
        companyName: companyControl.value
    };

    fetch(`${POST_URL}.json`, {
        method: "POST",
        body: JSON.stringify(createObj),
        headers: { "content-type": "application/json" }
    })
        .then(res => res.json())
        .then(() => {
            fetchUser();
            userForm.reset();
        });
}

function onRemove(btn) {
    let REMOVE_ID = btn.closest('.card').id;

    fetch(`${BASE_URL}/user/${REMOVE_ID}.json`, {
        method: "DELETE"
    })
        .then(() => btn.closest('.card').remove());
}

function onEdit(btn) {
    let EDIT_ID = btn.closest('.card').id;
    localStorage.setItem("EDIT_ID", EDIT_ID);

    fetch(`${BASE_URL}/user/${EDIT_ID}.json`)
        .then(res => res.json())
        .then(data => {
            nameControl.value = data.name;
            usernameControl.value = data.username;
            emailControl.value = data.email;
            phoneControl.value = data.phone;
            websiteControl.value = data.website;
            streetControl.value = data.street;
            cityControl.value = data.city;
            zipcodeControl.value = data.zipcode;
            companyControl.value = data.companyName;

            addUserBtn.classList.add("d-none");
            updateUserBtn.classList.remove("d-none");
        });
}

function onUpdate() {
    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let updateObj = {
        name: nameControl.value,
        username: usernameControl.value,
        email: emailControl.value,
        phone: phoneControl.value,
        website: websiteControl.value,
        street: streetControl.value,
        city: cityControl.value,
        zipcode: zipcodeControl.value,
        companyName: companyControl.value
    };

    fetch(`${BASE_URL}/user/${UPDATE_ID}.json`, {
        method: "PUT",
        body: JSON.stringify(updateObj),
        headers: { "content-type": "application/json" }
    })
        .then(() => {
            fetchUser();
            userForm.reset();
            addUserBtn.classList.remove("d-none");
            updateUserBtn.classList.add("d-none");
        });
}

updateUserBtn.addEventListener('click', onUpdate);
userForm.addEventListener('submit', onSubmit);