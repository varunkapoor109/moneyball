"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Trophy } from "lucide-react"

interface Team {
  name: string
  players: (string | null)[]
}

interface Game {
  score1: number | null
  score2: number | null
  winner: 'team1' | 'team2' | null
}

export default function FinalsPage() {
  const [team1, setTeam1] = useState<Team | null>(null)
  const [team2, setTeam2] = useState<Team | null>(null)
  const [games, setGames] = useState<Game[]>([
    { score1: null, score2: null, winner: null },
    { score1: null, score2: null, winner: null },
    { score1: null, score2: null, winner: null }
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentGameIndex, setCurrentGameIndex] = useState<number | null>(null)
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
  const [champion, setChampion] = useState<Team | null>(null)

  useEffect(() => {
    // Load finalist teams from localStorage
    const storedFinalists = localStorage.getItem('finalistsTeams')
    if (storedFinalists) {
      const finalists: Team[] = JSON.parse(storedFinalists)
      setTeam1(finalists[0])
      setTeam2(finalists[1])
    } else {
      // No data, redirect to home
      window.location.href = '/'
    }
  }, [])

  const handleAddScore = (gameIndex: number) => {
    const game = games[gameIndex]
    setCurrentGameIndex(gameIndex)
    setScore1(game.score1?.toString() || '')
    setScore2(game.score2?.toString() || '')
    setModalOpen(true)
  }

  const handleSaveScore = () => {
    if (currentGameIndex === null || !team1 || !team2) return

    const s1 = parseInt(score1)
    const s2 = parseInt(score2)

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert('Please enter valid scores')
      return
    }

    // Determine winner
    const winner = s1 > s2 ? 'team1' : 'team2'

    // Update game
    const newGames = [...games]
    newGames[currentGameIndex] = {
      score1: s1,
      score2: s2,
      winner
    }
    setGames(newGames)

    // Save to localStorage
    localStorage.setItem('finalGames', JSON.stringify(newGames))

    // Check if we have a champion (best of 3)
    const team1Wins = newGames.filter(g => g.winner === 'team1').length
    const team2Wins = newGames.filter(g => g.winner === 'team2').length

    if (team1Wins >= 2) {
      setChampion(team1)
      localStorage.setItem('champion', JSON.stringify(team1))
    } else if (team2Wins >= 2) {
      setChampion(team2)
      localStorage.setItem('champion', JSON.stringify(team2))
    }

    setModalOpen(false)
    setCurrentGameIndex(null)
    setScore1('')
    setScore2('')
  }

  const getTeamWins = (teamNum: 'team1' | 'team2') => {
    return games.filter(g => g.winner === teamNum).length
  }

  const handleNewTournament = () => {
    localStorage.removeItem('players')
    localStorage.removeItem('rounds')
    localStorage.removeItem('draftedTeams')
    localStorage.removeItem('semifinalMatches')
    localStorage.removeItem('finalistsTeams')
    localStorage.removeItem('finalGames')
    localStorage.removeItem('champion')
    window.location.href = '/'
  }

  if (!team1 || !team2) {
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
      <main className="max-w-6xl mx-auto px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Championship Finals</h2>
          <p className="text-lg text-gray-700">Best of 3 - Games to 11 points</p>
        </div>

        {/* Champion Display */}
        {champion && (
          <div className="mb-12 bg-gradient-to-r from-yellow-100 to-amber-100 border-4 border-yellow-500 rounded-xl p-8">
            <div className="text-center">
              <Trophy className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">🏆 Champion! 🏆</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">{champion.name}</p>
              <div className="flex justify-center gap-4 mb-6">
                {champion.players.map((player, i) => (
                  <div key={i} className="bg-white px-6 py-3 rounded-lg shadow">
                    <p className="font-semibold text-gray-900">{player}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Teams Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Team 1 */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{team1.name}</h3>
            <div className="flex justify-center gap-4 mb-4">
              {team1.players.map((player, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full text-white font-bold text-lg mx-auto mb-2">
                    {player?.charAt(0)}
                  </div>
                  <p className="text-sm text-gray-700">{player}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Wins</p>
              <p className="text-5xl font-bold text-gray-900">{getTeamWins('team1')}</p>
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{team2.name}</h3>
            <div className="flex justify-center gap-4 mb-4">
              {team2.players.map((player, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full text-white font-bold text-lg mx-auto mb-2">
                    {player?.charAt(0)}
                  </div>
                  <p className="text-sm text-gray-700">{player}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Wins</p>
              <p className="text-5xl font-bold text-gray-900">{getTeamWins('team2')}</p>
            </div>
          </div>
        </div>

        {/* Games */}
        <div className="space-y-6 mb-12">
          {games.map((game, index) => (
            <div key={index} className="bg-[#B8C964] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Game {index + 1}</h4>
                  {game.score1 !== null && game.score2 !== null && (
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-gray-900">{game.score1}</span>
                      <span className="text-gray-700">-</span>
                      <span className="text-3xl font-bold text-gray-900">{game.score2}</span>
                      {game.winner && (
                        <span className="ml-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Winner: {game.winner === 'team1' ? team1.name : team2.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleAddScore(index)}
                  disabled={champion !== null && game.winner === null}
                  className="bg-[#415231] hover:bg-[#536842] text-white disabled:opacity-50"
                >
                  {game.winner ? 'Edit Score' : '+ Add Score'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* New Tournament Button */}
        {champion && (
          <div className="flex justify-center">
            <Button
              onClick={handleNewTournament}
              className="bg-[#415231] hover:bg-[#536842] text-white px-12 py-6 text-lg"
            >
              Start New Tournament
            </Button>
          </div>
        )}
      </main>

      {/* Score Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {currentGameIndex !== null && `Game ${currentGameIndex + 1}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Team 1 Score */}
            {currentGameIndex !== null && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {team1.name} Score
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
                    {team2.name} Score
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
                      {parseInt(score1) > parseInt(score2) ? team1.name : team2.name}
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
