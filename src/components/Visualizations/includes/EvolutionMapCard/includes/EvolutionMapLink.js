import React from 'react'


const EvolutionMapLink = props => {
	const { x1, y1, x2, y2, selected, dashed } = props

	const style = { stroke: 'black', strokeWidth: 3, strokeDasharray: dashed ? 8 : 0 }

	return (
		<line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			style={{
				stroke: style.stroke,
				strokeWidth: style.strokeWidth,
				strokeDasharray: style.strokeDasharray
			}}
			opacity={selected === undefined || selected ? 0.9 : 0.2}
			markerEnd='url(#marker_arrow)'
		/>
	)
}

export default EvolutionMapLink