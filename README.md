# GeoSpotlight

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-16.x-green.svg)

## 📖 Description

GeoSpotlight allows users to discover and manage events seamlessly within any city. Its offers an interactive mapping experience where users can search for events, visualize them on a map, and save their favorites for easy access later.

[![Video](https://img.youtube.com/vi/NA_hH2VRVpM/maxresdefault.jpg)](https://www.youtube.com/watch?v=NA_hH2VRVpM)

## Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📄 License](#-license)

## ✨ Features

- **FastAPI Backend:**
  - **High-Performance Endpoints:** Efficiently handle event data and user interactions.
  - **Automatic Documentation:** Interactive API docs available via Swagger UI.
  - **Integration with Third-Party Services:** Seamlessly connect with SerpAPI for event data and Supabase for database management.

- **React Frontend:**
  - **Modern UI with Tailwind CSS:** Responsive and sleek user interface.
  - **Interactive Map Visualization:** Utilize Mapbox to display events on a dynamic map with customized markers.
  - **State Management:** Real-time updates and efficient state handling for a smooth user experience.

- **Event Management:**
  - **Search Functionality:** Find events in any city using SerpAPI.
  - **Save Favorites:** Mark events as favorites and store them in Supabase for easy retrieval.
  - **Manage Saved Events:** View, edit, and delete saved events directly from the interface.

## 🛠️ Tech Stack

- **Frontend**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Mapbox](https://www.mapbox.com/)
- **Backend**
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [Uvicorn](https://www.uvicorn.org/)
  - [Supabase](https://supabase.com/)
- **APIs**
  - [Mapbox API](https://www.mapbox.com/)
  - [SerpAPI](https://serpapi.com/) (for fetching event data)
- **Others**
  - [Python 3.9](https://www.python.org/)
  - [Node.js 16.x](https://nodejs.org/)
  - [Virtualenv](https://virtualenv.pypa.io/en/latest/)

## 📄 License
This project is licensed under the [MIT License](../LICENSE)