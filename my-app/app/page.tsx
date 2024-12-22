"use client";
import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [relationship, setRelationship] = useState("single");
  const [transactionId, setTransactionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (gender === "female" && relationship === "single") {
        setMessage("Registration successful!");
        setShowQRCode(false);

        const { error } = await supabase.from("registrations").insert([
          {
            name,
            email,
            phone_number: phoneNumber,
            gender,
            relationship,
          },
        ]);

        if (error) throw error;

        setName("");
        setEmail("");
        setPhoneNumber("");
        setGender("male");
        setRelationship("single");
      } else {
        setShowQRCode(true);
        if (transactionId.trim() === "") {
          setMessage("Please enter a transaction ID.");
          return;
        }

        const { error } = await supabase.from("registrations").insert([
          {
            name,
            email,
            phone_number: phoneNumber,
            gender,
            relationship,
            transaction_id: transactionId,
          },
        ]);

        if (error) throw error;

        setMessage("Registration successful!");
        setShowQRCode(false);

        setName("");
        setEmail("");
        setPhoneNumber("");
        setGender("male");
        setRelationship("single");
        setTransactionId("");
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
          New Year Party at VRB!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              pattern="\d{10}"
              title="Phone number must be 10 digits."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="single">Single</option>
              <option value="couple">Couple</option>
            </select>
          </div>
          {showQRCode && (
            <div>
              <p className="text-center text-sm text-gray-700 mb-2">
                Here is the QR Code:
              </p>
              <img
                src="/qrcode.png"
                alt="QR Code"
                className="w-40 h-40 mx-auto mb-4"
              />
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                Transaction ID
              </label>
              <input
                id="transactionId"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? "Registering..." : "Submit"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;