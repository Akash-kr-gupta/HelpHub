// src/pages/Signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup(
        form.name,
        form.email,
        form.password,
        form.role,
        form.phone
      );
    } catch (err) {
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2 className="auth-title">Create a HelpHub Account</h2>
        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="alert alert-error">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="alert alert-error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="alert alert-error">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-input"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">
              I am a
            </label>
            <select
              id="role"
              name="role"
              className="form-input"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Regular User</option>
              <option value="ngo">NGO / Rescue Organization</option>
              <option value="volunteer">Volunteer</option>
              <option value="donor">Blood / Donor / Food Donor</option>
              <option value="admin">Admin (if enabled)</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <a href="/login" className="btn btn-outline">
              Already have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}