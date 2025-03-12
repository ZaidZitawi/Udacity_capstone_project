/**
 * @jest-environment jsdom
 *
 * We use the jsdom environment so we can mock DOM methods like document.getElementById.
 */
import { handleSubmit } from '../src/client/js/app.js';

/**
 * We'll simulate multiple fetch calls:
 * 1. /getLocation => returns { lat, lng }
 * 2. /getWeather => returns { temperature, weather_description, city_name }
 * 3. /getImage => returns { imageUrl }
 *
 * This way we can confirm 3 fetch calls occur in a valid scenario.
 */
let fetchCallCount = 0;
global.fetch = jest.fn(() => {
  fetchCallCount++;
  if (fetchCallCount === 1) {
    // /getLocation
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ lat: 10, lng: 20 }),
    });
  } else if (fetchCallCount === 2) {
    // /getWeather
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          temperature: 25,
          weather_description: 'Clear sky',
          city_name: 'MyCity',
        }),
    });
  } else if (fetchCallCount === 3) {
    // /getImage
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ imageUrl: 'http://example.com/test.jpg' }),
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

// We'll also mock `alert` since `handleSubmit` may call it
global.alert = jest.fn();

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchCallCount = 0;

    // Reset our DOM for each test
    document.body.innerHTML = `
      <form id="travel-form">
        <input id="destination" />
        <input id="start-date" />
        <input id="end-date" />
      </form>
      <div id="result"></div>
    `;
  });

  test('alerts if no destination is provided', async () => {
    document.getElementById('destination').value = '';
    document.getElementById('start-date').value = '2025-01-01';
    document.getElementById('end-date').value = '2025-01-05';

    const fakeEvent = { preventDefault: jest.fn() };
    await handleSubmit(fakeEvent);

    expect(global.alert).toHaveBeenCalledWith(
      'Please enter destination and both travel dates.'
    );
    expect(fetch).not.toHaveBeenCalled(); // no fetch calls
  });

  test('alerts if no start or end date is provided', async () => {
    document.getElementById('destination').value = 'Paris';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';

    const fakeEvent = { preventDefault: jest.fn() };
    await handleSubmit(fakeEvent);

    expect(global.alert).toHaveBeenCalledWith(
      'Please enter destination and both travel dates.'
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  test('alerts if end date is before start date', async () => {
    document.getElementById('destination').value = 'Tokyo';
    document.getElementById('start-date').value = '2025-01-10';
    document.getElementById('end-date').value = '2025-01-05';

    const fakeEvent = { preventDefault: jest.fn() };
    await handleSubmit(fakeEvent);

    expect(global.alert).toHaveBeenCalledWith('End date must be after start date.');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('calls /getLocation, /getWeather, /getImage when valid input is provided', async () => {
    document.getElementById('destination').value = 'London';
    document.getElementById('start-date').value = '2025-01-01';
    document.getElementById('end-date').value = '2025-01-10';

    const fakeEvent = { preventDefault: jest.fn() };
    await handleSubmit(fakeEvent);

    // 1st call
    expect(fetch.mock.calls[0][0]).toBe('http://localhost:4007/getLocation');
    // 2nd call
    expect(fetch.mock.calls[1][0]).toBe('http://localhost:4007/getWeather');
    // 3rd call
    expect(fetch.mock.calls[2][0]).toBe('http://localhost:4007/getImage');

    // Confirm total calls
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
