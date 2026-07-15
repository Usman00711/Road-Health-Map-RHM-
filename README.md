# Road Health Map

Road Health Map is an admin dashboard for turning MPU6050 accelerometer readings into road-condition intelligence. The restored local version includes:

- a React authority dashboard with road-condition summaries, charts, a route visualization, feedback, tasks, profile, and settings;
- an Express API with token-based administrator authentication;
- MongoDB 7 in Docker with persistent local storage;
- automatic first-run import of all 10,023 classified readings from `data/TotalData.csv`.

The supplied CSV contains acceleration and class values but no GPS coordinates or timestamps. The sample surveyed route uses six field observations (three breakers and three rough patches) plus five midpoint-interpolated good-road points, producing 11 ordered markers. All markers remain attached to classified MongoDB sensor records, matching the original project data flow.

The frontend map provider is reversible through `REACT_APP_MAP_PROVIDER`: use `osm` for the free Leaflet/OpenStreetMap map, `google` for the preserved Google Maps component, or `fallback` for the built-in schematic. Restart the frontend after changing the value. Google mode additionally requires `REACT_APP_GOOGLE_MAPS_API_KEY`.

## Run locally

Requirements: Docker Desktop, Node.js, and npm.

From this folder, start MongoDB:

```bash
npm run db:up
```

In a second terminal, start the API:

```bash
npm run backend
```

In a third terminal, start the frontend:

```bash
npm run frontend
```

Open `http://localhost:3001` and sign in with:

- Email: `admin@rhm.local`
- Password: `RoadHealth123!`

The frontend uses port `3001` to avoid the existing Grafana service on port `3000`. The API uses port `5050` because macOS commonly reserves port `5000` for Control Centre/AirPlay.

## Configuration

The defaults work without local environment files. For custom values, copy `backend/.env.example` to `backend/.env`.

To enable the real Google map, copy `frontend/.env.example` to `frontend/.env`, add a browser-restricted Google Maps JavaScript API key, and restart the frontend. The frontend API URL can also be overridden with `REACT_APP_API_URL`.

## Useful commands

```bash
npm run build       # production frontend build
npm run db:down     # stop MongoDB without deleting its data
```

MongoDB data remains in the `rhm-mongo-data` Docker volume. Starting the backend again does not duplicate seed records.

## Rebuild the SVM model

The reproducible training script is `ml/train_svm.py`. It follows the archived implementation (RBF SVM, `C=2`, SMOTE, random state 2) and saves `ml/svm_model.joblib`.

The original Jupyter implementation is included in `notebooks/Python Projects/SVM.ipynb`, the collected source files are under `data/` and `sensor-values/`, and portfolio-ready application images are available in `screenshots/`.

The verified model trained on all 10,023 rows with a stratified 80/20 split achieved 74.76% test accuracy and a 73.81% weighted F1 score.
