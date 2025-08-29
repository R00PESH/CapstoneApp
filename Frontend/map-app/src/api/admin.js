// src/api/admin.js

const API_BASE = "http://localhost:9090";

/** -------------------------------------------
 *  DOCTOR ADMIN APIS  (/admin/doctors)
 *  -------------------------------------------
 */

// CREATE doctor
export async function createDoctor(doctorDTO) {
  const res = await fetch(`${API_BASE}/admin/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctorDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// READ all doctors
export async function fetchAllDoctors() {
  const res = await fetch(`${API_BASE}/admin/doctors`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// READ doctor by id
export async function fetchDoctorById(id) {
  const res = await fetch(`${API_BASE}/admin/doctors/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return await res.json();
}

// UPDATE doctor
export async function updateDoctor(id, doctorDTO) {
  const res = await fetch(`${API_BASE}/admin/doctors/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctorDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// DELETE doctor
export async function deleteDoctor(id) {
  await fetch(`${API_BASE}/doctors/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ADD review to doctor
export async function addDoctorReview(id, reviewDTO) {
  const res = await fetch(`${API_BASE}/admin/doctors/${encodeURIComponent(id)}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

/** -------------------------------------------
 *  PROVIDER ADMIN APIS  (/admin/providers)
 *  -------------------------------------------
 */

// CREATE provider
export async function createProvider(providerDTO) {
  const res = await fetch(`${API_BASE}/admin/providers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// READ all providers
export async function fetchAllProviders() {
  const res = await fetch(`${API_BASE}/providers`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// READ provider by id
export async function fetchProviderById(id) {
  const res = await fetch(`${API_BASE}/admin/providers/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return await res.json();
}

// READ providers by hospital name
export async function fetchProvidersByHospitalName(hospitalName) {
  const res = await fetch(
    `${API_BASE}/admin/providers/hospital/${encodeURIComponent(hospitalName)}`
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// UPDATE provider
export async function updateProvider(id, providerDTO) {
  const res = await fetch(`${API_BASE}/providers/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(providerDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// DELETE provider
export async function deleteProvider(id) {
  await fetch(`${API_BASE}/providers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ADD review to provider
export async function addProviderReview(id, reviewDTO) {
  const res = await fetch(`${API_BASE}/admin/providers/${encodeURIComponent(id)}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

