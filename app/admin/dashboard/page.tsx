"use client";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useState } from "react";

import {
  Check,
  X,
  Users,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Link from "next/link";

// ✅ Cookie Utility (ensure this function is defined or imported)
import { getCookie } from "cookies-next";
import SubmissionModal from "./SubmissionModal";

// ✅ SWR Fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getCookie("admin-token")}`,
    },
  });

  if (res.status === 401) {
    const error: any = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  const data = await res.json();
  return data;
};

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const verifiedParam = searchParams.get("verified");
  const verifiedQuery = verifiedParam ? `&verified=${verifiedParam}` : "";
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const { data, error, mutate, isLoading } = useSWR(
    `/api/submissions?page=${currentPage}${verifiedQuery}`,
    fetcher
  );

  const submissions: Submission[] = data?.submissions || [];
  const totalAmount: number = data?.finalTotalAmount || 0;
  const stats: Stats = data?.stats || {
    total: 0,
    verified: 0,
    pending: 0,
  };

  // Redirect on 401
  if (error?.status === 401) {
    router.push("/admin/login");
    return null;
  }

  if (error && !isLoading) {
    toast({
      title: "ত্রুটি",
      description: "ডেটা লোড করতে সমস্যা হয়েছে",
      variant: "destructive",
    });
  }

  const logout = () => {
    document.cookie =
      "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };
  const updatePaymentStatus = async (id: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("admin-token")}`,
        },
        body: JSON.stringify({ paymentVerified: verified }),
      });

      if (response.ok) {
        mutate();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              অ্যাডমিন ড্যাশবোর্ড
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/admin/settings">
                <button className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                  <Settings className="w-4 h-4 mr-2" />
                  সেটিংস
                </button>
              </Link>
              <button
                className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Users,
              label: "মোট আবেদন",
              value: stats.total,
              color: "text-blue-600",
              bg: "bg-blue-200",
            },
            {
              icon: CheckCircle,
              label: "পেমেন্ট ভেরিফাইড",
              value: stats.verified,
              color: "text-green-600",
              bg: "bg-green-200",
            },
            {
              icon: Clock,
              label: "পেমেন্ট পেন্ডিং",
              value: stats.pending,
              color: "text-yellow-600",
              bg: "bg-yellow-200",
            },
            {
              icon: Check,
              label: !verifiedParam
                ? "মোট পেমেন্ট"
                : verifiedParam === "true"
                ? "মোট ভেরিফায়েড পেমেন্ট"
                : "মোট নন-ভেরিফায়েড পেমেন্ট",
              value: totalAmount,
              color: "text-purple-600",
              bg: "bg-purple-200",
            },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} shadow rounded-lg p-4 flex items-center`}
            >
              <Icon className={`h-8 w-8 ${color}`} />
              <div className="ml-4">
                <p className="text-sm text-gray-700">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">আবেদনসমূহ</h2>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);

                router.push(
                  `?page=1${
                    e.target.value !== "all"
                      ? `&verified=${e.target.value}`
                      : ""
                  }`
                );
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">সব আবেদন</option>
              <option value="true">ভেরিফাইড</option>
              <option value="false">নট ভেরিফাইড</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full hidden md:table text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-3 py-2 text-left">ছবি</th>
                  <th className="px-3 py-2 text-left">নাম</th>
                  <th className="px-3 py-2 text-left">ফোন</th>

                  <th className="px-3 py-2 text-left">ট্রানজেকশন আইডি</th>
                  <th className="px-3 py-2 text-left">পেমেন্ট</th>
                  <th className="px-3 py-2 text-left">স্ট্যাটাস</th>
                  <th className="px-3 py-2 text-left">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td className="px-3 py-2">
                      <img
                        src={submission.imageUrl || "/placeholder.svg"}
                        alt="profile"
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-3 py-2">{submission.name}</td>
                    <td className="px-3 py-2">{submission.phone}</td>

                    <td className="px-3 py-2">{submission.transactionId}</td>
                    <td className="px-3 py-2">
                      {submission.paymentAmount} টাকা
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          submission.paymentVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {submission.paymentVerified ? "ভেরিফাইড" : "পেন্ডিং"}
                      </span>
                    </td>
                    <td className="px-3 py-2 flex items-center gap-2">
                      <button
                        className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        বিস্তারিত
                      </button>
                      {!submission.paymentVerified ? (
                        <button
                          onClick={() =>
                            updatePaymentStatus(submission._id, true)
                          }
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700  w-20"
                        >
                          ভেরি: করুন
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            updatePaymentStatus(submission._id, false)
                          }
                          className="border border-gray-300 px-2 py-1 rounded bg-red-500 text-white w-20"
                        >
                          রিমুভ ভেরি:
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="bg-white shadow rounded-lg p-4 space-y-2 border"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={submission.imageUrl || "/placeholder.svg"}
                      alt="profile"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold">{submission.name}</h3>
                      <p className="text-sm text-gray-600">
                        {submission.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-medium">ক্যাটাগরি:</span>{" "}
                      {submission.category}
                    </p>
                    <p>
                      <span className="font-medium">লিঙ্গ:</span>{" "}
                      {submission.gender}
                    </p>
                    <p>
                      <span className="font-medium">ট্রানজ্যাকশন আইডি:</span>{" "}
                      {submission.transactionId}
                    </p>
                    <p>
                      <span className="font-medium">পেমেন্ট:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          submission.paymentVerified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {submission.paymentVerified ? "ভেরিফাইড" : "পেন্ডিং"}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      বিস্তারিত
                    </button>

                    {!submission.paymentVerified ? (
                      <button
                        onClick={() =>
                          updatePaymentStatus(submission._id, true)
                        }
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updatePaymentStatus(submission._id, false)
                        }
                        className="border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {stats.total > 10 && (
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      router.push(`?page=${currentPage - 1}`);
                    }
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                >
                  পূর্ববর্তী
                </button>

                <span className="text-sm">
                  পৃষ্ঠা {currentPage} / {Math.ceil(stats.total / 10)}
                </span>

                <button
                  onClick={() => {
                    if (currentPage < Math.ceil(stats.total / 10)) {
                      router.push(`?page=${currentPage + 1}`);
                    }
                  }}
                  disabled={currentPage >= Math.ceil(stats.total / 10)}
                  className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                >
                  পরবর্তী
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {selectedSubmission && (
          <SubmissionModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </main>
    </div>
  );
}
