import request from 'supertest';
import app from '../src/server/server.js'; // correct relative path
import nock from 'nock';

describe('Server endpoints', () => {
  it('should respond with status 200 on root GET', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Server is running!');
  });

  describe('POST /getLocation', () => {
    it('should return 400 if no location is provided', async () => {
      const response = await request(app).post('/getLocation').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Location is required');
    });

    it('should return data if location is provided', async () => {
      nock('http://api.geonames.org')
        .get(/searchJSON/)
        .reply(200, {
          geonames: [{ lat: '12.345', lng: '67.89' }],
        });

      const response = await request(app)
        .post('/getLocation')
        .send({ location: 'TestCity' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ lat: '12.345', lng: '67.89' });
    });
  });

  describe('POST /getWeather', () => {
    it('should return 400 if no lat/lng is provided', async () => {
      const response = await request(app).post('/getWeather').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Latitude and Longitude are required');
    });

    it('should return weather data if lat/lng is provided', async () => {
      nock('https://api.weatherbit.io')
        .get(/v2.0\/current/)
        .reply(200, {
          data: [
            {
              temp: 25,
              weather: { description: 'Clear sky' },
              city_name: 'Test City',
            },
          ],
        });

      const response = await request(app)
        .post('/getWeather')
        .send({ lat: 10, lng: 20 });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        temperature: 25,
        weather_description: 'Clear sky',
        city_name: 'Test City',
      });
    });
  });

  describe('POST /getImage', () => {
    it('should return 400 if no location is provided', async () => {
      const response = await request(app).post('/getImage').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Location is required');
    });

    it('should return 404 if pixabay finds no images', async () => {
      nock('https://pixabay.com')
        .get(/api/)
        .reply(200, { hits: [] });

      const response = await request(app)
        .post('/getImage')
        .send({ location: 'Mars' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Image not found for the given location');
    });

    it('should return the image URL if found', async () => {
      nock('https://pixabay.com')
        .get(/api/)
        .reply(200, {
          hits: [{ webformatURL: 'http://pixabay.com/test-image.jpg' }],
        });

      const response = await request(app)
        .post('/getImage')
        .send({ location: 'Paris' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        imageUrl: 'http://pixabay.com/test-image.jpg',
      });
    });
  });
});
