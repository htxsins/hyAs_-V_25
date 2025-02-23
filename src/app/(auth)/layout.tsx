"use client"

import React from "react";
import NavbarWithoutLogin from "@/components/Navbar-Without-Login";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavbarWithoutLogin />
      {children}
    </div>
  );
}
