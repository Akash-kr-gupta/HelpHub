// src/services/api.js

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getHeaders = () => ({
  "Content-Type": "application/json",
});

// Helper to handle JSON response + errors
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

// ================= USER SERVICE =================

const userService = {
  // POST /api/signup
  signup: async ({ name, email, password, role = "user", phone = "" }) => {
    const body = { name, email, password, role, phone };
    const res = await fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // POST /api/login
  login: async ({ email, password }) => {
    const body = { email, password };
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // GET /user/api/<id>
  getUser: async (id) => {
    const res = await fetch(`${API_BASE}/user/api/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // PUT /user/api/<id>
  updateUser: async (id, updates) => {
    const res = await fetch(`${API_BASE}/user/api/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  // GET /user/api/<id>/stats
  getUserStats: async (id) => {
    const res = await fetch(`${API_BASE}/user/api/${id}/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ================= REQUEST SERVICE =================

const requestService = {
  // GET /request/api
  listRequests: async () => {
    const res = await fetch(`${API_BASE}/request/api`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(res);
    return data.data || [];
  },

  // GET /request/api/<id>
  getRequest: async (id) => {
    const res = await fetch(`${API_BASE}/request/api/${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // POST /request (for web form, not JSON)
  // For JSON‑based creation, you’d add a POST /request/api route later
  createRequest: async (reqData) => {
    const formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key]);
    });

    const res = await fetch(`${API_BASE}/request`, {
      method: "POST",
      // don't set Content-Type; browser does it for multipart/form-data
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to create request");
    }

    return { success: true, message: "Request posted successfully" };
  },

  // POST /request/api/accept/<id>
  acceptRequest: async (id) => {
    const res = await fetch(`${API_BASE}/request/api/accept/${id}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // POST /request/api/complete/<id>
  completeRequest: async (id) => {
    const res = await fetch(`${API_BASE}/request/api/complete/${id}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// ================= DONATION SERVICE =================

const donationService = {
  // GET /donate/api
  listDonations: async () => {
    const res = await fetch(`${API_BASE}/donate/api`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(res);
    return data.data || [];
  },

  // POST /donate/api (JSON)
  createDonation: async (donationData) => {
    const res = await fetch(`${API_BASE}/donate/api`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    });
    return handleResponse(res);
  },
};

// ================= MODULE EXPORT =================

export default {
  userService,
  requestService,
  donationService,
};