// src/api/insuranceapi.js

const API_BASE = "http://localhost:9090";

// ----------- INSURANCE PLANS API: /insurance-plans -----------

/**
 * Create a new insurance plan.
 * @param {Object} planDTO
 * @returns {Promise<Object>}
 */
export async function createInsurancePlan(planDTO) {
  const res = await fetch(`${API_BASE}/insurance-plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(planDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

/**
 * Get all insurance plans (as array).
 * @returns {Promise<Array>}
 */
export async function fetchAllInsurancePlans() {
  const res = await fetch(`${API_BASE}/insurance-plans`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Get a single plan by title.
 * @param {string} title
 * @returns {Promise<Object|null>}
 */
export async function fetchInsurancePlanByTitle(title) {
  const res = await fetch(`${API_BASE}/insurance-plans/${encodeURIComponent(title)}`);
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Update an insurance plan by title.
 * @param {string} title
 * @param {Object} planDTO
 * @returns {Promise<Object|null>}
 */
export async function updateInsurancePlanByTitle(title, planDTO) {
  const res = await fetch(`${API_BASE}/insurance-plans/${encodeURIComponent(title)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(planDTO),
  });
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Delete an insurance plan by title.
 * @param {string} title
 * @returns {Promise<void>}
 */
export async function deleteInsurancePlanByTitle(title) {
  const res = await fetch(`${API_BASE}/insurance-plans/${encodeURIComponent(title)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete insurance plan");
}

// ----------- INSURER CUSTOMERS API: /insurer/customers -----------

/**
 * Create a customer (from insurer).
 * @param {Object} customerDTO
 * @returns {Promise<Object>}
 */
export async function createInsurerCustomer(customerDTO) {
  const res = await fetch(`${API_BASE}/insurer/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerDTO),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

/**
 * Get all insurer-managed customers.
 * @returns {Promise<Array>}
 */
export async function fetchAllInsurerCustomers() {
  const res = await fetch(`${API_BASE}/insurer/customers`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Get a customer by Aadhaar number (from insurer).
 * @param {string} adharNum
 * @returns {Promise<Object|null>}
 */
export async function fetchInsurerCustomerByAdharNum(adharNum) {
  const res = await fetch(`${API_BASE}/insurer/customers/${encodeURIComponent(adharNum)}`);
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Update a customer by Aadhaar number (from insurer).
 * @param {string} adharNum
 * @param {Object} customerDTO
 * @returns {Promise<Object|null>}
 */
export async function updateInsurerCustomerByAdharNum(adharNum, customerDTO) {
  const res = await fetch(`${API_BASE}/insurer/customers/${encodeURIComponent(adharNum)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerDTO),
  });
  if (!res.ok) return null;
  return await res.json();
}

/**
 * Delete a customer by Aadhaar number (from insurer).
 * @param {string} adharNum
 * @returns {Promise<void>}
 */
export async function deleteInsurerCustomerByAdharNum(adharNum) {
  const res = await fetch(`${API_BASE}/insurer/customers/${encodeURIComponent(adharNum)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete insurer customer");
}
