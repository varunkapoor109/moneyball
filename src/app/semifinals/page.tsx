"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Team {
  name: string
  players: (string | null)[]
}

interface Match {
  team1: Team
  team2: Team
  score1: number | null
  score2: number | null
  winner: 'team1' | 'team2' | null
}

export default function SemifinalsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number | null>(null)
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')

  useEffect(() => {
    // Load teams from localStorage
    const storedTeams = localStorage.getItem('draftedTeams')
    if (storedTeams) {
      const teamList: Team[] = JSON.parse(storedTeams)
      setTeams(teamList)

      // Initialize matches: Team 1 vs Team 4, Team 2 vs Team 3
      setMatches([
        {
          team1: teamList[0], // Team 1
          team2: teamList[3], // Team 4
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: teamList[1], // Team 2
          team2: teamList[2], // Team 3
          score1: null,
          score2: null,
          winner: null
        }
      ])
    } else {
      // No data, redirect to home
      window.location.href = '/'
    }
  }, [])

  const handleAddScore = (matchIndex: number) => {
    const match = matches[matchIndex]
    setCurrentMatchIndex(matchIndex)
    setScore1(match.score1?.toString() || '')
    setScore2(match.score2?.toString() || '')
    setModalOpen(true)
  }

  const handleSaveScore = () => {
    if (currentMatchIndex === null) return

    const s1 = parseInt(score1)
    const s2 = parseInt(score2)

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert('Please enter valid scores')
      return
    }

    // Determine winner
    const winner = s1 > s2 ? 'team1' : 'team2'

    // Update match
    const newMatches = [...matches]
    newMatches[currentMatchIndex] = {
      ...newMatches[currentMatchIndex],
      score1: s1,
      score2: s2,
      winner
    }
    setMatches(newMatches)

    // Save to localStorage
    localStorage.setItem('semifinalMatches', JSON.stringify(newMatches))

    setModalOpen(false)
    setCurrentMatchIndex(null)
    setScore1('')
    setScore2('')
  }

  const allMatchesComplete = () => {
    return matches.every(match => match.winner !== null)
  }

  const handleProceedToFinals = () => {
    if (!allMatchesComplete()) return

    // Get winners
    const winners = matches.map(match =>
      match.winner === 'team1' ? match.team1 : match.team2
    )

    // Save winners to localStorage
    localStorage.setItem('finalistsTeams', JSON.stringify(winners))

    // Navigate to finals
    window.location.href = '/finals'
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
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Semifinals</h2>
          <p className="text-lg text-gray-700">Games to 15 points - Winners advance to Finals</p>
        </div>

        {/* Matches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {matches.map((match, index) => (
            <div key={index} className="bg-[#B8C964] rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                Semifinal {index + 1}
              </h3>

              {/* Team 1 */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{match.team1.name}</h4>
                <div className="flex gap-2">
                  {match.team1.players.map((player, i) => (
                    <div key={i} className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-white text-xs font-medium">
                      {player?.charAt(0)}
                    </div>
                  ))}
                  <div className="flex-1 flex items-center gap-2 ml-2">
                    {match.team1.players.map((player, i) => (
                      <span key={i} className="text-sm text-gray-700">{player}</span>
                    ))}
                  </div>
                </div>
                {match.score1 !== null && (
                  <div className="mt-3 text-right">
                    <span className="text-3xl font-bold text-gray-900">{match.score1}</span>
                  </div>
                )}
              </div>

              {/* VS */}
              <div className="text-center text-gray-700 font-bold mb-4">VS</div>

              {/* Team 2 */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{match.team2.name}</h4>
                <div className="flex gap-2">
                  {match.team2.players.map((player, i) => (
                    <div key={i} className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-full text-white text-xs font-medium">
                      {player?.charAt(0)}
                    </div>
                  ))}
                  <div className="flex-1 flex items-center gap-2 ml-2">
                    {match.team2.players.map((player, i) => (
                      <span key={i} className="text-sm text-gray-700">{player}</span>
                    ))}
                  </div>
                </div>
                {match.score2 !== null && (
                  <div className="mt-3 text-right">
                    <span className="text-3xl font-bold text-gray-900">{match.score2}</span>
                  </div>
                )}
              </div>

              {/* Add Score Button */}
              <Button
                onClick={() => handleAddScore(index)}
                className="w-full bg-[#415231] hover:bg-[#536842] text-white"
              >
                {match.winner ? 'Edit Score' : '+ Add Score'}
              </Button>

              {/* Winner Display */}
              {match.winner && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-700 mb-1">Winner:</p>
                  <p className="font-bold text-lg text-gray-900">
                    {match.winner === 'team1' ? match.team1.name : match.team2.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Proceed to Finals Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleProceedToFinals}
            disabled={!allMatchesComplete()}
            className="bg-[#415231] hover:bg-[#536842] text-white px-12 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Finals
          </Button>
        </div>
      </main>

      {/* Score Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {currentMatchIndex !== null && `Semifinal ${currentMatchIndex + 1}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Team 1 Score */}
            {currentMatchIndex !== null && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {matches[currentMatchIndex].team1.name} Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Team 2 Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {matches[currentMatchIndex].team2.name} Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Winner Preview */}
                {score1 && score2 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 mb-1">Winner Preview:</p>
                    <p className="font-bold text-blue-900">
                      {parseInt(score1) > parseInt(score2)
                        ? matches[currentMatchIndex].team1.name
                        : matches[currentMatchIndex].team2.name}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveScore}
              className="w-full bg-[#415231] hover:bg-[#536842] text-white"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
