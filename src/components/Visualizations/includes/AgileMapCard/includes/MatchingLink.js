import React from 'react'


const MatchingLink = props => {
	const { data, isSelected } = props
	
	return (
		<line
			x1={data.startX}
			y1={data.startY}
			x2={data.endX}
			y2={data.endY}
			stroke={isSelected || isSelected === undefined ? '#8e8e8e' : '#cccccc'}
			strokeWidth={isSelected ? 4 : 2}
			strokeOpacity={isSelected ? 0.8 : 0.4}
		/>
	)
}

export default MatchingLink