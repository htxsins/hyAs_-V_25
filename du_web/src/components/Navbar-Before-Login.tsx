"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, DollarSign, TrendingUp } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import predictED_logo from "public/predictED_logo.png";

const navItems = [
  { name: "Sign Up / login", icon: GraduationCap, href: "/auth" },

];

export function NabBeforeLogin() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <Image
                  src={predictED_logo}
                  alt="PredictED Logo"
                  width={40}
                  height={40}
                  priority
                  className="rounded-full"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-purple-500"
              >
                PredictED
              </motion.div>
            </Link>

            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {/* <item.icon className="mr-2 h-4 w-4" /> */}
                        <span>{item.name}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
