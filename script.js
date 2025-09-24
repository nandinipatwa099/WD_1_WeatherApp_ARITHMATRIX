const apiKey = "47c23188b9mshf9dee59b8b49043p184690jsn05aa36b41f1b";
const apiHost = "weatherapi-com.p.rapidapi.com";

// Map predefined cities to their names (replace Nainital with Dehradun)
const predefinedCities = ["Pune", "Belgaum", "Hyderabad", "Mysore", "Dehradun"];

// Fetch weather data
async function getWeather(city) {
  const url = `https://${apiHost}/current.json?q=${city}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();

    // Country correction: if city is Delhi and API returns Canada, fix to India
    let country = data.location.country;
    if (city.toLowerCase() === "delhi" && country.toLowerCase() === "canada") {
      country = "India";
    }

    return {
      city: data.location.name,
      country: country,
      lat: data.location.lat,
      lon: data.location.lon,
      temp: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      wind: data.current.wind_kph,
      feelslike: data.current.feelslike_c,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

// Display main searched city
async function displayMainCity(city) {
  const weather = await getWeather(city);
  if (!weather) return;

  document.getElementById("mainCityName").textContent = weather.city;
  document.getElementById("temperature").textContent = weather.temp + "°C";
  document.getElementById("condition").textContent = weather.condition;
  document.getElementById("humidity").textContent = weather.humidity + "%";
  document.getElementById("wind").textContent = weather.wind + " kph";
  document.getElementById("cityName").textContent = weather.city;
  document.getElementById("country").textContent = weather.country;
  document.getElementById("coord").textContent = `${weather.lat}, ${weather.lon}`;
  document.getElementById("feelslike").textContent = weather.feelslike + "°C";
}

// Display table for predefined cities
async function displayCommonCities() {
  const tbody = document.getElementById("commonCitiesTable");
  tbody.innerHTML = ""; // clear existing rows

  for (let city of predefinedCities) {
    const weather = await getWeather(city);
    const row = document.createElement("tr");

    if (weather) {
      row.innerHTML = `
        <th>${weather.city}</th>
        <td>${weather.temp}°C</td>
        <td>${weather.condition}</td>
        <td>${weather.humidity}%</td>
        <td>${weather.wind} kph</td>
      `;
    } else {
      row.innerHTML = `<th>${city}</th><td colspan="4">Error loading data</td>`;
    }

    tbody.appendChild(row);
  }
}

// Search form
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value.trim();
  if (city) displayMainCity(city);
});

// Load default data for Delhi
displayMainCity("Delhi");
displayCommonCities();
