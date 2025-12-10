const productContainer = document.getElementById("productContainer");

async function loadProducts() {
    const res = await fetch("https://dummyjson.com/products?limit=3000");
    const data = await res.json();

    data?.products?.forEach((p) => {

        let col = document.createElement("div");
        col.className = "col-xl-3 col-lg-4 col-md-6";

        col.innerHTML = `
            <div class="card shadow-sm h-100 border-0">
                <img src="${p.thumbnail}" class="card-img-top" style="height:250px; object-fit:cover;">
                
                <div class="card-body">
                    <h5 class="card-title fw-semibold">${p.title}</h5>
                    <p class="text-success fw-bold">$${p.price}</p>
                    <p class="text-warning mb-3"> ${p.rating}*</p>
                    <a class="btn btn-dark w-100" data-id="${p.id}">More Details</a>
                </div>
            </div>
        `;

       const nextPage = async  ()=> {
            window.location.href = `product-2.html?id=${p.id}`;
        }

        col.querySelector("a").addEventListener("click", nextPage);

        productContainer.appendChild(col);
    });
}

loadProducts();
