interface ConfidenceMeterProps {
  value: number
}

export function ConfidenceMeter({ value }: ConfidenceMeterProps) {
  const pct = Math.round(value * 100)

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs">Confidence</span>
      <div className="w-12 h-1 bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-600 text-xs">{pct}%</span>
    </div>
  )
}
