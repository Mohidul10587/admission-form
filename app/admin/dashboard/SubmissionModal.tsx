"use client";
import { X } from "lucide-react";
import Image from "next/image";

interface Submission {
  name: string;
  phone: string;
  category: string;
  gender: string;
  address: string;
  transactionId: string;
  imageUrl: string;
}

interface SubmissionModalProps {
  submission: Submission;
  onClose: () => void;
}

export default function SubmissionModal({
  submission,
  onClose,
}: SubmissionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">আবেদনের বিস্তারিত</h2>
          <button
            className="text-red-500 hover:text-red-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-6 pt-4 pb-10 overflow-y-auto max-h-[calc(90vh-64px)] text-sm">
          <div className="space-y-3">
            <div>
              <strong>ছবি:</strong>
              <div className="flex items-center md:justify-center">
                <Image
                  width={200}
                  height={300}
                  loading="lazy"
                  src={submission.imageUrl}
                  alt="submission"
                  className="mt-2 rounded border"
                />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="md:flex  md:space-x-4">
                <p className="flex-1 md:text-center">
                  <strong>নাম:</strong> {submission.name}
                </p>
                <p className="flex-1 md:text-center">
                  <strong>ফোন:</strong> {submission.phone}
                </p>
              </div>

              <div className="md:flex  md:space-x-4">
                <p className="flex-1 md:text-center">
                  <strong>বিভাগ:</strong> {submission.category}
                </p>
                <p className="flex-1 md:text-center">
                  <strong>লিঙ্গ:</strong> {submission.gender}
                </p>
              </div>

              <div className="md:flex  md:space-x-4">
                <p className="flex-1 md:text-center">
                  <strong>ঠিকানা:</strong> {submission.address}
                </p>
                <p className="flex-1 md:text-center">
                  <strong>ট্রানজেকশন আইডি:</strong> {submission.transactionId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
