"use client";
import type React from "react";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    transactionId: "",
    gender: "",
    category: "",
    paymentAmount: 0,
    paymentVerified: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isPending, startTransition] = useTransition();
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

    const {
      name,
      address,
      phone,
      transactionId,
      gender,
      category,
      paymentAmount,
    } = formData;

    // Client-side validation
    if (
      !name.trim() ||
      !address.trim() ||
      !phone.trim() ||
      !transactionId.trim() ||
      !gender ||
      !category ||
      !paymentAmount ||
      !imageFile
    ) {
      toast({
        title: "ফর্মটি পূর্ণ নয়",
        description: "অনুগ্রহ করে সবগুলো প্রয়োজনীয় ঘর পূরণ করুন।",
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
            paymentAmount: Number(formData.paymentAmount),
          }),
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        toast({
          title: "সফল!",
          description: "আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে",
        });

        // Reset form
        // setFormData({
        //   name: "",
        //   address: "",
        //   phone: "",
        //   transactionId: "",
        //   gender: "",
        //   category: "",
        //   paymentAmount: 0,
        //   paymentVerified: false,
        // });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ছবি */}
              <div>
                <label htmlFor="image" className="block font-medium mb-2">
                  ছবি আপলোড *
                </label>
                <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-60 w-60 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="text-sm border px-3 py-1 rounded hover:bg-blue-600 bg-blue-500 text-white transition-colors duration-200"
                      >
                        ছবি পরিবর্তন করুন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-gray-400">📷</div>
                      <label
                        htmlFor="image"
                        className="cursor-pointer font-medium text-blue-600"
                      >
                        ছবি নির্বাচন করুন
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG বা GIF (সর্বোচ্চ 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* নাম */}

              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  নাম *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  required
                  className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* ঠিকানা */}
              <div>
                <label htmlFor="address" className="block font-medium mb-1">
                  ঠিকানা *
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                  required
                  className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* ফোন */}
              <div>
                <label htmlFor="phone" className="block font-medium mb-1">
                  ফোন নম্বর *
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="০১xxxxxxxxx"
                  required
                  className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* পেমেন্ট পরিমাণ */}
              <div>
                <label
                  htmlFor="paymentAmount"
                  className="block font-medium mb-1"
                >
                  পেমেন্ট পরিমাণ *
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={(e) =>
                    handleInputChange("paymentAmount", e.target.value)
                  }
                  placeholder="পেমেন্টের পরিমাণ (টাকা)"
                  required
                  min={1}
                  className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* ট্রানজেকশন আইডি */}
              <div>
                <label
                  htmlFor="transactionId"
                  className="block font-medium mb-1"
                >
                  ট্রানজেকশন আইডি *
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) =>
                    handleInputChange("transactionId", e.target.value)
                  }
                  placeholder="পেমেন্টের ট্রানজেকশন আইডি"
                  required
                  className="w-full border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* লিঙ্গ */}
              <div>
                <label className="block font-medium mb-2">লিঙ্গ *</label>
                <div className="flex space-x-6">
                  {["পুরুষ", "মহিলা", "অন্যান্য"].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.gender === option}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        required
                        className="text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* বিভাগ */}
              <div>
                <label htmlFor="category" className="block font-medium mb-1">
                  বিভাগ *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  required
                  className="w-full border border-gray-400 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">একটি বিভাগ নির্বাচন করুন</option>
                  <option value="গান">গান</option>
                  <option value="নৃত্য">নৃত্য</option>
                  <option value="অভিনয়">অভিনয়</option>
                </select>
              </div>

              {/* সাবমিট বাটন */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded"
                disabled={isPending}
              >
                {isPending ? "জমা দেওয়া হচ্ছে..." : "আবেদন জমা দিন"}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-xl p-6">
          <h1>আবেদন জমা দেওয়ার নির্দেশিকা</h1>
          <ul className="list-disc pl-6">
            <li>আপনার তথ্য সঠিকভাবে পূরণ করুন।</li>
            <li>আপলোড করা ছবি অবশ্যই JPG, PNG বা GIF ফরম্যাটে হতে হবে।</li>
            <li>পেমেন্টের পরিমাণ সঠিকভাবে উল্লেখ করুন।</li>
            <li>ট্রানজেকশন আইডি সঠিকভাবে প্রদান করুন।</li>
            <li>
              আপনার আবেদন জমা দেওয়ার পর, আপনি একটি নিশ্চিতকরণ ইমেইল পাবেন।
            </li>
            <li>
              আপনার আবেদন পর্যালোচনা করা হবে এবং প্রয়োজনীয় তথ্যের জন্য যোগাযোগ
              করা হতে পারে।
            </li>
            <li>
              আপনার আবেদন সফল হলে, আপনাকে পরবর্তী ধাপের জন্য নির্দেশনা দেওয়া
              হবে।
            </li>
            <li>
              আপনার তথ্য গোপনীয়তা রক্ষা করা হবে এবং শুধুমাত্র এই আবেদন
              প্রক্রিয়ার জন্য ব্যবহৃত হবে।
            </li>
            <li>
              আপনার আবেদন জমা দেওয়ার পর, আপনি আর তথ্য পরিবর্তন করতে পারবেন না।
            </li>
            <li>আপনার আবেদন জমা দেওয়ার পর, আপনি আবেদন ফি ফেরত পাবেন না।</li>
          </ul>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
