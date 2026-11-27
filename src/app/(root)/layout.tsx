import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default RootLayout;
