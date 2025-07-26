interface Submission {
  _id: string;
  name: string;
  address: string;
  phone: string;
  transactionId: string;
  gender: string;
  category: string;
  imageUrl: string;
  paymentVerified: boolean;
  selected: boolean;
  createdAt: string;
  paymentAmount: number;
}

interface Stats {
  total: number;
  verified: number;
  pending: number;
}
