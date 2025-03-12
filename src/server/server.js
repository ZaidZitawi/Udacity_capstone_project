// src/server/server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // enable all CORS requests
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve static files from "dist"
app.use(express.static("dist"));

// Single root route returning text (removing any sendFile usage)
app.get("/", (req, res) => {
  res.status(200).send("Server is running!");
});

// API Configuration for GeoNames
const GEO_API_URL = "http://api.geonames.org/searchJSON";
const GEO_USERNAME = "zaid_zitawi";

app.post("/getLocation", async (req, res) => {
  const { location } = req.body;
  if (!location) {
    return res.status(400).send({ error: "Location is required" });
  }
  try {
    const response = await fetch(
      `${GEO_API_URL}?q=${location}&maxRows=1&username=${GEO_USERNAME}`
    );
    console.log(response);
    if (!response.ok) {
      return res
        .status(500)
        .send({ error: "Failed to fetch data from GeoNames" });
    }
    const data = await response.json();
    if (data.geonames && data.geonames.length > 0) {
      const { lat, lng } = data.geonames[0];
      res.send({ lat, lng });
    } else {
      res.status(404).send({ error: "Location not found" });
    }
  } catch (error) {
    console.error("Error fetching data from GeoNames:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// API Configuration for Weatherbit
const WEATHER_API_URL = "https://api.weatherbit.io/v2.0/current";
const WEATHER_API_KEY = "fb99b65a1f684a05adb4c4c5849e706c";

app.post("/getWeather", async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) {
    return res
      .status(400)
      .send({ error: "Latitude and Longitude are required" });
  }
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${lng}&key=${WEATHER_API_KEY}`
    );
    if (!response.ok) {
      return res.status(500).send({ error: "Failed to fetch weather data" });
    }
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const weather = data.data[0];
      res.send({
        temperature: weather.temp,
        weather_description: weather.weather.description,
        city_name: weather.city_name,
      });
    } else {
      res.status(404).send({ error: "Weather data not found" });
    }
  } catch (error) {
    console.error("Error fetching data from Weatherbit:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// API Configuration for Pixabay
const PIXABAY_API_URL = "https://pixabay.com/api/";
const PIXABAY_API_KEY = "49280368-f070c4e8d799d74bd9a21c996";

app.post("/getImage", async (req, res) => {
  console.log("Request body:", req.body);
  const { location } = req.body;
  if (!location) {
    return res.status(400).send({ error: "Location is required" });
  }
  try {
    const response = await fetch(
      `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${location}&image_type=photo`
    );
    if (!response.ok) {
      return res
        .status(500)
        .send({ error: "Failed to fetch image from Pixabay" });
    }
    const data = await response.json();
    if (data.hits && data.hits.length > 0) {
      const imageUrl = data.hits[0].webformatURL;
      console.log("Image URL:", imageUrl);
      res.send({ imageUrl });
    } else {
      res
        .status(404)
        .send({ error: "Image not found for the given location" });
    }
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Start the server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  const PORT = 4007;
  app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
  });
}

export default app;
