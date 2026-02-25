# Construction Company – Static Site

Static-only construction company website. Works on **Windows, macOS, and Linux**. No backend or database required.

- **Forms:** [Web3Forms](https://web3forms.com/) (contact, quote, testimonials)
- **Images:** [Cloudinary](https://cloudinary.com/) optional for gallery
- **Data:** Static JSON in `frontend/public/data/`

## Setup

1. **Install dependencies** (from repo root or `frontend/`):

   ```bash
   npm install --prefix frontend
   # or
   cd frontend && npm install
   ```

2. **Optional – add keys** (copy `frontend/.env.example` to `frontend/.env`):

   - `REACT_APP_WEB3FORMS_ACCESS_KEY` – for contact/quote/review forms
   - `REACT_APP_CLOUDINARY_CLOUD_NAME` – for Cloudinary gallery images

## Run (any OS)

From **repo root**:

```bash
npm start    # dev server
npm run build   # production build (output in frontend/build)
```

Or from **frontend**:

```bash
cd frontend
npm start
npm run build
```

## Edit content

- **Services, projects, team, testimonials, stats:** edit JSON in `frontend/public/data/`.
- **Gallery images:** use full image URLs in JSON, or set `REACT_APP_CLOUDINARY_CLOUD_NAME` and use Cloudinary public IDs (e.g. `"gallery/project1"`).

## Tech

- React 19, React Router, Tailwind CSS, CRACO
- Node 18+
