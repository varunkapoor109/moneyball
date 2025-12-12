import type { Round } from './roundRobin'

export interface PlayerStats {
  name: string
  wins: number
  pointsScored: number
  pointsAllowed: number
  pointDifferential: number
}

export function calculateLeaderboard(players: string[], rounds: Round[]): PlayerStats[] {
  // Initialize stats for each player
  const stats: Record<string, PlayerStats> = {}
  players.forEach(player => {
    stats[player] = {
      name: player,
      wins: 0,
      pointsScored: 0,
      pointsAllowed: 0,
      pointDifferential: 0
    }
  })

  // Calculate stats from all rounds
  rounds.forEach(round => {
    round.matches.forEach(match => {
      const { team1, team2, score1, score2, winner } = match

      if (score1 === null || score2 === null || winner === null) {
        return // Skip incomplete matches
      }

      // Add wins for winning team players
      if (winner === 'team1') {
        stats[team1[0]].wins++
        stats[team1[1]].wins++
      } else {
        stats[team2[0]].wins++
        stats[team2[1]].wins++
      }

      // Track points for team1 players
      team1.forEach(player => {
        stats[player].pointsScored += score1
        stats[player].pointsAllowed += score2
      })

      // Track points for team2 players
      team2.forEach(player => {
        stats[player].pointsScored += score2
        stats[player].pointsAllowed += score1
      })
    })
  })

  // Calculate point differential for each player
  Object.values(stats).forEach(playerStat => {
    playerStat.pointDifferential = playerStat.pointsScored - playerStat.pointsAllowed
  })

  // Sort by wins (descending), then by point differential (descending)
  const leaderboard = Object.values(stats).sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins
    }
    return b.pointDifferential - a.pointDifferential
  })

  return leaderboard
}
