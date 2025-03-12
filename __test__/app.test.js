/**
 * @jest-environment jsdom
 *
 * We use the jsdom environment so we can mock DOM methods like document.getElementById.
 */
import { handleSubmit } from '../src/client/js/app.js';

// We'll mock fetch calls with different responses for each call:
let fetchCallCount = 0;
global.fetch = jest.fn(() => {
  fetchCallCount++;
  // 1st call: /getLocation => returns lat, lng
  if (fetchCallCount === 1) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ lat: 10, lng: 20 }),
    });
  }
  // 2nd call: /getWeather => returns temperature
  if (fetchCallCount === 2) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          temperature: 25,
          weather_description: 'Clear sky',
          city_name: 'MyCity',
        }),
    });
  }
  // 3rd call: /getImage => returns imageUrl
  if (fetchCallCount === 3) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ imageUrl: 'http://example.com/test.jpg' }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

// We'll also mock `alert` since `handleSubmit` may call it
global.alert = jest.fn();

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchCallCount = 0;

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
    // No network calls
    expect(fetch).not.toHaveBeenCalled();
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

    // #1 fetch => /getLocation
    expect(fetch.mock.calls[0][0]).toBe('http://localhost:4007/getLocation');

    // #2 fetch => /getWeather
    expect(fetch.mock.calls[1][0]).toBe('http://localhost:4007/getWeather');

    // #3 fetch => /getImage
    expect(fetch.mock.calls[2][0]).toBe('http://localhost:4007/getImage');

    // total 3 calls
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
