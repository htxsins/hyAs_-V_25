'use client'

import { Home, Book, Menu, Target } from 'lucide-react'
import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import logo from "@/public/logo.png"
import { useTheme } from "next-themes";

interface NavbarLinksProps {
  userType: string
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ userType }) => {
  const { theme } = useTheme();
  const pathname = usePathname()

  const getLinkClasses = (path: string) => {
    return cn(
      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out",
      pathname === path
        ? "text-white bg-[#a79f54] shadow-md" // Olive-inspired greenish-brownish-yellowish color
        : "text-gray-700 hover:text-white hover:bg-[#d4c98f]" // Lighter version of the color for hover
    );
  };
  

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          <div>
            <Image
              src={theme === "dark" ? logo : logo}
              alt="logo"
              width={50}
              height={50}
              className="rounded-md"
            />
          </div>
          <span className="font-montserrat font-extrabold text-3xl text-primary">
            DU Hacks 25
          </span>
        </div>
  
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <nav className="text-sm font-medium flex items-center space-x-6">
            
            {userType === "user1" && (
              <Link href="/landing" className={getLinkClasses("/landing")} target='_blank'>
                <Book className="h-5 w-5" />
                <span className="hover:text-accent transition">Home</span>
              </Link>
            )}

          </nav>
        </div>
      </div>
  
      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
  
        {/* Mobile Menu */}
        <SheetContent side="left">
          <div className="flex flex-col space-y-4 mt-6 px-4">
            <nav className="text-sm font-medium space-y-3">
              {userType!=="business" && userType!=="commonPeople" && (
                <Link href="/landing" className={getLinkClasses("/landing")}>
                  <Home className="h-5 w-5" />
                  <span className="hover:text-accent transition">Home</span>
                </Link>
              )}
  
              {userType === "user1" && (
                <Link href="http://127.0.0.1:5000/" className={getLinkClasses("http://127.0.0.1:5000/" )} target="_blank">
                  <Book className="h-5 w-5" />
                  <span className="hover:text-accent transition">Nav 1</span>
                </Link>
              )}

            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
  
}

export default NavbarLinks

