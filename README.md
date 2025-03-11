# Travel App

This is a simple travel app that allows users to search for locations, get weather information, and view related images. It uses **Node.js**, **Express**, and integrates with various third-party APIs: **GeoNames API** for location data, **Weatherbit API** for weather information, and **Pixabay API** for fetching images.

---

## ✨ Features

- **Location Search**: Allows users to search for a location and get its latitude and longitude using the GeoNames API.
- **Weather Information**: Fetches current weather data, including temperature and weather description, for a specific location using latitude and longitude.
- **Images**: Displays images related to a location fetched from the Pixabay API.

---

## ⚙️ Requirements

This project requires:
- **Node.js v20.12.2**
- **NPM** (Node Package Manager)

Ensure you have the specified Node.js version installed for compatibility.

---

## 📥 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/Travel-App.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Travel-App
   ```
3. Install the necessary dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your API keys:
   ```env
   GEO_USERNAME=your-geonames-username
   WEATHER_API_KEY=your-weatherbit-api-key
   PIXABAY_API_KEY=your-pixabay-api-key
   ```
   - Replace `your-geonames-username`, `your-weatherbit-api-key`, and `your-pixabay-api-key` with your actual API credentials.
   - Test the API endpoints using tools like **Postman** or **cURL**.

---

## 📡 API Endpoints

### 1. **Get Location Data**
- **Endpoint**:  
  `POST /getLocation`  
- **Request Body**:  
  ```json
  {
    "location": "Paris"
  }
  ```
- **Response**:  
  ```json
  {
    "lat": 48.8566,
    "lng": 2.3522
  }
  ```

### 2. **Get Weather Information**
- **Endpoint**:  
  `POST /getWeather`  
- **Request Body**:  
  ```json
  {
    "lat": 48.8566,
    "lng": 2.3522
  }
  ```
- **Response**:  
  ```json
  {
    "temperature": 15,
    "weather_description": "Clear Sky",
    "city_name": "Paris"
  }
  ```

### 3. **Get Location Image**
- **Endpoint**:  
  `POST /getImage`  
- **Request Body**:  
  ```json
  {
    "location": "Paris"
  }
  ```
- **Response**:  
  ```json
  {
    "imageUrl": "https://example.com/image.jpg"
  }
  ```

---

## 🧪 Testing

To run unit tests for the app using **Jest**, execute:  
```bash
NODE_OPTIONS=--experimental-vm-modules npm run test --detectOpenHandles
```

---

## 🛠 Build & Development

To set up **webpack** and start your development environment, follow these steps:

1. First, build your project to create the `dist` folder:

   ```bash
   npm run build
   ```

2. Then, start the development server with webpack:

   ```bash
   npm run dev
   ```

3. Finally, you can run both the development server and Express simultaneously for hot reloading and a working backend:

   ```bash
   npm run start
   ```
   - The app will run at **http://localhost:4007**.

This will ensure that both your **frontend** (with hot reloading) and **backend** (Express) are up and running smoothly during development.

---

## 📜 License
This project is licensed under the **MIT License**. Check the `LICENSE` file for more details.

---

## 🙌 Acknowledgments
- **GeoNames API**: For geographic data like latitude and longitude.  
- **Weatherbit API**: For providing accurate and reliable weather information.  
- **Pixabay API**: For fetching high-quality images for travel destinations.  

---

### 🌟 Key Notes:
- **Ensure your Node.js version is v20.12.2** to avoid compatibility issues.
- The `.env` file should be kept private and not included in any public repositories.
- API keys are required to run the app; sign up on the respective API provider websites to get them.
- **Ensure Run** `npm run build`to create the dist folder, then `npm run dev` for development, and `npm run start` to run both webpack and Express with hot reloading.

Enjoy exploring the world with the Travel App 🌍✨!


