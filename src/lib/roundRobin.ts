// Generate round robin schedule for 8 players
// Each player partners with every other player exactly once across 7 rounds
// Returns 7 rounds, each with 2 matches (4 teams of 2 players)

export interface Match {
  team1: [string, string]
  team2: [string, string]
  score1: number | null
  score2: number | null
  winner: 'team1' | 'team2' | null
}

export interface Round {
  matches: [Match, Match]
}

// Fisher-Yates shuffle algorithm to randomize array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateRoundRobin(players: string[]): Round[] {
  if (players.length !== 8) {
    throw new Error('Round robin requires exactly 8 players')
  }

  // Randomize player order before generating schedule
  const shuffledPlayers = shuffleArray(players)

  // Social round robin schedule for 8 players
  // This ensures each player partners with each other player exactly once
  const schedule: Round[] = [
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[1]],
          team2: [shuffledPlayers[2], shuffledPlayers[3]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[4], shuffledPlayers[5]],
          team2: [shuffledPlayers[6], shuffledPlayers[7]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    },
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[2]],
          team2: [shuffledPlayers[4], shuffledPlayers[6]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[1], shuffledPlayers[3]],
          team2: [shuffledPlayers[5], shuffledPlayers[7]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    },
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[3]],
          team2: [shuffledPlayers[5], shuffledPlayers[6]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[1], shuffledPlayers[2]],
          team2: [shuffledPlayers[4], shuffledPlayers[7]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    },
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[4]],
          team2: [shuffledPlayers[1], shuffledPlayers[7]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[2], shuffledPlayers[5]],
          team2: [shuffledPlayers[3], shuffledPlayers[6]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    },
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[5]],
          team2: [shuffledPlayers[3], shuffledPlayers[7]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[1], shuffledPlayers[4]],
          team2: [shuffledPlayers[2], shuffledPlayers[6]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    },
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[6]],
          team2: [shuffledPlayers[2], shuffledPlayers[4]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[1], shuffledPlayers[5]],
          team2: [shuffledPlayers[3], shuffledPlayers[7]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    },
    {
      matches: [
        {
          team1: [shuffledPlayers[0], shuffledPlayers[7]],
          team2: [shuffledPlayers[1], shuffledPlayers[6]],
          score1: null,
          score2: null,
          winner: null
        },
        {
          team1: [shuffledPlayers[2], shuffledPlayers[3]],
          team2: [shuffledPlayers[4], shuffledPlayers[5]],
          score1: null,
          score2: null,
          winner: null
        }
      ]
    }
  ]

  return schedule
}
