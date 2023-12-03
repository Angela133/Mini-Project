"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn") == "true")
      setLoggedIn(true)
    else
      setLoggedIn(false)

  }, [])



  const router = useRouter();
  const handleLogout = () => {
    localStorage?.removeItem("loggedIn");
    setLoggedIn(false)
    router.replace("/login")

  }

  return (<>
    <nav className='flex items-center flex-wrap bg-teal-500 p-3 '>
      <Link href='/'>
        <span className='text-3xl text-white font-bold uppercase tracking-wide '>
          Wall of Fame
        </span>
      </Link>
      <div className='hidden w-full lg:inline-flex lg:flex-grow lg:w-auto'>
        <div className='lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto'>
          <Link href='/'>
            <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white '>
              Home
            </span>
          </Link>
          <Link href='/manage'>
            <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white '>
              Manage
            </span>
          </Link>

          {
            loggedIn ?
              <button className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white ' onClick={handleLogout}>
                Logout
              </button>
              :
              <Link href='/login'>
                <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white ' onClick={handleLogout}>
                  Login
                </span>
              </Link>
          }

          {/*
            <Link href='/'>
              <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white'>
                Services
              </span>
            </Link>
            <Link href='/'>
              <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white'>
                About us
              </span>
            </Link>
            <Link href='/'>
              <span className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-teal-800 hover:text-white'>
                Contact us
              </span>
            </Link>
            */
          }
        </div>
      </div>
    </nav>
  </>)

}