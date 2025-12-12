"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Medal } from "lucide-react"
import { calculateLeaderboard, type PlayerStats } from "@/lib/leaderboard"
import type { Round } from "@/lib/roundRobin"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([])
  const [players, setPlayers] = useState<string[]>([])

  useEffect(() => {
    // Load data from localStorage
    const storedPlayers = localStorage.getItem('players')
    const storedRounds = localStorage.getItem('rounds')

    if (storedPlayers && storedRounds) {
      const playerList: string[] = JSON.parse(storedPlayers)
      const rounds: Round[] = JSON.parse(storedRounds)

      setPlayers(playerList)
      const stats = calculateLeaderboard(playerList, rounds)
      setLeaderboard(stats)
    } else {
      // No data, redirect to home
      window.location.href = '/'
    }
  }, [])

  const handleNewTournament = () => {
    localStorage.removeItem('players')
    localStorage.removeItem('rounds')
    window.location.href = '/'
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />
    return null
  }

  const getRankBgColor = (index: number) => {
    if (index === 0) return "bg-yellow-50 border-yellow-300"
    if (index === 1) return "bg-gray-50 border-gray-300"
    if (index === 2) return "bg-amber-50 border-amber-300"
    return "bg-white border-gray-200"
  }

  if (leaderboard.length === 0) {
    return <div className="min-h-screen bg-[#9FFFB8] flex items-center justify-center">Loading...</div>
  }

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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h2>
          <p className="text-lg text-gray-700">Final Tournament Results</p>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-4 mb-8">
          {leaderboard.map((player, index) => (
            <div
              key={player.name}
              className={`${getRankBgColor(index)} border-2 rounded-xl p-6 transition-all hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                {/* Left: Rank and Name */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  {getRankIcon(index)}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-600">
                      {player.wins} {player.wins === 1 ? 'win' : 'wins'}
                    </p>
                  </div>
                </div>

                {/* Right: Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Point Diff</p>
                    <p className={`text-lg font-bold ${player.pointDifferential >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {player.pointDifferential >= 0 ? '+' : ''}{player.pointDifferential}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Scored</p>
                    <p className="text-lg font-bold text-gray-900">{player.pointsScored}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase mb-1">Allowed</p>
                    <p className="text-lg font-bold text-gray-900">{player.pointsAllowed}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Tournament Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleNewTournament}
            className="bg-[#415231] hover:bg-[#536842] text-white px-8 py-6 text-lg"
          >
            Start New Tournament
          </Button>
        </div>
      </main>
    </div>
  )
}
