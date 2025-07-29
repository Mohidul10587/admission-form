"use client";

import useSWR from "swr";
import { X } from "lucide-react";
import Image from "next/image";

interface SubmissionModalProps {
  submissionId: string;
  onClose: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubmissionModal({
  submissionId,
  onClose,
}: SubmissionModalProps) {
  const {
    data: submission,
    isLoading,
    error,
  } = useSWR<Submission>(`/api/submissions/${submissionId}`, fetcher);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
          লোড হচ্ছে...
        </div>
      </div>
    );
  }

  if (error || !submission) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">আবেদনের বিস্তারিত</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-10 overflow-y-auto max-h-[calc(90vh-64px)] text-sm space-y-4">
          <div>
            <strong>ছবি:</strong>
            <div className="flex justify-center mt-2">
              <Image
                width={200}
                height={300}
                loading="lazy"
                src={submission.imageUrl}
                alt="submission"
                className="rounded border"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p>
              <strong>নাম:</strong> {submission.name}
            </p>
            <p>
              <strong>পিতার নাম:</strong> {submission.fatherName}
            </p>
            <p>
              <strong>মাতার নাম:</strong> {submission.motherName}
            </p>
            <p>
              <strong>জন্ম তারিখ:</strong> {submission.dateOfBirth}
            </p>
            <p>
              <strong>ফোন:</strong> {submission.phone}
            </p>
            <p>
              <strong>বিভাগ:</strong> {submission.category}
            </p>
            <p>
              <strong>লিঙ্গ:</strong> {submission.gender}
            </p>
            <p>
              <strong>সেন্ড মানি নাম্বার:</strong> {submission.transactionId}
            </p>
            <p>
              <strong>বর্তমান ঠিকানা:</strong> {submission.presentAddress}
            </p>
            <p>
              <strong>গ্রাম:</strong> {submission.village}
            </p>
            <p>
              <strong>উপজেলা:</strong> {submission.upazila}
            </p>
            <p>
              <strong>জেলা:</strong> {submission.district}
            </p>
            <p>
              <strong>বিভাগ:</strong> {submission.division}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
