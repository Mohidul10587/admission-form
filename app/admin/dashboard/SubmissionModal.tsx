"use client";
import { X } from "lucide-react";
import Image from "next/image";

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

        {/* Scrollable Content */}
        <div className="px-6 pt-4 pb-10 overflow-y-auto max-h-[calc(90vh-64px)] text-sm space-y-4">
          {/* Image */}
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

          {/* Info Sections */}
          <div className="space-y-4">
            <div className="md:flex  md:flex-row md:space-x-4  md:text-left">
              <p className="md:flex-1">
                <strong>নাম:</strong> {submission.name}
              </p>
              <p className="md:flex-1">
                <strong>ঠিকানা:</strong> {submission.address}
              </p>
            </div>

            <div className="md:flex  md:flex-row md:space-x-4  md:text-left">
              <p className="md:flex-1">
                <strong>ফোন:</strong> {submission.phone}
              </p>
              <p className="md:flex-1">
                <strong>বিভাগ:</strong> {submission.category}
              </p>
            </div>

            <div className="md:flex  md:flex-row md:space-x-4  md:text-left">
              <p className="md:flex-1">
                <strong>পেমেন্ট:</strong> {submission.paymentAmount} টাকা
              </p>
              <p className="md:flex-1">
                <strong>ট্রানজেকশন আইডি:</strong> {submission.transactionId}
              </p>
            </div>
            <div className="md:flex  md:flex-row md:space-x-4  md:text-left">
              <p className="md:flex-1">
                <strong>লিঙ্গ:</strong> {submission.gender}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
