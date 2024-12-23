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
  const [transactionId, setTransactionId] = useState("");
  const [members, setMembers] = useState("");
  const [promotions, setPromotions] = useState(true); // Opt-in state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { data: emailCheck } = await supabase
        .from("registrations")
        .select("email")
        .eq("email", email);

      if (emailCheck && emailCheck.length > 0) {
        setMessage("Error: Email already exists. Please use a different email.");
        setIsLoading(false);
        return;
      }

      const { data: phoneCheck } = await supabase
        .from("registrations")
        .select("phone_number")
        .eq("phone_number", phoneNumber);

      if (phoneCheck && phoneCheck.length > 0) {
        setMessage(
          "Error: Phone number already exists. Please use a different phone number."
        );
        setIsLoading(false);
        return;
      }

      if (!members.trim()) {
        setMessage("Please enter the number of members.");
        setIsLoading(false);
        return;
      }

      if (gender === "female") {
        const { error } = await supabase.from("registrations").insert([
          {
            name,
            email,
            phone_number: phoneNumber,
            gender,
            members,
            promotions,
          },
        ]);

        if (error) throw error;

        setIsRegistrationComplete(true);
        setMessage("");
      } else {
        setShowQRCode(true);
        if (transactionId.trim() === "") {
          setMessage("Please enter a transaction ID.");
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.from("registrations").insert([
          {
            name,
            email,
            phone_number: phoneNumber,
            gender,
            transaction_id: transactionId,
            members,
            promotions,
          },
        ]);

        if (error) throw error;

        setIsRegistrationComplete(true);
        setMessage("");
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
        {!isRegistrationComplete ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">
              New Year Party at VRB!
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
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
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="members"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Members
                </label>
                <input
                  id="members"
                  type="text"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  required
                  pattern="\d+"
                  title="Please enter a valid number."
                  className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="promotions"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700"
                >
                  <input
                    id="promotions"
                    type="checkbox"
                    checked={promotions}
                    onChange={(e) => setPromotions(e.target.checked)}
                    className="h-4 w-4 rounded border-black focus:ring-blue-500"
                  />
                  <span>Opt-in for future promotions</span>
                </label>
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
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Transaction ID
                  </label>
                  <input
                    id="transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800 mb-4">
              Registration Successful!
            </h1>
            <p className="text-gray-700">
              We will send you a coupon within 12 business working hours to your
              registered email ID after verification by our tech team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
