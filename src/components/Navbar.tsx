'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user as User;

  return (
    <nav className="fixed top-0 left-0 w-full p-6 max-h-fit  shadow-lg bg-transparent bg-opacity-70 backdrop-blur-md text-white z-50">
      <div className="flex justify-between items-center h-2 py-2">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0 text-blue-700 mr-1">
          urFeedback
        </a>
        {session ? (
          <>
<span className="font-bold text-blue-500 truncate max-w-xs md:max-w-full">
  Welcome, {user.name || user.username || user.email}
</span>
            <Button onClick={() => signOut()} className="w-fit md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-up">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Join Now</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
