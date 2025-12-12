"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface Team {
  name: string
  players: (string | null)[]
}

export default function DraftPage() {
  const [availablePlayers, setAvailablePlayers] = useState<string[]>([])
  const [teams, setTeams] = useState<Team[]>([
    { name: "Team 1", players: [null, null] },
    { name: "Team 2", players: [null, null] },
    { name: "Team 3", players: [null, null] },
    { name: "Team 4", players: [null, null] },
  ])
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null)

  useEffect(() => {
    // Load players from localStorage
    const storedPlayers = localStorage.getItem('players')
    if (storedPlayers) {
      const playerList: string[] = JSON.parse(storedPlayers)
      setAvailablePlayers(playerList)
    } else {
      // No data, redirect to home
      window.location.href = '/'
    }
  }, [])

  const handleDragStart = (player: string) => {
    setDraggedPlayer(player)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnTeam = (teamIndex: number, slotIndex: number) => {
    if (!draggedPlayer) return

    // Check if slot is already filled
    if (teams[teamIndex].players[slotIndex] !== null) return

    // Remove player from available players
    setAvailablePlayers(prev => prev.filter(p => p !== draggedPlayer))

    // Add player to team slot
    const newTeams = [...teams]
    newTeams[teamIndex].players[slotIndex] = draggedPlayer
    setTeams(newTeams)

    setDraggedPlayer(null)
  }

  const handleDropBackToAvailable = () => {
    if (!draggedPlayer) return

    // Find and remove player from teams
    const newTeams = teams.map(team => ({
      ...team,
      players: team.players.map(p => p === draggedPlayer ? null : p)
    }))
    setTeams(newTeams)

    // Add back to available players if not already there
    if (!availablePlayers.includes(draggedPlayer)) {
      setAvailablePlayers(prev => [...prev, draggedPlayer])
    }

    setDraggedPlayer(null)
  }

  const handleRemoveFromTeam = (teamIndex: number, slotIndex: number) => {
    const player = teams[teamIndex].players[slotIndex]
    if (!player) return

    // Remove from team
    const newTeams = [...teams]
    newTeams[teamIndex].players[slotIndex] = null
    setTeams(newTeams)

    // Add back to available players
    setAvailablePlayers(prev => [...prev, player])
  }

  const allSlotsFilled = () => {
    return teams.every(team => team.players.every(player => player !== null))
  }

  const handleFinalize = () => {
    if (!allSlotsFilled()) return

    // Save teams to localStorage
    localStorage.setItem('draftedTeams', JSON.stringify(teams))

    // Navigate to semifinals
    window.location.href = '/semifinals'
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
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Draft Teams</h2>
          <p className="text-lg text-gray-700">Drag players to team slots to form 4 teams</p>
        </div>

        {/* Available Players */}
        <div
          className="mb-12 bg-white rounded-xl p-6 border-2 border-gray-200"
          onDragOver={handleDragOver}
          onDrop={handleDropBackToAvailable}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Available Players ({availablePlayers.length})
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {availablePlayers.map(player => (
              <div
                key={player}
                draggable
                onDragStart={() => handleDragStart(player)}
                className="bg-[#B8C964] text-gray-900 px-4 py-3 rounded-lg font-medium cursor-move hover:opacity-80 transition-opacity text-center"
              >
                {player}
              </div>
            ))}
            {availablePlayers.length === 0 && (
              <div className="col-span-4 text-center text-gray-500 py-8">
                All players have been drafted
              </div>
            )}
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {teams.map((team, teamIndex) => (
            <div
              key={team.name}
              className="bg-white rounded-xl p-6 border-2 border-gray-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {team.name}
              </h3>
              <div className="space-y-4">
                {team.players.map((player, slotIndex) => (
                  <div
                    key={slotIndex}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropOnTeam(teamIndex, slotIndex)}
                    className={`h-16 rounded-lg border-2 border-dashed flex items-center justify-center relative ${
                      player
                        ? 'bg-[#B8C964] border-[#B8C964]'
                        : 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {player ? (
                      <>
                        <span className="font-medium text-gray-900">{player}</span>
                        <button
                          onClick={() => handleRemoveFromTeam(teamIndex, slotIndex)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">Drop player here</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Finalize Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleFinalize}
            disabled={!allSlotsFilled()}
            className="bg-[#415231] hover:bg-[#536842] text-white px-12 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalize Teams
          </Button>
        </div>
      </main>
    </div>
  )
}
