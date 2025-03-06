"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loader from "@/components/Loader";
import Header from "@/components/Header";

// Define types for response data
interface MembershipData {
  user: {
    membership: string;
  };
}

// define type gort membership
interface MembershipDetails {
  planId: string;
  status: string;
  planName: string;
  amount: string;
  currency: string;
}

function Membership() {
  // all states define here
  const [id, setId] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState<MembershipData | null>(null);

  // fetch user data
  useEffect(() => {
    setFetched(true);
    setId(Cookies.get("email") || "");
    const getData = async () => {
      const res = await fetch(`/api/user/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      setData(result);
      setFetched(false);
    };
    if (id) {
      getData();
    }
  }, [id]);

  // Check if data and user exist, then parse membership details
  const membership = data?.user?.membership;
  const member: MembershipDetails = membership
    ? JSON.parse(membership)
    : { planId: "", status: "", planName: "", amount: "", currency: "" };
  const { planId, status, planName, amount, currency } = member;

  // decide what to render
  let content;
  if (!fetched && !membership) {
    content = (
      <p className="text-black text-xl font-bold">
        You did not have any membership
      </p>
    );
  }
  if (fetched) {
    content = <Loader />;
  }
  if (!fetched && membership) {
    content = (
      <div className="w-96">
        <table className="min-w-full table-auto border-collapse">
          <tbody>
            <tr className="even:bg-gray-200">
              <td className="border border-gray-300 text-left px-4 py-2">
                Status
              </td>
              <td className="border border-gray-300 text-left px-4 py-2">
                {status}
              </td>
            </tr>
            <tr className="even:bg-gray-200">
              <td className="border border-gray-300 text-left px-4 py-2">
                Plan Id
              </td>
              <td className="border border-gray-300 text-left px-4 py-2">
                {planId}
              </td>
            </tr>
            <tr className="even:bg-gray-200">
              <td className="border border-gray-300 text-left px-4 py-2">
                Plan Name
              </td>
              <td className="border border-gray-300 text-left px-4 py-2">
                {planName}
              </td>
            </tr>
            <tr className="even:bg-gray-200">
              <td className="border border-gray-300 text-left px-4 py-2">
                Price
              </td>
              <td className="border border-gray-300 text-left px-4 py-2">
                {amount}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 text-left px-4 py-2">
                Currency
              </td>
              <td className="border border-gray-300 text-left px-4 py-2">
                {currency}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full h-screen flex flex-col gap-3 justify-center items-center">
        <p className="text-green-500 font-bold text-4xl border border-green-500 py-3 px-10 rounded-xl">
          Your Membership Details
        </p>
        {content}
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
