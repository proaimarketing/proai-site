"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Logo from "@/assists/logo.png";
import Image from "next/image";
import Cookies from "js-cookie";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

function Header() {
  // define all state here
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // set token in state
  useEffect(() => {
    setToken(Cookies.get("token") || null);
  }, []);
  const { status } = useSession();

  // hanlde logout function
  const handleLogout = async () => {
    if (token) {
      Cookies.remove("token");
      Cookies.remove("email");
      setToken(null);
    }
    if (status === "authenticated") {
      await signOut({ redirect: false });
      Cookies.remove("email");
    }
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container flex justify-between items-center h-24">
        <Link href="/">
          <Image src={Logo} alt="logo" width={80} className="rounded-md" />
        </Link>
        {token || status === "authenticated" ? (
          <div className="flex gap-5 items-center">
            <Link
              href={"/pricing"}
              className="flex gap-3 items-center text-black text-base font-medium cursor-pointer"
            >
              Pricing
            </Link>
            <Link
              href={"/dashboard"}
              className="flex gap-3 items-center text-black text-base font-medium cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              href={"/membership"}
              className="flex gap-3 items-center text-black text-base font-medium cursor-pointer"
            >
              Membership
            </Link>
            <button
              onClick={handleLogout}
              className="flex gap-3 items-center text-black text-base font-medium cursor-pointer"
            >
              <span>Logout</span>
              <MdLogout size={20} />
            </button>
          </div>
        ) : (
          <Link
            href={"/register"}
            className="flex gap-3 items-center text-black text-xl font-medium cursor-pointer hover:underline"
          >
            Register
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
