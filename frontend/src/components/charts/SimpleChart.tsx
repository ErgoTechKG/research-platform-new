import { useMemo } from 'react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
    backgroundColor?: string
  }[]
}

interface SimpleChartProps {
  data: ChartData
  type?: 'line' | 'bar' | 'area'
  height?: number
  width?: number
  showLegend?: boolean
  showGrid?: boolean
  animate?: boolean
}

export function SimpleChart({ 
  data, 
  type = 'line', 
  height = 200, 
  width = 400, 
  showLegend = true, 
  showGrid = true,
  animate = false 
}: SimpleChartProps) {
  const { maxValue, minValue, chartPoints } = useMemo(() => {
    const allValues = data.datasets.flatMap(d => d.data)
    const max = Math.max(...allValues)
    const min = Math.min(...allValues)
    
    const points = data.datasets.map(dataset => 
      dataset.data.map((value, i) => ({
        x: (i * width) / (data.labels.length - 1),
        y: height - ((value - min) / (max - min)) * height,
        value
      }))
    )
    
    return { maxValue: max, minValue: min, chartPoints: points }
  }, [data, width, height])

  const renderGridLines = () => {
    if (!showGrid) return null
    
    return (
      <g className="grid-lines">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={height * ratio}
            x2={width}
            y2={height * ratio}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Vertical grid lines */}
        {data.labels.map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(i * width) / (data.labels.length - 1)}
            y1="0"
            x2={(i * width) / (data.labels.length - 1)}
            y2={height}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        ))}
      </g>
    )
  }

  const renderLineChart = () => {
    return data.datasets.map((dataset, datasetIndex) => {
      const points = chartPoints[datasetIndex]
      
      return (
        <g key={datasetIndex}>
          {/* Area fill for area chart */}
          {type === 'area' && (
            <path
              d={`M 0,${height} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${width},${height} Z`}
              fill={dataset.backgroundColor || dataset.color}
              fillOpacity="0.3"
            />
          )}
          
          {/* Line */}
          <polyline
            fill="none"
            stroke={dataset.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            className={animate ? 'animate-draw-line' : ''}
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={dataset.color}
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              />
              {/* Tooltip on hover */}
              <title>{`${dataset.label}: ${point.value}`}</title>
            </g>
          ))}
        </g>
      )
    })
  }

  const renderBarChart = () => {
    const barWidth = (width / data.labels.length) * 0.6
    const groupWidth = barWidth / data.datasets.length
    
    return data.datasets.map((dataset, datasetIndex) => {
      const points = chartPoints[datasetIndex]
      
      return (
        <g key={datasetIndex}>
          {points.map((point, i) => {
            const barHeight = height - point.y
            const x = (i * width) / data.labels.length + (datasetIndex * groupWidth) + (width / data.labels.length - barWidth) / 2
            
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={point.y}
                  width={groupWidth}
                  height={barHeight}
                  fill={dataset.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                <title>{`${dataset.label}: ${point.value}`}</title>
              </g>
            )
          })}
        </g>
      )
    })
  }

  return (
    <div className="chart-container">
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        className="border rounded-lg bg-white"
      >
        {renderGridLines()}
        {type === 'bar' ? renderBarChart() : renderLineChart()}
        
        {/* Y-axis labels */}
        {showGrid && (
          <g className="axis-labels">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const value = minValue + (maxValue - minValue) * (1 - ratio)
              return (
                <text
                  key={i}
                  x="-5"
                  y={height * ratio + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="#666"
                >
                  {Math.round(value)}
                </text>
              )
            })}
          </g>
        )}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-600 px-1">
        {data.labels.map((label, i) => (
          <span key={i} className="text-center">{label}</span>
        ))}
      </div>
      
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: dataset.color }}
              />
              <span className="text-sm text-gray-700">{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .animate-draw-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw 2s ease-in-out forwards;
        }
        
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default SimpleChart