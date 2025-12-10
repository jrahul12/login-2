

function snackBar(title, icon, timer = 2500) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: timer,
    });
}

// snackBar("login successfully", "success");

const cl = console.log;

const logOutBtn = document.getElementById('logOutBtn');
function onlogout() {
    Swal.fire({
        title: "Do you want to LogOut?",
        showCancelButton: true,
        confirmButtonText: "LogOut",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html'
        }
    });
}

logOutBtn.addEventListener('click', onlogout);

const movieBtn = document.getElementById('movieBtn');

function onMovieBtn(){
    window.location.href='movie.html';
}

movieBtn.addEventListener('click',onMovieBtn);

const productBtn=document.getElementById('productBtn');

function onProduct(){
    window.location.href='product.html';
}

productBtn.addEventListener('click',onProduct);

const blogBtn=document.getElementById('blogBtn');

function onBlog(){
    window.location.href='blog.html';
}

blogBtn.addEventListener('click',onBlog);

const countryBtn=document.getElementById('countryBtn');

function onCountry(){
    window.location.href='country.html';
}

countryBtn.addEventListener('click',onCountry);

const usersBtn=document.getElementById('usersBtn');

function onUser(){
    window.location.href='users.html';
}

usersBtn.addEventListener('click',onUser);
