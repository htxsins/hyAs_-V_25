"use client"

import HeatMap from "@/components/Heat-Map"
import Admission from "@/components/Admission-graphs"
import Home from "@/components/Landing-Page"
import UploadDataButton from "@/components/Upload-Data"
import TimeTablePage from "@/components/TimeTable"
import MarketingDashboard from "@/components/MarketImpact"

export default function TestPage(){

  return(
    <div>
      <Home />
      {/* <Admission/> */}
      {/* This is a Test Page */}
      {/* <Home /> */}
      <Admission/>
      {/* <MarketingDashboard/> */}
      {/* <TimeTablePage /> */}

    </div>
  )

}