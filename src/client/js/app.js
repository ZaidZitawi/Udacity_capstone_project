const handleSubmit = async (event) => {
  event.preventDefault();

  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  if (!destination || !startDate || !endDate) {
    alert("Please enter destination and both travel dates.");
    return;
  }

  if (new Date(endDate) < new Date(startDate)) {
    alert("End date must be after start date.");
    return;
  }

  const tripDuration = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  try {
    // here we will fetch the location data
    const locationResponse = await fetch("http://localhost:4007/getLocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: destination }),
    });

    if (!locationResponse.ok) {
      throw new Error(
        `Location request failed with status ${locationResponse.status}`
      );
    }

    const locationData = await locationResponse.json();

    if (locationData.lat && locationData.lng) {
      //if the location data is found, we will fetch the weather and image data
      await fetchWeatherAndImage(
        locationData.lat,
        locationData.lng,
        destination,
        startDate,
        tripDuration
      );
    } else {
      document.getElementById("result").innerHTML = "Location not found.";
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    document.getElementById("result").innerHTML =
      "Error fetching location data.";
  }
};

//images and weather data
const fetchWeatherAndImage = async (
  lat,
  lng,
  destination,
  startDate,
  tripDuration
) => {
  try {
    //weatherbit API
    const weatherResponse = await fetch("http://localhost:4007/getWeather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather request failed with status ${weatherResponse.status}`
      );
    }

    const weatherData = await weatherResponse.json();

    if (weatherData.temperature) {
      //Pixabay api
      const imageUrl = await fetchImage(destination);

      document.getElementById("result").innerHTML = `
          <p>Planning your trip to <strong>${destination}</strong> from <strong>${startDate}</strong> for <strong>${tripDuration}</strong> days!</p>
          <h2>Weather in ${weatherData.city_name}</h2>
          <p>Temperature: ${weatherData.temperature}°C</p>
          <p>Weather: ${weatherData.weather_description}</p>
          ${
            imageUrl
              ? `<h3>Image of ${destination}</h3><img src="${imageUrl}" alt="${destination}" />`
              : "<p>No image available.</p>"
          }
        `;
    } else {
      document.getElementById("result").innerHTML = "Weather data not found.";
    }
  } catch (error) {
    console.error("Error fetching weather or image:", error);
    document.getElementById("result").innerHTML =
      "Error fetching weather or image data.";
  }
};

//requesting image data for Pixabay
const fetchImage = async (destination) => {
  try {
    const imageResponse = await fetch("http://localhost:4007/getImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: destination }),
    });

    if (!imageResponse.ok) {
      throw new Error(
        `Image request failed with status ${imageResponse.status}`
      );
    }

    const imageData = await imageResponse.json();

    return imageData.imageUrl || "";
  } catch (error) {
    console.error("Error fetching image:", error);
    return "";
  }
};

export { handleSubmit };
