# Real Estate Website (MERN)

A premium-ready MERN starter for a real estate platform with:
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose models
- JWT authentication
- Property CRUD + filtering
- Reusable UI components

## Project Structure

- `client`: Frontend (React)
- `server`: Backend (Express API)

## Quick Start

1. Install root dev dependency:
   - `npm install`
2. Install app dependencies:
   - `npm run install:all`
3. Add environment files:
   - Create `server/.env` from `server/.env.example`
4. Start full stack:
   - `npm run dev`

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:5000`

## Main Pages Included

- Home
- Properties
- Property Details
- Add Property
- Login
- Register
- Dashboard
- Contact

## Core Backend Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`
- `POST /api/properties/:id/favorite`

## Notes

- Image upload is set up with Multer (`server/uploads/propertyImages`).
- You can later switch to Cloudinary for production-grade media handling.
- Map embedding can be done in `PropertyDetails.jsx` using Google Maps or Mapbox.
