"use client";
import type React from "react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useSettings } from "./hooks/useSettings";
import {
  Upload,
  Copy,
  Check,
  User,
  Phone,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Submission {
  name: string;
  imageUrl: string;
  phone: string;
  transactionId: string;
  gender: string;
  category: string;
  paymentVerified: boolean;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  presentAddress: string;
  village: string;
  upazila: string;
  district: string;
  division: string;
  createdAt: string;
}

export default function HomePage() {
  const [formData, setFormData] = useState<Submission>({
    name: "",
    imageUrl: "",
    phone: "",
    transactionId: "",
    gender: "",
    category: "",
    paymentVerified: false,
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    presentAddress: "",
    village: "",
    upazila: "",
    district: "",
    division: "",
    createdAt: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const { settings } = useSettings();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (number: string, index: number) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const numbers = settings?.sendMonyNumbers || [];
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Image upload failed");
    }
    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast({
        title: "ফর্মটি পূর্ণ নয়",
        description: "Please select a image",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const imageUrl = await uploadImage(imageFile);
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            imageUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        toast({
          title: "সফল!",
          description: "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে",
        });

        setFormData({
          name: "",
          imageUrl: "",
          phone: "",
          transactionId: "",
          gender: "",
          category: "",
          paymentVerified: false,
          fatherName: "",
          motherName: "",
          dateOfBirth: "",
          presentAddress: "",
          village: "",
          upazila: "",
          district: "",
          division: "",
          createdAt: "",
        });
        setImageFile(null);
        setImagePreview("");
      } catch (error) {
        toast({
          title: "ত্রুটি",
          description: "আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-x-3">
                  <FileText className="w-6 h-6" />
                  নিবন্ধন ফর্ম
                </h2>
              </div>
              <div className="mt-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <Link href={"/contact"}>
                  <p className="text-sm text-blue-800 font-medium">
                    💡 যে কোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে এখানে ক্লিক
                    করুন।
                  </p>
                </Link>
              </div>

              <div className="px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Image Upload Section */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <label className=" text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      ছবি আপলোড *
                    </label>

                    {imagePreview ? (
                      <div className="text-center space-y-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-40 h-40 object-cover rounded-xl border-4 border-white shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md"
                        >
                          ছবি পরিবর্তন করুন
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                        <div className="space-y-4">
                          <label
                            htmlFor="image"
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold text-lg"
                          >
                            <div>
                              {" "}
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <Upload className="w-8 h-8 text-blue-600" />
                              </div>
                              ছবি নির্বাচন করুন
                              <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                required
                              />
                              <p className="text-gray-500 mt-2">
                                JPG, PNG বা GIF (সর্বোচ্চ 5MB)
                              </p>
                            </div>{" "}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      ব্যক্তিগত তথ্য
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          নাম *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="আপনার পূর্ণ নাম লিখুন"
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          ফোন নম্বর *
                        </label>
                        <input
                          type="text"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="০১xxxxxxxxx"
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="fatherName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          পিতার নাম *
                        </label>
                        <input
                          type="text"
                          id="fatherName"
                          value={formData.fatherName}
                          onChange={(e) =>
                            handleInputChange("fatherName", e.target.value)
                          }
                          placeholder="পিতার নাম লিখুন"
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="motherName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          মাতার নাম *
                        </label>
                        <input
                          type="text"
                          id="motherName"
                          value={formData.motherName}
                          onChange={(e) =>
                            handleInputChange("motherName", e.target.value)
                          }
                          placeholder="মাতার নাম লিখুন"
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="dateOfBirth"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          জন্ম তারিখ *
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={(e) =>
                            handleInputChange("dateOfBirth", e.target.value)
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          বিভাগ *
                        </label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">একটি বিভাগ নির্বাচন করুন</option>
                          <option value="শিশু বিভাগ">শিশু বিভাগ</option>
                          <option value="কিশোর বিভাগ">কিশোর বিভাগ</option>
                          <option value="সিনিয়র বিভাগ">সিনিয়র বিভাগ</option>
                          <option value="কিরাত বিভাগ">কিরাত বিভাগ</option>
                        </select>
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        লিঙ্গ *
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {["পুরুষ", "মহিলা", "অন্যান্য"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={formData.gender === option}
                              onChange={(e) =>
                                handleInputChange("gender", e.target.value)
                              }
                              required
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 font-medium">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      ঠিকানা
                    </h3>

                    <div>
                      <label
                        htmlFor="presentAddress"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        বর্তমান ঠিকানা *
                      </label>
                      <textarea
                        id="presentAddress"
                        value={formData.presentAddress}
                        onChange={(e) =>
                          handleInputChange("presentAddress", e.target.value)
                        }
                        placeholder="বর্তমান ঠিকানা লিখুন"
                        required
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-4">
                        স্থায়ী ঠিকানা
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="village"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            গ্রাম *
                          </label>
                          <input
                            type="text"
                            id="village"
                            value={formData.village}
                            onChange={(e) =>
                              handleInputChange("village", e.target.value)
                            }
                            placeholder="গ্রামের নাম লিখুন"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="upazila"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            উপজেলা *
                          </label>
                          <input
                            type="text"
                            id="upazila"
                            value={formData.upazila}
                            onChange={(e) =>
                              handleInputChange("upazila", e.target.value)
                            }
                            placeholder="উপজেলার নাম লিখুন"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="district"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            জেলা *
                          </label>
                          <input
                            type="text"
                            id="district"
                            value={formData.district}
                            onChange={(e) =>
                              handleInputChange("district", e.target.value)
                            }
                            placeholder="জেলার নাম লিখুন"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="division"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            বিভাগ *
                          </label>
                          <input
                            type="text"
                            id="division"
                            value={formData.division}
                            onChange={(e) =>
                              handleInputChange("division", e.target.value)
                            }
                            placeholder="বিভাগের নাম লিখুন"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      পেমেন্ট তথ্য
                    </h3>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-2 border border-green-200">
                      <p className=" text-gray-800 mb-4">
                        নিচে দেওয়া নাম্বারে {settings?.paymentAmount || "০"}{" "}
                        টাকা সেন্ড মানি করুন এবং আপনি যে নাম্বার থেকে টাকা
                        পাঠিয়েছেন সেই নাম্বারটি নিচে লিখে সাবমিট করুন....
                      </p>

                      <div className="space-y-3">
                        {numbers.map((num, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white rounded-lg p-2 border border-green-200 shadow-sm"
                          >
                            <span className="font-mono  text-gray-800">
                              {num}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(num, idx)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                copiedIndex === idx
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  কপি
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="transactionId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        যে নাম্বার থেকে টাকা পাঠিয়েছেন সেই নাম্বারটি লিখুন*
                      </label>
                      <input
                        type="text"
                        id="transactionId"
                        value={formData.transactionId}
                        onChange={(e) =>
                          handleInputChange("transactionId", e.target.value)
                        }
                        placeholder="যে নাম্বার থেকে টাকা
                        পাঠিয়েছেন সেই নাম্বারটি"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          জমা দেওয়া হচ্ছে...
                        </div>
                      ) : (
                        "আবেদন জমা দিন"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-20">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 rounded-t-2xl">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 6-6" />
                  নির্দেশিকা
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4 text-sm text-gray-700">
                  {settings.rulesAndCommands?.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>{item} ।</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Link href={"/contact"}>
                    <p className="text-sm text-blue-800 font-medium">
                      💡 যে কোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে এখানে ক্লিক
                      করুন।
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
