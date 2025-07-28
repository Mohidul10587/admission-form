"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Plus,
  Trash2,
  Save,
  Phone,
  Mail,
  Palette,
  DollarSign,
  FileText,
  SettingsIcon,
  ImageIcon,
  LayoutDashboard,
} from "lucide-react";
import { defaultSettings } from "@/app/shared/defaultData";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        headers: {
          Authorization: `Bearer ${getCookie("admin-token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setLogoPreview(data.logoUrl);
      }
    } catch (error) {
      alert("সেটিংস লোড করতে সমস্যা হয়েছে");
    } finally {
      setIsLoading(false);
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return "";
  };

  // নতুন নম্বর যোগ করার ফাংশন
  const addNumber = () => {
    setSettings({
      ...settings,
      sendMonyNumbers: [...settings.sendMonyNumbers, ""],
    });
  };

  // নম্বর আপডেট করার ফাংশন
  const updateNumber = (index: number, value: string) => {
    const updatedNumbers = [...settings.sendMonyNumbers];
    updatedNumbers[index] = value;
    setSettings({
      ...settings,
      sendMonyNumbers: updatedNumbers,
    });
  };

  // নম্বর ডিলিট করার ফাংশন
  const removeNumber = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      sendMonyNumbers: prev.sendMonyNumbers.filter((_, i) => i !== index),
    }));
  };

  // নতুন নিয়ম যোগ করার ফাংশন
  const addRule = () => {
    setSettings({
      ...settings,
      rulesAndCommands: [...settings.rulesAndCommands, ""],
    });
  };

  // নিয়ম আপডেট করার ফাংশন
  const updateRule = (index: number, value: string) => {
    const updatedRules = [...settings.rulesAndCommands];
    updatedRules[index] = value;
    setSettings({
      ...settings,
      rulesAndCommands: updatedRules,
    });
  };

  // নিয়ম ডিলিট করার ফাংশন
  const removeRule = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      rulesAndCommands: prev.rulesAndCommands.filter((_, i) => i !== index),
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Logo upload failed");
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let logoUrl = settings.logoUrl;
      if (logoFile) logoUrl = await uploadLogo(logoFile);

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("admin-token")}`,
        },
        body: JSON.stringify({ ...settings, logoUrl: logoUrl }),
      });

      if (response.ok) {
        document.documentElement.style.setProperty(
          "--primary-color",
          settings.primaryColor
        );
        alert("সেটিংস সংরক্ষিত হয়েছে");
      }
    } catch (error) {
      alert("সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto  py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                অ্যাডমিন সেটিংস
              </h1>
            </div>

            <Link href="/admin">
              <button className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                ড্যাশবোর্ডে
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <ImageIcon className="w-6 h-6" />
                সাইট লোগো
              </h2>
            </div>
            <div className="p-6">
              {logoPreview ? (
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="h-24 w-auto mx-auto border-2 border-gray-200 rounded-lg shadow-md"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview("");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    লোগো পরিবর্তন করুন
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label
                    htmlFor="logo"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold text-lg"
                  >
                    লোগো নির্বাচন করুন
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <p className="text-gray-500 mt-2">
                    PNG, JPG বা SVG (সর্বোচ্চ 2MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  হোয়াটসঅ্যাপ নম্বর
                </h3>
              </div>
              <div className="p-6">
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="+8801XXXXXXXXX"
                />
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  ইমেইল
                </h3>
              </div>
              <div className="p-6">
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>
          </div>

          {/* Theme and Payment */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Color Picker */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  প্রাইমারি রঙ
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      setSettings({ ...settings, primaryColor: e.target.value })
                    }
                    className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 font-mono"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  পেমেন্ট পরিমাণ
                </h3>
              </div>
              <div className="p-6">
                <input
                  type="number"
                  value={settings.paymentAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentAmount: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="১০০"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-2">
                  টাকায় পরিমাণ লিখুন
                </p>
              </div>
            </div>
          </div>

          {/* Send Money Numbers */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Phone className="w-6 h-6" />
                অর্থ পাঠানোর নম্বরসমূহ
              </h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">মোবাইল ব্যাংকিং নম্বর যোগ করুন</p>
                <button
                  type="button"
                  onClick={addNumber}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  নম্বর যোগ করুন
                </button>
              </div>

              <div className="space-y-4">
                {settings.sendMonyNumbers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Phone className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>কোনো নম্বর যোগ করা হয়নি।</p>
                  </div>
                )}

                {settings.sendMonyNumbers.map((num: string, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={num}
                        onChange={(e) => updateNumber(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNumber(index)}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rules and Commands */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6" />
                নিয়মাবলী ও নির্দেশনা
              </h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">আবেদনের নিয়মাবলী যোগ করুন</p>
                <button
                  type="button"
                  onClick={addRule}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  নিয়ম যোগ করুন
                </button>
              </div>

              <div className="space-y-4">
                {settings.rulesAndCommands?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>কোনো নিয়ম যোগ করা হয়নি।</p>
                  </div>
                )}

                {settings.rulesAndCommands?.map((rule, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <textarea
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="নিয়ম বা নির্দেশনা লিখুন..."
                        rows={3}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors duration-200 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  সেটিংস সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
