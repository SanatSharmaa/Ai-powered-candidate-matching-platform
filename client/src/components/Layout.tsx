import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        DevHire -- Built with React, Express, Prisma, and PostgreSQL
      </footer>
    </div>
  );
}
