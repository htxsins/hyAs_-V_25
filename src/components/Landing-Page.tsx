"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Hero from "public/hero.png"
import {Navbar} from "@/components/Navbar-after-login"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg"
              alt="SquadHub Logo"
              width={32}
              height={32}
              className="bg-[#C3F53B] rounded-full"
            />
            <span className="font-medium">Scout</span>
          </div> 
         <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm">Admission Prediction</Link>
            <Link href="#" className="text-sm">Faculty Planning</Link>
            <Link href="#" className="text-sm">Report Generation</Link>
            <Link href="#" className="text-sm">Timetable Generation</Link>
          </div> 
          {/* <Navbar /> */}

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm">Sign In</Link>
            <Button variant="default" className="bg-black text-white hover:bg-black/90">Get Started</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-7">
        <section className="mb-8 text-center">
          <div className="max-w-4xl mx-auto mb-2 mt-[-20px]">
            <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-sm mb-3 mt-3">Boost your college productivity</span>
            <h1 className="text-5xl font-medium leading-tight mb-6">Efficient and Seamless College Admission Management Solution.</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Streamline your college's workflow, track process, and collaborate effectively</p>
          </div>
        </section>

        <section className="mb-8 flex justify-around gap-8">
          {/* Team Component */}
          <div className="bg-white rounded-xl p-4 shadow-lg w-[225px] m translate-x-[-80px] translate-y-[-90px]">
            <h3 className="text-xl font-medium mb-4">Team</h3>
            <div className="space-y-4">
              {[{ name: "Sushmit Sanyal", role: "Professor", color: "bg-[#FF69B4]" },
                { name: "Tanmay Sarode", role: "Associate Professor", color: "bg-[#9E83E5]" },
                ].map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${member.color}`} />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-[15px] text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <button className="text-gray-400">✉</button>
                </div>
              ))}
            </div>
          </div>

          {/* Center Buttons */}
          <div className="flex flex-row justify-baseline items-center gap-4 translate-y-[-75px]">
  <Button className="bg-[#9E83E5] text-black hover:bg-[#845de5] h-12 px-8 ">Get Started</Button>
  <Button variant="outline" className="bg-black text-white hover:bg-black/90 border-0 h-12 px-8">Learn More →</Button>
</div>


          {/* Schedule Component */}
          <div className="bg-black text-white rounded-xl p-3 w-[240px] h-[150px] translate-x-[90px] translate-y-[-60px]">
  <h3 className="text-xl font-medium mb-3">Upcoming Dates</h3>
  <div className="flex items-center justify-between mb-3">
    <Button className="bg-[#C3F53B] text-black hover:bg-[#B3E52B] text-sm px-3 py-1">Schedule</Button>
    <div className="flex items-center gap-2 text-sm">
      <span>22nd Feb</span>
    </div>
  </div>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm">
      <div className="flex -space-x-2">
        <div className="w-5 h-5 rounded-full bg-[#FF69B4] border-2 border-black" />
        <div className="w-5 h-5 rounded-full bg-[#40E0D0] border-2 border-black" />
      </div>
      <span>Join</span>
    </div>
    <Button size="icon" variant="outline" className="rounded-full w-7 h-7 border-white/20 text-sm">+</Button>
  </div>
</div>

         
        </section>

        <section className="flex justify-center mt-0 mt-0 translate-y-[-140px] translate-x-[20px] ">
          <Image 
            src={Hero} 
            alt="Hero Image" 
            className="max-w-full h-auto rounded-lg"
          />
        </section>
      </main>
    </div>
  );
}
