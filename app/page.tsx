"use client"

import React, { useMemo, useState } from 'react'
import { Select } from '@/components/Select'
import { PlayerCard, type Player } from '@/components/PlayerCard'
import { Pagination } from '@/components/Pagination'
import { getGameTypes, getOperators, getSlateNames, getSlates } from '@/lib/data'

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
    const [pageSize, setPageSize] = useState(8)

    React.useEffect(() => {
        // when players change, select first one and reset page
        setSelectedPlayer(players[0] ?? null)
        setPage(1)
    }, [players])

    const pagedPlayers = useMemo(() => {
        const start = (page - 1) * pageSize
        return players.slice(start, start + pageSize)
    }, [players, page, pageSize])

    // derived points helper used for Points column
    const pointsFor = (p: Player) => (p.operatorSalary ? Math.max(1, Math.round(p.operatorSalary / 200)) : 23)

    return (
        <main className="flex flex-col flex-1">
            {/* Top Section */}
            <section className="my-auto mx-auto w-full md:w-fit bg-[#2F2F2F] rounded-lg flex flex-col md:flex-row items-center justify-center gap-4 p-8 border border-[#2F2F2F]">
                <div className="w-full md:w-[245px]">
                    <Select
                        label="Operator"
                        placeholder="Select Operator"
                        value={operator}
                        options={operators.map((o) => ({ label: o, value: o }))}
                        onChange={(v) => setOperator(v || undefined)}
                    />
                </div>
                <div className="w-full md:w-[270px]">
                    <Select
                        label="Game Type"
                        placeholder="Select Game Type"
                        value={gameType}
                        options={gameTypes.map((g) => ({ label: g, value: g }))}
                        onChange={(v) => setGameType(v || undefined)}
                    />
                </div>
                <div className="w-full md:w-[270px]">
                    <Select
                        label="Slate Name"
                        placeholder="Select Slate Name"
                        value={slateName}
                        options={slateNames.map((s) => ({ label: s, value: s }))}
                        onChange={(v) => setSlateName(v || undefined)}
                    />
                </div>
            </section>

            <section className="flex flex-col md:flex-row w-full items-start justify-between gap-8">
                {/* Players */}
                <div className="h-[512px] flex-1 rounded-lg bg-[#2F2F2F] flex flex-col overflow-x-auto">
                    {/* Header + Rows container with min width to enable horizontal scroll on small screens */}
                    <div className="min-w-[560px]">
                        {/* Header */}
                        <div className="w-full h-[56px] bg-[#1D1D1D] rounded-t-lg flex items-center justify-between px-4 md:px-8 text-white text-base md:text-2xl">
                            <div className="w-[200px]">Name</div>
                            <div className="w-16 text-center">Team</div>
                            <div className="w-24 text-center">Position</div>
                            <div className="w-24 text-right">Salary</div>
                            <div className="w-[64px] text-right">Points</div>
                        </div>

                        {/* Rows */}
                        <div className="h-[400px] md:h-[400px] overflow-auto">
                            {pagedPlayers.map((p) => {
                                const playerKey = (p as any).operatorSlatePlayerId ?? `${p.operatorPlayerId}-${p.operatorSalary}`;
                                const selectedPlayerKey = selectedPlayer ? ((selectedPlayer as any).operatorSlatePlayerId ?? `${selectedPlayer.operatorPlayerId}-${selectedPlayer.operatorSalary}`) : null;
                                const selected = playerKey === selectedPlayerKey;
                                return (
                                    <div
                                        key={playerKey}
                                        onClick={() => setSelectedPlayer(p)}
                                        className={`w-full h-[50px] px-4 md:px-8 flex items-center justify-between cursor-pointer ${selected ? 'bg-[#807B0F]' : ''}`}
                                    >
                                        <div className="w-[200px] text-white text-base md:text-2xl">{p.operatorPlayerName || 'Player'}</div>
                                        <div className="w-16 text-white text-base md:text-2xl text-center">{p.teamAbbreviation ?? (p as any).team ?? '—'}</div>
                                        <div className="w-24 text-white text-base md:text-2xl text-center">{p.operatorPosition ?? '—'}</div>
                                        <div className="w-24 text-white text-base md:text-2xl text-right">${p.operatorSalary?.toLocaleString?.() ?? '—'}</div>
                                        <div className="w-[64px] text-white text-base md:text-2xl text-right">{pointsFor(p)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full h-[56px] bg-[#262626] flex items-center px-4 md:px-8">
                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            total={players.length}
                            onPageChange={(newPage) => {
                                setPage(newPage)
                                const firstIndex = (newPage - 1) * pageSize
                                setSelectedPlayer(players[firstIndex] ?? null)
                            }}
                            onPageSizeChange={(size) => {
                                if (size !== pageSize) {
                                    setPageSize(size)
                                    setPage(1)
                                    setSelectedPlayer(players[0] ?? null)
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Player Card */}
                <div className="h-[512px] w-full md:w-[400px] rounded-lg bg-[#1D1D1D] flex flex-col items-center">
                    <PlayerCard player={selectedPlayer} />
                </div>
            </section>
        </main>
    )
}
