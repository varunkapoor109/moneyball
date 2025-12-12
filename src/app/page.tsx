"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const [players, setPlayers] = useState<string[]>(Array(8).fill(""))

  // Clear localStorage on homepage load to reset session
  useEffect(() => {
    localStorage.removeItem('players')
    localStorage.removeItem('rounds')
  }, [])

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleContinue = () => {
    const filledPlayers = players.filter(p => p.trim() !== "")
    if (filledPlayers.length === 8) {
      // Store players in localStorage and navigate to rounds page
      localStorage.setItem('players', JSON.stringify(filledPlayers))
      window.location.href = '/rounds'
    }
  }

  const allPlayersFilled = players.every(p => p.trim() !== "")

  return (
    <div className="min-h-screen bg-[#9FFFB8]">
      {/* Global Header */}
      <header className="bg-[#415231] px-8 py-4">
        <a href="/">
          <h1 className="text-xl font-medium text-white cursor-pointer hover:opacity-80 transition-opacity">
            Mini Moneyball
          </h1>
        </a>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Astronaut Image */}
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/astronaut.jpg"
              alt="Astronaut with money"
              width={585}
              height={585}
              className="w-full max-w-[585px] h-auto"
              priority
            />
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#B8C964] rounded-2xl p-10 shadow-xl max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Enter the name of the players
            </h2>

            {/* Player Input Fields */}
            <div className="space-y-3 mb-8">
              {players.map((player, index) => (
                <Input
                  key={index}
                  type="text"
                  placeholder="Player name"
                  value={player}
                  onChange={(e) => handlePlayerChange(index, e.target.value)}
                  className="h-12 bg-white border-0 rounded-md text-gray-700 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400"
                />
              ))}
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!allPlayersFilled}
              className="w-full h-14 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg text-base font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
