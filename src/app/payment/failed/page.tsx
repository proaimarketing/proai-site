"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

function Membership() {
  // define all state here
  const [id, setId] = useState<string>("");
  const router = useRouter();

  // fetch user data
  useEffect(() => {
    setId(Cookies.get("email") || "");
    const getData = async () => {
      const res = await fetch(`/api/user/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result?.user?.paymentStatus) {
        router.push("/membership");
      }
    };
    if (id) {
      getData();
    }
  }, [id, router]);

  return (
    <>
      <Header />
      <div className="w-full h-[80vh] flex flex-col gap-3 justify-center items-center">
        <FaCheckCircle color="green" size={50} />
        <p className="text-green-500 font-bold text-4xl">Payment Failed...</p>

        <Link
          className="bg-red-500 py-1 px-4 rounded-md text-white"
          href={"/pricing"}
        >
          back
        </Link>
      </div>
    </>
  );
}

export default Membership;
