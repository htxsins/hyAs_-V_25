"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {Admission} from "@/components"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <div className="flex items-center space-x-2">
        <img src="/placeholder.svg?height=32&width=32" alt="PredictED Logo" className="w-8 h-8" />
        <span className="text-xl font-bold">PredictED</span>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/student-prediction">
          <Button variant="ghost">Student Prediction</Button>
        </Link>
        <Link href="/market-analysis">
          <Button variant="ghost">Market Analysis</Button>
        </Link>
        <Link href="/budget-analysis">
          <Button variant="ghost">Budget Analysis</Button>
        </Link>
        <Link href="/heatmap">
          <Button variant="ghost">HeatMap</Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              What if? <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/what-if/scenario-1">Scenario 1</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/what-if/scenario-2">Scenario 2</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/what-if/scenario-3">Scenario 3</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

