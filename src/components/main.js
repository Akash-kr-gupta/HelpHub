// src/components/Main.js
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Main({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}