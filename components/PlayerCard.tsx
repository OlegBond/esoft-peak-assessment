import React from 'react'
import Image from 'next/image'

export type Player = {
    operatorPlayerId?: number | string
    operatorPlayerName?: string
    operatorPosition?: string
    operatorSalary?: number
    team?: string
    teamAbbreviation?: string
}

export function PlayerCard({ player }: { player: Player | null }) {
    if (!player) {
        return (
            <div className="rounded-lg bg-[#1D1D1D] h-full w-full flex items-center justify-center text-white/80">
                Select a player to see details
            </div>
        )
    }
    const title = player.operatorPlayerName ?? 'Player'

    // simple derived points (fallback): salary scaled; ensures a consistent number
    const points = player.operatorSalary ? Math.max(1, Math.round(player.operatorSalary / 200)) : 23

    return (
        <div className="flex flex-col items-center  w-full h-full bg-[#1D1D1D] rounded-lg overflow-hidden">
            <div className="w-full h-[301px] relative">
                <Image
                    src="/brady.png"
                    alt={title}
                    fill
                    priority
                />
            </div>
            <div className="w-full flex-1 bg-[#2F2F2F] rounded-t-lg flex flex-col items-center justify-start">
                <div className="w-full h-[72px] text-[32px] leading-[72px] text-white/80 text-center">{title}</div>
                <div className="w-full h-[172px] text-[128px] leading-[172px] text-white/80 text-center">{points}</div>
                <div className="w-full h-8 text-[16px] leading-4 text-white/80 text-center">Points</div>
            </div>
        </div>
    )
}
