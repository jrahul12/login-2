const params = new URLSearchParams(window.location.search);
const CODE = params.get("code");

const API_URL = `https://restcountries.com/v3.1/alpha/${CODE}`;

async function loadCountry() {

    let res = await fetch(API_URL);
    let data = await res.json();
    let c = data[0];

    const container = document.getElementById("countriesContainer");

    container.innerHTML = `
        <div class="col-md-5 d-flex align-items-center justify-content-center">
            <img src="${c.flags.png}" class="img-fluid rounded" alt="">
        </div>

        <div class="col-md-7">
            <h3 class="mb-3">${c.name.common}</h3>

            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Official Name:</strong> ${c.name.official}</li>
                <li class="list-group-item"><strong>Region:</strong> ${c.region}</li>
                <li class="list-group-item"><strong>Subregion:</strong> ${c.subregion}</li>
                <li class="list-group-item"><strong>Population:</strong> ${c.population.toLocaleString()}</li>
                <li class="list-group-item"><strong>Area:</strong> ${c.area} km²</li>
                <li class="list-group-item"><strong>Country Code:</strong> ${c.cca2}</li>

                <li class="list-group-item">
                    <strong>Borders:</strong>
                    ${c.borders
            ? c.borders.map(code => `<a href="country.html?code=${code}" class="border-link">${code}</a>`).join(" ")
            : "No Borders"
        }
                </li>

                <li class="list-group-item">
                    <strong>Google Maps:</strong>
                    <a href="${c.maps.googleMaps}" target="_blank">Open</a>
                </li>
            </ul>
        </div>
    `;
}

loadCountry();
