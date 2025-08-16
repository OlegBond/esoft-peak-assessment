import raw from '../data.json'
import type { DfsSlate } from './types'

// The dataset is large; we only pick the fields we need for the UI.
export const slates: DfsSlate[] = (raw as any[]).map((s: any) => ({
  slateId: s.slateId ?? s.SlateId ?? 0,
  operator: s.operator ?? s.Operator ?? 'Unknown',
  operatorGameType: s.operatorGameType ?? s.OperatorGameType ?? 'Unknown',
  operatorName: s.operatorName ?? s.OperatorName ?? 'Unknown',
  dfsSlatePlayers: s.dfsSlatePlayers ?? s.DfsSlatePlayers ?? s.operatorSlatePlayers ?? s.OperatorSlatePlayers ?? [],
}))

export function getOperators(): string[] {
  return Array.from(new Set(slates.map((s) => s.operator).filter(Boolean))) as string[]
}

export function getGameTypes(operator?: string): string[] {
  return Array.from(
    new Set(slates.filter((s) => (!operator ? true : s.operator === operator)).map((s) => s.operatorGameType).filter(Boolean)),
  ) as string[]
}

export function getSlateNames(operator?: string, gameType?: string): string[] {
  return Array.from(
    new Set(
      slates
        .filter((s) => (!operator ? true : s.operator === operator))
        .filter((s) => (!gameType ? true : s.operatorGameType === gameType))
        .map((s) => s.operatorName)
        .filter(Boolean),
    ),
  ) as string[]
}

export function getSlates(operator?: string, gameType?: string, slateName?: string): DfsSlate[] {
  return slates
    .filter((s) => (!operator ? true : s.operator === operator))
    .filter((s) => (!gameType ? true : s.operatorGameType === gameType))
    .filter((s) => (!slateName ? true : s.operatorName === slateName))
}
