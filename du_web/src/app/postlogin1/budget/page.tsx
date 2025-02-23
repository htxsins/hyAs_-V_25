"use client"

import Budget from "@/components/Budget"
import { NewNav } from "@/components/Navbar-After-Login"

export default function BudgetPage(){

    return(
        <div>
            <NewNav />
            <div className="mt-20">
                <Budget />
            </div>
        </div>
    )

}