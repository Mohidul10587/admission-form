interface Submission {
  _id?: string;
  name: string;
  phone: string;
  transactionId: string;
  gender: string;
  category: string;
  imageUrl: string;
  paymentVerified: boolean;
  createdAt: string;

  // নতুন যুক্ত করা প্রপার্টিগুলো
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  presentAddress: string;
  village: string;
  upazila: string;
  district: string;
  division: string;
}

interface Stats {
  total: number;
  verified: number;
  pending: number;
}
interface Settings {
  logoUrl: string;
  primaryColor: string;
  whatsapp: string;
  paymentAmount: number;
  sendMonyNumbers: string[];
  rulesAndCommands: string[];

  email: string;
}
