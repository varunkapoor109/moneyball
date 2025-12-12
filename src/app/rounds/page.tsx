"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { generateRoundRobin, type Round, type Match } from "@/lib/roundRobin"

export default function RoundsPage() {
  const [players, setPlayers] = useState<string[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState<0 | 1>(0)
  const [score1, setScore1] = useState("")
  const [score2, setScore2] = useState("")

  useEffect(() => {
    // Load players from localStorage
    const storedPlayers = localStorage.getItem('players')
    if (storedPlayers) {
      const playerList = JSON.parse(storedPlayers)
      setPlayers(playerList)

      // Check if we have saved rounds in localStorage
      const savedRounds = localStorage.getItem('rounds')
      if (savedRounds) {
        setRounds(JSON.parse(savedRounds))
      } else {
        // Generate new rounds
        const generatedRounds = generateRoundRobin(playerList)
        setRounds(generatedRounds)
        localStorage.setItem('rounds', JSON.stringify(generatedRounds))
      }
    } else {
      // No players found, redirect to home
      window.location.href = '/'
    }
  }, [])

  const handleAddScore = (matchIndex: 0 | 1) => {
    setCurrentMatchIndex(matchIndex)
    const currentMatch = rounds[currentRoundIndex].matches[matchIndex]

    // Pre-fill if scores already exist
    if (currentMatch.score1 !== null) {
      setScore1(currentMatch.score1.toString())
    }
    if (currentMatch.score2 !== null) {
      setScore2(currentMatch.score2.toString())
    }

    setModalOpen(true)
  }

  const handleSaveScore = () => {
    if (!score1 || !score2) {
      alert("Please enter both scores")
      return
    }

    const s1 = parseInt(score1)
    const s2 = parseInt(score2)

    // Automatically determine winner based on score
    const winner = s1 > s2 ? 'team1' : 'team2'

    const updatedRounds = [...rounds]
    updatedRounds[currentRoundIndex].matches[currentMatchIndex] = {
      ...updatedRounds[currentRoundIndex].matches[currentMatchIndex],
      score1: s1,
      score2: s2,
      winner: winner
    }

    setRounds(updatedRounds)
    localStorage.setItem('rounds', JSON.stringify(updatedRounds))

    // Reset modal state
    setScore1("")
    setScore2("")
    setModalOpen(false)
  }

  // Check if current round is complete
  const isCurrentRoundComplete = () => {
    const round = rounds[currentRoundIndex]
    return round.matches.every(match =>
      match.score1 !== null &&
      match.score2 !== null &&
      match.winner !== null
    )
  }

  // Check if all rounds are complete
  const areAllRoundsComplete = () => {
    return rounds.every(round =>
      round.matches.every(match =>
        match.score1 !== null &&
        match.score2 !== null &&
        match.winner !== null
      )
    )
  }

  const handleNextRound = () => {
    if (currentRoundIndex < 6 && isCurrentRoundComplete()) {
      setCurrentRoundIndex(currentRoundIndex + 1)
    }
  }

  const handlePreviousRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (areAllRoundsComplete()) {
      // Store rounds and navigate to leaderboard
      localStorage.setItem('rounds', JSON.stringify(rounds))
      window.location.href = '/leaderboard'
    }
  }

  if (rounds.length === 0) {
    return <div className="min-h-screen bg-[#9FFFB8] flex items-center justify-center">Loading...</div>
  }

  const currentRound = rounds[currentRoundIndex]

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
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Round Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Round {currentRoundIndex + 1}</h2>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentRoundIndex > 0 && (
              <Button
                onClick={handlePreviousRound}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous round
              </Button>
            )}

            {currentRoundIndex < 6 ? (
              <Button
                onClick={handleNextRound}
                disabled={!isCurrentRoundComplete()}
                className="bg-[#415231] hover:bg-[#536842] text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next round
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!areAllRoundsComplete()}
                className="bg-[#415231] hover:bg-[#536842] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </Button>
            )}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentRound.matches.map((match, matchIndex) => (
            <div key={matchIndex} className="bg-[#B8C964] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Match {matchIndex + 1}</h3>

              {/* Team 1 */}
              <div className="space-y-2 mb-3">
                {match.team1.map((player, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-md flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm">
                      {player.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-900">{player}</span>
                  </div>
                ))}
              </div>

              {/* VS */}
              <div className="text-center text-gray-700 font-semibold my-3">VS</div>

              {/* Team 2 */}
              <div className="space-y-2 mb-4">
                {match.team2.map((player, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-md flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm">
                      {player.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-900">{player}</span>
                  </div>
                ))}
              </div>

              {/* Add Score Section */}
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">Add score</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {match.score1 !== null ? match.score1 : '-'}
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {match.score2 !== null ? match.score2 : '-'}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddScore(matchIndex as 0 | 1)}
                    size="sm"
                    className="bg-white text-[#415231] border border-[#415231] hover:bg-[#415231] hover:text-white"
                  >
                    + Add score
                  </Button>
                </div>

                {/* Winner Display */}
                <div className="text-sm text-gray-700">
                  Winner: {match.winner ? (match.winner === 'team1' ? `${match.team1[0]} & ${match.team1[1]}` : `${match.team2[0]} & ${match.team2[1]}`) : '-'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Score Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Match {currentMatchIndex + 1}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Team 1 */}
            <div>
              <p className="text-sm font-medium mb-2">
                Team 1: {currentRound.matches[currentMatchIndex].team1[0]} & {currentRound.matches[currentMatchIndex].team1[1]}
              </p>
              <Input
                type="number"
                placeholder="Score"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                className="w-full"
                min="0"
              />
            </div>

            {/* Team 2 */}
            <div>
              <p className="text-sm font-medium mb-2">
                Team 2: {currentRound.matches[currentMatchIndex].team2[0]} & {currentRound.matches[currentMatchIndex].team2[1]}
              </p>
              <Input
                type="number"
                placeholder="Score"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                className="w-full"
                min="0"
              />
            </div>

            {/* Winner Preview */}
            {score1 && score2 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  Winner: {parseInt(score1) > parseInt(score2)
                    ? `Team 1 (${currentRound.matches[currentMatchIndex].team1[0]} & ${currentRound.matches[currentMatchIndex].team1[1]})`
                    : `Team 2 (${currentRound.matches[currentMatchIndex].team2[0]} & ${currentRound.matches[currentMatchIndex].team2[1]})`}
                </p>
              </div>
            )}

            {/* Save Button */}
            <Button onClick={handleSaveScore} className="w-full bg-[#415231] hover:bg-[#536842] text-white">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
