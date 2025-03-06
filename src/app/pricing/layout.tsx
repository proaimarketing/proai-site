import Header from "@/components/Header";
import React from "react";

function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default PricingLayout;
