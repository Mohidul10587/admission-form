"use client";
import { useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { SendHorizonal, User2, MessageSquareText } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { settings } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedMessage = encodeURIComponent(
      `👋 হ্যালো,\n\nআমি ${name} বলছি।\n\nবার্তা:\n${message}`
    );
    const whatsappNumber = settings.whatsapp || "8801704710587";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          ✉️ যোগাযোগ করুন
        </h1>
        <p className="text-center text-gray-600 mb-8">
          আপনার প্রশ্ন বা মন্তব্য থাকলে নিচের ফর্মটি পূরণ করুন। হোয়াটসঅ্যাপে
          মেসেজ পাঠানো হবে।
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User2 className="absolute left-3 top-3 text-blue-500" />
            <input
              type="text"
              placeholder="আপনার নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 w-full border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <MessageSquareText className="absolute left-3 top-3 text-blue-500" />
            <textarea
              placeholder="আপনার বার্তা লিখুন"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pl-10 pt-3 w-full border border-blue-200 p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2"
          >
            <SendHorizonal size={18} /> হোয়াটসঅ্যাপে পাঠান
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p className="space-x-3">
            📞 ফোন:{" "}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              {settings.whatsapp}
            </span>
          </p>
          <p>
            📧 ইমেইল:{" "}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              {settings.email}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
