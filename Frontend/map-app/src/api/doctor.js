// src/api/doctor.js

const API_BASE = "http://localhost:9090";

/** ========= ADMIN (or full dashboard) ========= **/

// Get all doctors (admin view)
export async function fetchAllDoctorsAdmin() {
  const res = await fetch(`${API_BASE}/admin/doctors`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Get doctor by id (admin or public)
export async function fetchDoctorByIdAdmin(id) {
  const res = await fetch(`${API_BASE}/admin/doctors/${id}`);
  if (!res.ok) return null;
  return await res.json();
}

// Create doctor
export async function createDoctor(doctorDTO) {
  const res = await fetch(`${API_BASE}/admin/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctorDTO)
  });
  return await res.json();
}

// Update doctor
export async function updateDoctor(id, doctorDTO) {
  const res = await fetch(`${API_BASE}/admin/doctors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doctorDTO)
  });
  return await res.json();
}

// Delete doctor
export async function deleteDoctor(id) {
  await fetch(`${API_BASE}/admin/doctors/${id}`, { method: "DELETE" });
}

// Add review (admin route)
export async function addDoctorReview(id, reviewDTO) {
  const res = await fetch(`${API_BASE}/admin/doctors/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO)
  });
  return await res.json();
}

/** ========== CUSTOMER / PATIENT FACING ========== **/

// Get all doctors (public)
export async function fetchAllDoctors() {
  const res = await fetch(`${API_BASE}/doctors`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Get doctor by id (public)
export async function fetchDoctorById(id) {
  const res = await fetch(`${API_BASE}/doctors/${id}`);
  if (!res.ok) return null;
  return await res.json();
}

// Get doctor's provider (hospital/clinic), with includeProvider param
export async function fetchDoctorProvider(id) {
  const res = await fetch(`${API_BASE}/doctors/${id}/providers?includeProvider=true`);
  if (!res.ok) return null;
  return await res.json();
}

// PUBLIC: add review for doctor
export async function addDoctorReviewPublic(id, reviewDTO) {
  const res = await fetch(`${API_BASE}/doctors/${id}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO)
  });
  return await res.json();
}

// Filter/search doctors (all customer-facing filter params supported)
export async function filterDoctors(params) {
  // params example: { doc_Id, hos_Id, specialization, ... }
  const search = new URLSearchParams();
  if (params.doc_Id) search.append("doc_Id", params.doc_Id);
  if (params.hos_Id) search.append("hos_Id", params.hos_Id);
  if (params.specialization) search.append("specialization", params.specialization);
  if (params.availabilityStatus) search.append("availabilityStatus", params.availabilityStatus);
  if (params.licenseNumber) search.append("licenseNumber", params.licenseNumber);
  if (params.qualification) search.append("qualification", params.qualification);
  if (params.name) search.append("name", params.name);
  if (params.years_of_practice != null) search.append("years_of_practice", params.years_of_practice);
  if (params.rating != null) search.append("rating", params.rating);

  const url = `${API_BASE}/doctors/filter?${search.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

