export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700 font-medium">লোড হচ্ছে...</p>
        <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে অপেক্ষা করুন</p>
      </div>
    </div>
  )
}
