"use client";

import Link from "next/link";
import Logo from "@/assists/logo.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  // define all states
  const [token, setToken] = useState<string | null>(null);
  const { status } = useSession();

  // set token on state
  useEffect(() => {
    setToken(Cookies.get("token") || null);
  }, []);

  return (
    <section
      className="w-full min-h-screen flex flex-col justify-center items-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="w-11/12 md:w-[700px] bg-[rgba(0,10,30,0.8)] border border-[rgba(0,170,255,0.5)] shadow-lg shadow-[rgba(0,170,255,0.4)] backdrop-blur-md p-10 flex flex-col gap-5 justify-center items-center rounded-xl my-10">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={100} />
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] tracking-wider text-center">
          Welcome to Pro AI Marketing
        </h1>

        <p className="text-lg text-[#d0eaff] font-medium text-center leading-8">
          Automate your marketing with AI-powered content generation,
          scheduling, and optimization.
        </p>
        <div className="flex flex-col gap-5 w-full">
          <Link
            href="/pricing"
            className="px-6 py-2 text-white text-lg font-bold rounded-md shadow-[0_0_10px_rgba(42,181,254,0.5)] border border-[rgba(42,181,254,0.8)] transition ease-in-out duration-300 bg-gradient-to-r from-[#2ab5fe] to-[#1a94d6] hover:opacity-90 text-center hover:bg-[#1380BA]"
          >
            Get Lifetime Access
          </Link>
          {!token && status === "unauthenticated" ? (
            <Link
              href="/login"
              className="px-6 py-2 text-[#003366] text-lg font-bold rounded-md border border-[rgba(42,181,254,0.8)] transition ease-in-out duration-300 bg-gradient-to-r from-[#d0d8e5] to-[#aabbcc] shadow-[0_0_10px_rgba(0,170,255,0.5)] p-4 text-center hover:bg-[#1380BA]"
            >
              Login
            </Link>
          ) : null}
        </div>
        <p className="text-[rgba(200,255,255,0.8)] text-sm text-center">
          © 2025 Pro AI Marketing. All rights reserved.
        </p>
      </div>
    </section>
  );
}
