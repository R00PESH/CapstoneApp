// src/api/provider.js

const API_BASE = "http://localhost:9090";

// ADMIN: Fetch all providers (hospitals/clinics)
export async function fetchAllProvidersAdmin() {
  const res = await fetch(`${API_BASE}/admin/providers`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// ADMIN: Fetch a single provider by ID
export async function fetchProviderByIdAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/providers/${id}`);
  if (!res.ok) return null;
  return await res.json();
}

// ADMIN: Create provider
export async function createProvider(providerDTO) {
  const res = await fetch(`${API_BASE}/admin/providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerDTO)
  });
  return await res.json();
}

// ADMIN: Update provider
export async function updateProvider(id, providerDTO) {
  const res = await fetch(`${API_BASE}/admin/providers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerDTO)
  });
  return await res.json();
}

// ADMIN: Delete provider
export async function deleteProvider(id) {
  await fetch(`${API_BASE}/admin/providers/${id}`, { method: "DELETE" });
}

// ADMIN: Find providers by hospital name
export async function fetchProvidersByHospitalName(hospitalName) {
  const res = await fetch(`${API_BASE}/admin/providers/hospital/${encodeURIComponent(hospitalName)}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// ADD REVIEW to Provider (admin version)
export async function addProviderReview(id, reviewDTO) {
  const res = await fetch(`${API_BASE}/admin/providers/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO)
  });
  return await res.json();
}

// ----------- CUSTOMER-FACING ("public") ---------------

// CUSTOMER: Basic search/filter of providers
export async function filterProviders({
  lat, lon, distanceKm, zipcode, minRating, insurancePlans, Hospital_name, Location, speciality
}) {
  const params = new URLSearchParams();
  if (lat) params.append("lat", lat);
  if (lon) params.append("lon", lon);
  if (distanceKm) params.append("distanceKm", distanceKm);
  if (zipcode) params.append("zipcode", zipcode);
  if (minRating) params.append("minRating", minRating);
  if (insurancePlans && Array.isArray(insurancePlans)) {
    insurancePlans.forEach(plan => params.append("insurancePlans", encodeURIComponent(plan)));
  }
  if (Hospital_name) params.append("Hospital_Name", Hospital_name);
  if (Location) params.append("location", Location);
  if (speciality) params.append("speciality", speciality);
  const url = `${API_BASE}/providers/filter?${params.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// CUSTOMER: Get provider by ID (public/search page version)
export async function fetchProviderById(id) {
  const res = await fetch(`${API_BASE}/providers/${id}`);
  if (!res.ok) return null;
  return await res.json();
}

// CUSTOMER: Get all providers (public search page)
export async function fetchAllProviders() {
  const res = await fetch(`${API_BASE}/providers`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// CUSTOMER: Add review to provider
export async function addProviderReviewPublic(id, reviewDTO) {
  const res = await fetch(`${API_BASE}/providers/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO)
  });
  return await res.json();
}
