'use client';

import Link from 'next/link';
//import { User, UserCheck, LogOut } from 'lucide-react';
//import { useUser } from "@/context/UserContext";

export default function Header() {
  //const { user, logout } = useUser();

  return (
    <header className="w-full px-6 py-2 bg-blue-600 shadow-md flex items-center justify-between">
      <div className='flex items-center space-x-6'>
        <Link href="/" className="text-xl font-bold text-white">
          Recipy.io
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-white hover:text-blue-600 hover:bg-white transition p-2 rounded">
          Home
        </Link>
      </div>
    </header>
  );
}
