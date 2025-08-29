// src/api/customer.js

const API_BASE = "http://localhost:9090";

// ============ CUSTOMER ACCOUNT ============

// Register a new customer (signup)
export async function createCustomer(customerDTO) {
  const res = await fetch(`${API_BASE}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Get a customer by Aadhaar/ID
export async function fetchCustomerById(id) {
  const res = await fetch(`${API_BASE}/customers/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return await res.json();
}

// Get all customers (admin or profile list)
export async function fetchAllCustomers() {
  const res = await fetch(`${API_BASE}/customers`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Update a customer (profile edit)
export async function updateCustomer(id, customerDTO) {
  const res = await fetch(`${API_BASE}/customers/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Delete a customer
export async function deleteCustomer(id) {
  await fetch(`${API_BASE}/customers/${encodeURIComponent(id)}`, { method: "DELETE" });
}


// ============ CUSTOMER-FACING: Find Doctors/Providers via Gateway ============

// Search doctors with filters (customer view)
export async function filterDoctorsForCustomer(params) {
  // params: { doc_Id, hosId, specialization, ... }
  const search = new URLSearchParams();
  if (params.doc_Id) search.append("doc_Id", params.doc_Id);
  if (params.hosId) search.append("hosId", params.hosId);
  if (params.specialization) search.append("specialization", params.specialization);
  if (params.availabilityStatus) search.append("availabilityStatus", params.availabilityStatus);
  if (params.licenseNumber) search.append("licenseNumber", params.licenseNumber);
  if (params.qualification) search.append("qualification", params.qualification);
  if (params.name) search.append("name", params.name);
  if (params.yearsOfExperience !== undefined) search.append("yearsOfExperience", params.yearsOfExperience);
  if (params.rating !== undefined) search.append("rating", params.rating);

  const url = `${API_BASE}/customer-view/doctors/filter?${search.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// View doctor by hosId (customer)
export async function getDoctorByHosId(hosId) {
  const res = await fetch(`${API_BASE}/customer-view/doctors/by-hosid?hosId=${encodeURIComponent(hosId)}`);
  if (!res.ok) return null;
  return await res.json();
}

// View doctor by docId
export async function getDoctorByDocId(docId) {
  const res = await fetch(`${API_BASE}/customer-view/doctors/by-docid?docId=${encodeURIComponent(docId)}`);
  if (!res.ok) return null;
  return await res.json();
}

// Add review to a doctor (customer)
export async function addReviewToDoctor(docId, reviewDTO) {
  const res = await fetch(`${API_BASE}/customer-view/doctors/${encodeURIComponent(docId)}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// ========== CUSTOMER-FACING: Providers/Hospitals ==========

// Search/filter providers (customer)
export async function filterProvidersForCustomer(params) {
  // params: { speciality, rating, hospitalName, location, zipcode, lat, lon, distanceKm, insurancePlan }
  const search = new URLSearchParams();
  if (params.speciality) search.append("speciality", params.speciality);
  if (params.rating) search.append("rating", params.rating);
  if (params.hospitalName) search.append("Hospital_Name", params.hospitalName);
  if (params.location) search.append("location", params.location);
  if (params.zipcode) search.append("zipcode", params.zipcode);
  if (params.lat) search.append("lat", params.lat);
  if (params.lon) search.append("lon", params.lon);
  if (params.distanceKm) search.append("distanceKm", params.distanceKm);
  if (params.insurancePlan) search.append("insurancePlan", params.insurancePlan);

  const url = `${API_BASE}/customer-view/providers?${search.toString()}`;
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Get one provider (by providerId, customer-friendly)
export async function fetchProviderProfile(providerId) {
  const res = await fetch(`${API_BASE}/customer-view/providers/${encodeURIComponent(providerId)}`);
  if (!res.ok) return null;
  return await res.json();
}

// Add review to a provider (customer)
export async function addReviewToProvider(proId, reviewDTO) {
  const res = await fetch(`${API_BASE}/customer-view/${encodeURIComponent(proId)}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

