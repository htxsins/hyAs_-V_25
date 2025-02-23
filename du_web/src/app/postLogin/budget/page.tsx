"use client"

import Budget from "@/components/Budget"
import { NewNav } from "@/components/Navbar-After-Login"
import BudgetForm from "@/components/BudgetForm"

export default function BudgetPage(){

    return(
        <div>
            <NewNav />
            <div className="mt-20">
                <BudgetForm />
            </div>
        </div>
    )

}