"use client";

import React, { useState } from "react";

export default function FillJob() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/router/fillinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Info submitted successfully!");
        setFormData({ name: "", email: "", phone: "", location: "" });
      } else {
        setMessage(data.message || "Failed to submit info.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-900">Fill Info</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="text-sm font-bold text-gray-700 block">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-bold text-gray-700 block">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-bold text-gray-700 block">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-bold text-gray-700 block">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition duration-200"
        >
          Submit
        </button>
      </form>
      {message && <p className="text-center mt-4 text-green-600 font-semibold">{message}</p>}
    </div>
  );
}
