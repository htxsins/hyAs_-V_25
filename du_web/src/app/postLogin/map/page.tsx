"use client"

import { NewNav } from "@/components/Navbar-After-Login"
import HeatMap from "@/components/Heat-Map"
export default function MapPage(){
    return(
        <div>
            <NewNav />
            <div className="mt-20">
                <HeatMap />
            </div>
        </div>
    )
}