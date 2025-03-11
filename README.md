# 🌍 Travel Explorer

Travel Explorer is a dynamic web application that helps users discover new destinations, get real-time weather updates, and view stunning images of their chosen locations. Built with **Node.js** and **Express**, it leverages the power of **GeoNames**, **Weatherbit**, and **Pixabay** APIs.

---

## 🚀 Key Features

- **Destination Search**: Find any place in the world and get its geographical coordinates.
- **Weather Updates**: Receive current weather conditions for any location.
- **Visual Exploration**: Browse beautiful images related to your travel destinations.

---

## 🛠️ System Requirements

To run this project, you need:
- **Node.js v20.12.2**
- **NPM** (Node Package Manager)

Ensure you have the correct Node.js version installed.

---

## 📦 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Travel-Explorer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Travel-Explorer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure your environment variables by creating a `.env` file in the root directory:
   ```env
   GEO_USERNAME=your-geonames-username
   WEATHER_API_KEY=your-weatherbit-api-key
   PIXABAY_API_KEY=your-pixabay-api-key
   ```
   Replace the placeholders with your actual API keys.

---

## 🌐 API Endpoints

### 1. **Fetch Coordinates**
- **Endpoint**: `POST /api/location`
- **Request**:
  ```json
  {
    "location": "New York"
  }
  ```
- **Response**:
  ```json
  {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```

### 2. **Fetch Weather**
- **Endpoint**: `POST /api/weather`
- **Request**:
  ```json
  {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```
- **Response**:
  ```json
  {
    "temperature": 22,
    "description": "Sunny",
    "city": "New York"
  }
  ```

### 3. **Fetch Images**
- **Endpoint**: `POST /api/images`
- **Request**:
  ```json
  {
    "location": "New York"
  }
  ```
- **Response**:
  ```json
  {
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
  ```

---

## 🧪 Running Tests

To execute unit tests using **Jest**, run:
```bash
npm test
```

---

## 🔧 Development Workflow

1. Build the project:
   ```bash
   npm run build
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. For simultaneous backend and frontend development with hot reloading:
   ```bash
   npm start
   ```
   The application will be available at **http://localhost:4007**.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
