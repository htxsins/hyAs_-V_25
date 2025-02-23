"use client"

import TimeTablePage from "@/components/TimeTable"
import { NewNav } from "@/components/Navbar-After-Login"

export default function TimetablePage(){

    return(
        <div>
            <NewNav />
            <div className="mt-20">

                <TimeTablePage />
            </div>
        </div>
    )

}