import { ReactNode } from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: AdminLayoutProps) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("admin-token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      role: string;
    };

    if (decoded.role !== "admin") {
      redirect("/login");
    }
  } catch (error) {
    redirect("/login");
  }

  return <>{children}</>;
}
