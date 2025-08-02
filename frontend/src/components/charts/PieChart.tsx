import { useMemo } from 'react'

interface PieChartData {
  label: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieChartData[]
  size?: number
  showLabels?: boolean
  showLegend?: boolean
  centerText?: string
  animate?: boolean
}

export function PieChart({ 
  data, 
  size = 200, 
  showLabels = true, 
  showLegend = true, 
  centerText,
  animate = false 
}: PieChartProps) {
  const { total, segments } = useMemo(() => {
    const totalValue = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativeAngle = 0
    
    const segmentData = data.map((item) => {
      const percentage = (item.value / totalValue) * 100
      const angle = (item.value / totalValue) * 360
      const startAngle = cumulativeAngle
      const endAngle = cumulativeAngle + angle
      
      cumulativeAngle += angle
      
      // Calculate path for the arc
      const radius = size / 2 - 10
      const centerX = size / 2
      const centerY = size / 2
      
      const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180)
      const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180)
      const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180)
      const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180)
      
      const largeArcFlag = angle > 180 ? 1 : 0
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z'
      ].join(' ')
      
      // Calculate label position
      const labelAngle = (startAngle + endAngle) / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos((labelAngle - 90) * Math.PI / 180)
      const labelY = centerY + labelRadius * Math.sin((labelAngle - 90) * Math.PI / 180)
      
      return {
        ...item,
        percentage,
        angle,
        startAngle,
        endAngle,
        pathData,
        labelX,
        labelY
      }
    })
    
    return { total: totalValue, segments: segmentData }
  }, [data, size])

  return (
    <div className="pie-chart-container flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-sm">
          {/* Pie segments */}
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{
                  transformOrigin: `${size/2}px ${size/2}px`,
                  animation: animate ? `pie-grow 0.8s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <title>{`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}</title>
              </path>
              
              {/* Labels */}
              {showLabels && segment.percentage > 5 && (
                <text
                  x={segment.labelX}
                  y={segment.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
          
          {/* Center text */}
          {centerText && (
            <text
              x={size / 2}
              y={size / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#374151"
            >
              {centerText}
            </text>
          )}
        </svg>
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 gap-2 mt-4 max-w-sm">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: segment.color }}
              />
              <span className="flex-1 truncate">{segment.label}</span>
              <span className="font-medium">{segment.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes pie-grow {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default PieChart