// src/services/api.js
const API_BASE_ADMIN = "http://localhost:3000/api/admin/v1";

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // include cookies if needed
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw err;
  }
  return res.json();
}

export const fetchStations = () => jsonFetch(`${API_BASE_ADMIN}/view/stations`);
export const fetchSections = () => jsonFetch(`${API_BASE_ADMIN}/view/sections`);
export const fetchTracksForSection = (sectionId) =>
  jsonFetch(`${API_BASE_ADMIN}/view/tracks/${sectionId}`);
export const fetchSignalsForTrack = (trackId) =>
  jsonFetch(`${API_BASE_ADMIN}/view/signals/${trackId}`);
