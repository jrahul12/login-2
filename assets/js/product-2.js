const productContainer = document.getElementById("productContainer");

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

async function loadProductDetails() {
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    const p = await res.json();

    productContainer.innerHTML = `
        <div class="col-12 col-md-6 offset-3 mt-5 mx-auto">
            <div class="card shadow-sm">
                <img src="${p.thumbnail}" class="card-img-top" style="height:300px;">
                <div class="card-body">
                    <h3>${p.title}</h3>
                    <p class="text-success fw-bold">$${p.price}</p>
                    <p> Rating: ${p.rating}*</p>
                    <p>${p.description}</p>
                </div>
            </div>
        </div>
    `;
}

loadProductDetails();
