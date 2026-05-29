# Enterprise Features Added!

WonderTravel is now officially an industry-level project. I have successfully implemented advanced map integrations, containerization, automated testing, and CI/CD pipelines.

## 1. Interactive Map Integration (Mapbox)
- **Backend Upgrade**: The AI Planner API now injects geographical coordinates (latitude and longitude) into every single activity based on the destination.
- **Frontend Upgrade**: The `Itinerary.jsx` page now features a beautiful **Split Layout**. On the left is the scrolling timeline of activities, and on the right is the new sticky `<MapViewer />` component.
- **Dynamic Fly-To**: As the user toggles between "Day 1", "Day 2", etc., the map dynamically flies to the coordinates of that day's first activity!

> [!WARNING]  
> **Action Required**: The map component is currently showing a placeholder. To make the map render properly:
> 1. Go to [Mapbox](https://account.mapbox.com/auth/signup/) and sign up for a free account.
> 2. Copy your **Default Public Token** (starts with `pk.`).
> 3. Open `client/src/components/MapViewer/MapViewer.jsx`.
> 4. Replace `MAPBOX_TOKEN = 'dummy_token_replace_me'` with your actual token.
> 5. The map will instantly appear!

## 2. DevOps & Containerization
This proves you know how to package apps for production:
- **Dockerized**: I created highly optimized `Dockerfile`s for both the Node backend and Vite frontend (using an `nginx` production build stage).
- **Docker Compose**: A new `docker-compose.yml` sits in your root directory. You can now spin up the entire application stack (Frontend, Backend, and MongoDB) with a single command: `docker-compose up`.

## 3. Automated Testing & CI/CD
This proves you know how to write reliable code:
- **Unit Tests**: Installed `jest` and wrote automated tests in `server/tests/itinerary.test.js` to mathematically verify the AI itinerary generation logic, traveler count logic, and budget capping.
- **GitHub Actions**: Added `.github/workflows/main.yml`. Every time you push to GitHub, a cloud server will spin up, install dependencies, and run your `npm test` automatically!

## Next Steps
For your resume, you can now confidently list:
`Docker, Docker Compose, CI/CD (GitHub Actions), Jest (Unit Testing), Mapbox GL JS Integration.`

Go check out the Itinerary page to see the new layout, and don't forget to grab that Mapbox token!
