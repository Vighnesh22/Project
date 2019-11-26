import React from 'react'
import * as d3 from 'd3'


const NonRibbonChordLink = props => {
	const { data, radius, angle, isSelected } = props

	const curvedLine = d3.line()
		.curve(d3.curveBundle.beta(0.5))
		.x(d => {
			return d !== undefined ? radius * Math.sin(angle(d)) : 0
		})
		.y(d => {
			return d !== undefined ? - radius * Math.cos(angle(d)) : 0
		})

	return (
		<path
			stroke={isSelected || isSelected === undefined ? '#8e8e8e' : '#cccccc'}
			strokeWidth={isSelected ? 4 : 2}
			fill='none'
			strokeOpacity={isSelected ? 0.8 : 0.4}
			d={curvedLine([data[0], undefined, data[1]])}
		/>
	)

}

export default NonRibbonChordLink