export type DfsSlatePlayer = {
  operatorPlayerId?: number | string
  operatorPlayerName?: string
  operatorPosition?: string
  operatorSalary?: number
  team?: string
  teamAbbreviation?: string
}

export type DfsSlate = {
  slateId: number
  operator?: string
  operatorGameType?: string
  operatorName?: string
  dfsSlatePlayers?: DfsSlatePlayer[]
}
