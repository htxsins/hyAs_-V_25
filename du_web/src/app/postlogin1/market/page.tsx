"use client"

import MarketingDashboard from "@/components/MarketImpact"
import { NewNav } from "@/components/Navbar-After-Login"

export default function Market(){

    return(
        <div>
            <NewNav />
            <div className="mt-20">
                <MarketingDashboard />
            </div>
        </div>
    )

}