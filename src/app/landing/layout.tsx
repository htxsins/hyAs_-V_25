"use client";

import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "next-themes";
import ProtectionProvider from "@/providers/ProtectionProvider";
import { useUser } from "@/providers/UserProvider";
import NavbarLayout from "@/components/Navbar-Layout";
import BurgerMenu from "@/components/Burger-Menu";

export default function Home({
  user1,
}: {
  user1: React.ReactNode;
}) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserType = async ({ uid }: { uid: string }) => {
      if (!uid) return;
      let userRef = doc(db, "User", uid);
      let docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        userRef = doc(db, "User2", uid);
        docSnap = await getDoc(userRef);
        setUserType("user2");

        if (!docSnap.exists()) {
          userRef = doc(db, "User3", uid);
          docSnap = await getDoc(userRef);
          setUserType("user3");

          if (!docSnap.exists()) {
            userRef = doc(db, "User4", uid);
            docSnap = await getDoc(userRef);
            setUserType("user4");
          }

        }

      }
      
      else{
        setUserType(docSnap.data()?.type);
      };
    };

    fetchUserType({ uid: user?.uid || "" });
  }, []);

  return (
    <ProtectionProvider>
      <div className={`min-h-screen w-full ${theme}`}>
      <NavbarLayout userType={userType ? userType : ""} />
      <BurgerMenu userType={userType ? userType : ""} />
        <div className="flex flex-col mt-4">
          {userType == "user1" && user1}
        </div>
      </div>
    </ProtectionProvider>
  );
}
