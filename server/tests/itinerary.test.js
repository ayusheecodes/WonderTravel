const { createItinerary } = require('../services/itineraryService');

describe('Itinerary Service', () => {
  it('should generate an itinerary for an existing destination', async () => {
    const request = {
      destination: 'Manali',
      days: 3,
      budget: 'Rs 15000',
      style: 'adventure',
      travelers: '2 People'
    };

    const result = await createItinerary(request);

    expect(result).toBeDefined();
    expect(result.destination || result.canonicalDestination).toBeDefined();
    expect(result.days).toBe(3);
    expect(result.days_data.length).toBe(3);
  });

  it('should fallback to default destination (Manali) if unknown', async () => {
    const request = {
      destination: 'UnknownPlaceThatDoesNotExist',
      days: 2,
      budget: 'Rs 10000',
      style: 'relaxed',
      travelers: '1 Person'
    };

    const result = await createItinerary(request);

    expect(result).toBeDefined();
    // createItinerary may return canonicalDestination on fallback
    expect(result.destination === 'Manali' || result.canonicalDestination === 'Manali').toBeTruthy();
    expect(result.days).toBe(2);
  });

  it('should cap days at 14 maximum', async () => {
    const request = {
      destination: 'Goa',
      days: 20,
      budget: 'Rs 50000',
      style: 'luxury',
      travelers: '2 People'
    };

    const result = await createItinerary(request);

    expect(result).toBeDefined();
    expect(result.days).toBe(14); // Capped at 14
    expect(result.days_data.length).toBe(14);
  });

  it('should inject map coordinates into activities', async () => {
    const request = {
      destination: 'Kerala',
      days: 1,
      budget: 'Rs 10000',
      style: 'cultural',
      travelers: '2 People'
    };

    const result = await createItinerary(request);

    expect(result.days_data[0].activities.length).toBeGreaterThan(0);
    const activity = result.days_data[0].activities[0];

    expect(activity.coordinates).toBeDefined();
    expect(Array.isArray(activity.coordinates)).toBe(true);
    expect(activity.coordinates.length).toBe(2);
  });
});
