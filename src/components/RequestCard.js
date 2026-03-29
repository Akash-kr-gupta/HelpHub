// src/components/RequestCard.js
import React from "react";

export default function RequestCard({ request }) {
  // Example shape: { help_type, description, location, priority, status, createdAt }
  const { help_type, description, location, priority, status, createdAt } =
    request;

  const statusClass =
    status === "Completed"
      ? "completed"
      : status === "Cancelled"
      ? "cancelled"
      : "pending";

  const truncatedDesc =
    description.length > 100
      ? description.slice(0, 100) + "..."
      : description;

  const formattedDate = new Date(createdAt)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "/");

  return (
    <article className="request-item">
      <div>
        <strong className="request-heading">
          {help_type || "Help Request"}
        </strong>
        <p className="request-meta">
          {truncatedDesc}
        </p>
        <p className="request-meta">
          📍 {location || "Unknown"} · ⚠️ {priority || "Medium"}
        </p>
        <p className="request-meta">
          📅 {formattedDate}
        </p>
      </div>
      <span className={`request-status ${statusClass}`}>
        {status || "Pending"}
      </span>
    </article>
  );
}

RequestCard.defaultProps = {
  request: {
    help_type: "Help request",
    description: "A person in need of urgent help.",
    location: "Local area",
    priority: "Medium",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
};