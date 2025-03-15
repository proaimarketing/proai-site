import Header from "@/components/Header";
import React from "react";

function dashboard() {
  return (
    <>
      <Header />
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <p className="text-red-500 text-xl text-center">Dashboard</p>
      </div>
    </>
  );
}

export default dashboard;
