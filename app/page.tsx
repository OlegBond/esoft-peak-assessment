"use client"

import React, { useMemo, useState } from 'react'
import { Select } from '@/components/Select'
import { PlayerCard, type Player } from '@/components/PlayerCard'
import { Pagination } from '@/components/Pagination'
import { getGameTypes, getOperators, getSlateNames, getSlates } from '@/lib/data'

const PAGE_SIZE = 12

export default function Page() {
  const operators = getOperators()
  const [operator, setOperator] = useState<string | undefined>(undefined)

  const gameTypes = useMemo(() => getGameTypes(operator), [operator])
  const [gameType, setGameType] = useState<string | undefined>(undefined)

  const slateNames = useMemo(() => getSlateNames(operator, gameType), [operator, gameType])
  const [slateName, setSlateName] = useState<string | undefined>(undefined)

  // Fetch slates based on optional filters; when none are selected, return all slates
  const filteredSlates = useMemo(() => getSlates(operator, gameType, slateName), [operator, gameType, slateName])
  // Flatten players from all matched slates; when no filters, this is all players
  const players: Player[] = useMemo(() => filteredSlates.flatMap((s) => s.dfsSlatePlayers ?? []), [filteredSlates])

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [page, setPage] = useState(1)

  React.useEffect(() => {
    // when players change, select first one and reset page
    setSelectedPlayer(players[0] ?? null)
    setPage(1)
  }, [players])

  const pagedPlayers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return players.slice(start, start + PAGE_SIZE)
  }, [players, page])

  // derived points helper used for Points column
  const pointsFor = (p: Player) => (p.operatorSalary ? Math.max(1, Math.round(p.operatorSalary / 200)) : 23)

  return (
    <main className="flex flex-col gap-6">
      {/* Detached filters panel */}
      <section className="rounded-lg bg-neutral-800 border border-neutral-700 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Operator"
            placeholder="Select Operator"
            value={operator}
            options={operators.map((o) => ({ label: o, value: o }))}
            onChange={(v) => {
              setOperator(v || undefined)
            }}
          />
          <Select
            label="Game Type"
            placeholder="Select Game Type"
            value={gameType}
            options={gameTypes.map((g) => ({ label: g, value: g }))}
            onChange={(v) => setGameType(v || undefined)}
          />
          <Select
            label="Slate Name"
            placeholder="Select Slate Name"
            value={slateName}
            options={slateNames.map((s) => ({ label: s, value: s }))}
            onChange={(v) => setSlateName(v || undefined)}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-neutral-800 bg-neutral-800/60">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-neutral-800 text-gray-300">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Team</th>
                    <th className="px-4 py-3 font-semibold">Position</th>
                    <th className="px-4 py-3 font-semibold">Salary</th>
                    <th className="px-4 py-3 font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-gray-200">
                  {pagedPlayers.map((p) => {
                    const selected = selectedPlayer?.operatorPlayerId === p.operatorPlayerId
                    return (
                      <tr
                        key={(p as any).operatorSlatePlayerId ?? `${p.operatorPlayerId}`}
                        onClick={() => setSelectedPlayer(p)}
                        className={`${selected ? 'bg-[#8a8c16]' : 'hover:bg-neutral-800'} cursor-pointer`}
                      >
                        <td className="px-4 py-3">{p.operatorPlayerName || 'Player'}</td>
                        <td className="px-4 py-3">{p.teamAbbreviation ?? (p as any).team ?? '—'}</td>
                        <td className="px-4 py-3">{p.operatorPosition ?? '—'}</td>
                        <td className="px-4 py-3">${p.operatorSalary?.toLocaleString?.() ?? '—'}</td>
                        <td className="px-4 py-3">{pointsFor(p)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-neutral-800 px-4 py-3">
              <Pagination page={page} pageSize={PAGE_SIZE} total={players.length} onPageChange={setPage} />
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <PlayerCard player={selectedPlayer} />
        </div>
      </section>
    </main>
  )
}
