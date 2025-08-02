import { useMemo } from 'react'

interface GaugeChartProps {
  value: number
  max: number
  min?: number
  size?: number
  thickness?: number
  color?: string
  backgroundColor?: string
  label?: string
  unit?: string
  showValue?: boolean
  thresholds?: {
    low: { value: number; color: string }
    medium: { value: number; color: string }
    high: { value: number; color: string }
  }
}

export function GaugeChart({
  value,
  max,
  min = 0,
  size = 120,
  thickness = 12,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  label,
  unit = '',
  showValue = true,
  thresholds
}: GaugeChartProps) {
  const { percentage, strokeColor, circumference } = useMemo(() => {
    const range = max - min
    const currentValue = Math.max(min, Math.min(max, value))
    const pct = ((currentValue - min) / range) * 100
    
    let currentColor = color
    if (thresholds) {
      if (currentValue >= thresholds.high.value) {
        currentColor = thresholds.high.color
      } else if (currentValue >= thresholds.medium.value) {
        currentColor = thresholds.medium.color
      } else {
        currentColor = thresholds.low.color
      }
    }
    
    const radius = (size - thickness) / 2
    const circ = 2 * Math.PI * radius
    
    return {
      percentage: pct,
      strokeColor: currentColor,
      circumference: circ
    }
  }, [value, max, min, color, thresholds, size, thickness])

  const radius = (size - thickness) / 2
  const center = size / 2
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="gauge-chart flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Threshold markers */}
          {thresholds && (
            <g>
              {Object.entries(thresholds).map(([key, threshold]) => {
                const thresholdPercentage = ((threshold.value - min) / (max - min)) * 100
                const angle = (thresholdPercentage / 100) * 360 - 90
                const markerRadius = radius + thickness / 2
                const markerX = center + markerRadius * Math.cos(angle * Math.PI / 180)
                const markerY = center + markerRadius * Math.sin(angle * Math.PI / 180)
                
                return (
                  <circle
                    key={key}
                    cx={markerX}
                    cy={markerY}
                    r="2"
                    fill={threshold.color}
                  />
                )
              })}
            </g>
          )}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: strokeColor }}>
                {typeof value === 'number' ? value.toFixed(1) : value}
                {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
              </div>
              <div className="text-xs text-gray-500">
                {percentage.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
      
      {label && (
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-gray-700">{label}</div>
          <div className="text-xs text-gray-500">
            {min} - {max} {unit}
          </div>
        </div>
      )}
      
      {/* Threshold legend */}
      {thresholds && (
        <div className="flex gap-3 mt-2 text-xs">
          {Object.entries(thresholds).map(([key, threshold]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: threshold.color }}
              />
              <span className="text-gray-600">
                {key}: {threshold.value}{unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GaugeChart