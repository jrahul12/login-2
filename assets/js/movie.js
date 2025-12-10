const cl = console.log;

const nfxBtn = document.getElementById("nfxBtn");
const movieModel = document.getElementById("movieModel");
const backDrop = document.getElementById("backDrop");
const closeBtns = document.querySelectorAll(".closeBtns");
const movieForm = document.getElementById("movieForm");
const movieName = document.getElementById("movieName");
const movieImg = document.getElementById("movieImg");
const movieDesc = document.getElementById("movieDesc");
const movieRating = document.getElementById("movieRating");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const spinner = document.getElementById("spinner");
const movieContainer = document.getElementById("movieContainer");

const MOVIE_URL = "https://blog-80452-default-rtdb.firebaseio.com";
const POST_URL = `${MOVIE_URL}/movies.json`;

const onHideShow = () => {
    backDrop.classList.toggle("active");
    movieModel.classList.toggle("active");

};

const Setbadge = (rating) => {
    const r = Number(rating);

    if (r > 4) {
        return "badge badge-success";
    } else if (r > 3) {
        return "badge badge-warning";
    } else {
        return "badge badge-danger";
    }
};


function loader(flag) {
    if (flag) {
        spinner.classList.remove("d-none")
    } else {
        spinner.classList.add("d-none");
    }
}

function snackbar(title, icon) {
    Swal.fire({
        title,
        icon,
        timer: 2000
    })
}

function blogObjToArr(obj) {
    let arr = [];
    for (const key in obj) {
        obj[key].MovieId = key;
        arr.push(obj[key]);
    }
    return arr;
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
    let result = arr
        .map(
            movie => `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card movieCard text-white" id="${movie.MovieId}">
                <div class="card-header p-0">
                    <div class="row">
                        <div class="col-10">
                            <h5>${movie.movieName}</h5>
                        </div>
                        <div class="col-2">
                            <h6><span class="${Setbadge(movie.movieRating)}">${movie.movieRating}</span></h6>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${movie.movieImgUrl}" alt="">
                        <figcaption>
                            <h5>${movie.movieName}</h5>
                            <p>${movie.movieDescription}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between p-0">
                    <button class="btn btn-sm btn-success" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="onRemove(this)">Remove</button>
                </div>
            </div>
        </div>`
        )
        .join("")

    movieContainer.innerHTML = result;
};

function fetchAllMovie() {
    makeApiCall(POST_URL, "GET", null)
        .then(res => {
            let objToArr = blogObjToArr
            let data = objToArr(res);
            createCards(data);
        })
}
fetchAllMovie();

function onSubmitPost(eve) {
    eve.preventDefault();

    let movieObj = {
        movieName: movieName.value,
        movieImgUrl: movieImg.value,
        movieRating: movieRating.value,
        movieDescription: movieDesc.value
    }

    makeApiCall(POST_URL, "POST", movieObj)
        .then(data => {
            let card = document.createElement('div');
            card.classList = `col-md-3 col-sm-6 mb-4`;
            card.id = data.name;

            card.innerHTML = `
            <div class="card movieCard text-white" id="${data.name}">
                <div class="card-header p-0">
                    <div class="row">
                        <div class="col-10">
                            <h5>${movieObj.movieName}</h5>
                        </div>
                        <div class="col-2">
                            <h6><span class="${Setbadge(movieObj.movieRating)}">${movieObj.movieRating}</span></h6>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <figure>
                        <img src="${movieObj.movieImgUrl}" alt="">
                        <figcaption>
                            <h5>${movieObj.movieName}</h5>
                            <p>${movieObj.movieDescription}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between p-0">
                    <button class="btn btn-sm btn-success" onclick="onEdit(this)">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="onRemove(this)">Remove</button>
                </div>
            </div>
            `;

            movieContainer.append(card);
            movieForm.reset();
            onHideShow();
        })
}

function onRemove(eve) {
    let REMOVE_ID = eve.closest('.card').id;
    let REMOVE_URL = `${MOVIE_URL}/movies/${REMOVE_ID}.json`;

    makeApiCall(REMOVE_URL, "DELETE", null)
        .then(data => {
            eve.closest(".col-md-3").remove();
        })
        .catch(err => {
            snackbar("error", 'error');
        })
}

function onEdit(eve) {
    let EDIT_ID = eve.closest('.card').id;
    localStorage.setItem('EDIT_ID', EDIT_ID);

    let EDIT_URL = `${MOVIE_URL}/movies/${EDIT_ID}.json`;

    makeApiCall(EDIT_URL, "GET", null)
        .then(data => {
            onHideShow()
            movieName.value = data.movieName;
            movieImg.value = data.movieImgUrl;
            movieRating.value = data.movieRating;
            movieDesc.value = data.movieDescription;

            submitBtn.classList.add('d-none');
            updateBtn.classList.remove('d-none');
        })
}

function onUpdateMovie() {
    let UPDATE_ID = localStorage.getItem("EDIT_ID");
    let UPDATE_URL = `${MOVIE_URL}/movies/${UPDATE_ID}.json`;

    let updateObj = {
        movieName: movieName.value,
        movieImgUrl: movieImg.value,
        movieRating: movieRating.value,
        movieDescription: movieDesc.value
    }

    makeApiCall(UPDATE_URL, "PATCH", updateObj)
        .then(() => {
            let card = document.getElementById(UPDATE_ID);

            card.querySelector('.card-header h5').innerText = updateObj.movieName;
            card.querySelector('span').innerText = updateObj.movieRating;
            card.querySelector('p').innerText = updateObj.movieDescription;
            card.querySelector('img').src = updateObj.movieImgUrl;

            updateBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');
            movieForm.reset();
            onHideShow();
        })
}

updateBtn.addEventListener("click", onUpdateMovie);
movieForm.addEventListener("submit", onSubmitPost);
nfxBtn.addEventListener("click", onHideShow);
closeBtns.forEach(b => b.addEventListener("click", onHideShow));
