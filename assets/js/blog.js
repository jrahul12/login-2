
let BASE_URL = "https://jsonplaceholder.typicode.com";

let POST_URL = `${BASE_URL}/posts`;

const blogForm = document.getElementById('blogForm');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const blogContainer = document.getElementById('blogContainer');

function blogObjToArr(obj) {
    let arr = [];
    for (const key in obj) {
        obj[key].id = key;
        arr.push(obj[key]);
    }
    return arr;
}

function snackBar(title,icon){
    Swal.fire({
        title,
        icon,
        timer:2500
    })
}

async function makeApiCall(apiUrl, methodName, msgBody) {

    try {
        msgBody = msgBody ? JSON.stringify(msgBody) : null;

        let res = await fetch(apiUrl, {
            method: methodName,
            body: msgBody,
            headers: {
                Auth: 'Token From LS',
                'content-type': 'application/json'
            }
        });

        let data = await res.json();

        if (!res.ok) {
            let err = data.error || res.statusText || 'Something went wrong !!!';
            throw new Error(err);
        }

        return data;

    } finally {

    }
}
const createCards = arr => {
    let result = arr.map(blog => {
        return `<div class="card mb-3" id="${blog.id}">
                        <div class="card-header">
                            <h3>${blog.title}</h3>
                        </div>
                        <div class="card-body">
                            <p>${blog.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onClick="onRemove(this)">Delete</button>
                        </div>`
    }).join('');
    blogContainer.innerHTML = result;
}
async function fetchAllBlogs() {
    try {
        let data = await makeApiCall(POST_URL, 'GET', null);
        let blogsArr = blogObjToArr(data);
        createCards(blogsArr);
    } catch (err) {
        snackBar(err, 'error');
    }
}
fetchAllBlogs();
const onSubmitBlog = async eve => {
    eve.preventDefault();

    let blogObj = {
        title: titleControl.value,
        body: bodyControl.value.trim(),
        userId: userIdControl.value
    };

    try {
        let data = await makeApiCall(POST_URL, "POST", blogObj);
        let card = document.createElement('div');
        card.className = `card mb-3`;
        card.id = data.name;
        card.innerHTML = `<div class="card-header">
                            <h3>${blogObj.title}</h3>
                        </div>
                        <div class="card-body">
                            <p>${blogObj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onClick="onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onClick="onRemove(this)">Delete</button>
                        </div>`;
        blogContainer.append(card);
        blogForm.reset();
        snackBar("blog addedd successfully", "success");
    } catch (err) {
        snackBar(err, 'error');
    }
};
async function onRemove(ele) {
    try {
        let getConfirm = await Swal.fire({
            title: 'Do you want to remove the Blog?',
            showCancelButton: true,
            confirmButtonText: 'Remove'
        });

        if (getConfirm) {
            let REMOVE_ID = ele.closest('.card').id;
            let REMOVE_URL = `${BASE_URL}/blog/${REMOVE_ID}.json`;
            let res = await makeApiCall(REMOVE_URL, 'DELETE', null);
            document.getElementById(REMOVE_ID).remove();
            snackBar("blog delete successfull", "success");
        }
    } catch (err) {
        snackBar(err, 'error');
    }
}

async function onEdit(ele) {
    try {
        let EDIT_ID = ele.closest('.card').id;
        localStorage.setItem("EDIT_ID", EDIT_ID);
        let EDIT_URL = `${BASE_URL}/blog/${EDIT_ID}.json`;
        let blog = await makeApiCall(EDIT_URL, 'GET', null);
        titleControl.value = blog.title;
        bodyControl.value = blog.body;
        userIdControl.value = blog.userId;
        addBtn.classList.add('d-none');
        updateBtn.classList.remove('d-none');
    } catch (err) {
        snackBar(err, "error");
    }
}

const onUpdateBlog = async (eve) => {
    eve.preventDefault()
    let UPDATE_ID = localStorage.getItem("EDIT_ID");
    let UPDATE_URL = `${BASE_URL}/blog/${UPDATE_ID}.json`;
    let updateObj = {
        title: titleControl.value,
        body: bodyControl.value.trim(),
        userId: userIdControl.value,
        id:UPDATE_ID
    };
    try {
        let data = await makeApiCall(UPDATE_URL, "PATCH", updateObj);
        let card = document.getElementById(UPDATE_ID);
        card.querySelector('h3').innerText = updateObj.title;
        card.querySelector('p').innerText = updateObj.body;
        updateBtn.classList.add('d-none');
        addBtn.classList.remove('d-none');
        localStorage.removeItem("EDIT_ID");
        blogForm.reset();
        snackBar("blog Update successfull", "success");
    }
    catch (err) {
        snackBar(err, "error");
    }
}

updateBtn.addEventListener('click', onUpdateBlog);
blogForm.addEventListener('submit', onSubmitBlog);