'use client';
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'


function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    return (
        <nav className='p-3 md:p-4 shadow-md  bg-zinc-900 text-white'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:mb-0' href="#"> Mystery Message</a>
                {
                    session ? (
                        <>
                            <span className='mr-4 text-xl'>Welcome, {user?.username || user?.email}</span>
                            <Button className='w-full md:w-auto text-xl' onClick={() => signOut()}>LogOut</Button>
                        </>
                    ) : (
                        <Link href='signin'>
                            <Button className='w-full md:w-auto text-xl'>Login</Button>
                        </Link>

                    )
                }
            </div>
        </nav>
    )
}

export default Navbar