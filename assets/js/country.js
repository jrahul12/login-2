const cl = console.log;

let BASE_URL = "https://restcountries.com/v3.1/all";

let COUNTRY_URL = `${BASE_URL}?fields=name,cca2,flags,region`;

const countriesRow = document.getElementById('countriesRow');

async function fetchAllCountry() {
    try {

        let res = await fetch(COUNTRY_URL);
        let data = await res.json();

        data.map(c => {
            let card = document.createElement('div');
            card.className = `col-md-3 col-12 col-sm-6 col-lg-3 mb-4`;

            card.innerHTML = `
                <div class="card" data-code="${c.cca2}">
                    <img src="${c.flags.png}" class="card-img-top" alt="${c.flags.alt}">
                    <div class="card-body">
                        <h5 class="card-title">${c.name.common}</h5>
                        <p class="card-text">${c.cca2}</p>
                    </div>
                </div>
            `;

            card.addEventListener("click", () => {
                window.location.href = `./country-2.html?code=${c.cca2}`;
            });

            countriesRow.append(card);
        });

    } catch (err) {
        cl(err);
    }
}

fetchAllCountry();
