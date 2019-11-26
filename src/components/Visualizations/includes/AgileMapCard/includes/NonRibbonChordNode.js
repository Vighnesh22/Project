import React from 'react'
import { withRouter } from 'react-router-dom'
import * as d3 from 'd3'


const NonRibbonChordNode = props => {
	const { history, data, index, radius, angle, isSelected, handleOnMouseEnter, handleOnMouseLeave } = props

	const { name, route, darkColor, lightColor } = data

	const circleScale = d3.scaleLinear().domain([0, 200]).range([2, 6])
	const textScale = isSelected ? d3.scaleLinear().domain([0, 200]).range([10, 16]) : d3.scaleLinear().domain([0, 200]).range([7, 12])


	const calcTextAttr = (x, y, index) => {
		if (angle(index) < Math.PI) {
			return {
				textX: x + 10,
				textY: y,
				scale: [1, 1],
				anchor: 'start',
				rotate: (angle(index)) * (180 / Math.PI) - 90
			}
		} else {
			return {
				textX: x - 2 * x - 10,
				textY: y - 2 * y,
				scale: [-1, -1],
				anchor: 'end',
				rotate: (angle(index)) * (180 / Math.PI) - 90
			}
		}
	}

	const calcCoordinates = index => {
		return {
			x: radius * Math.sin(angle(index)),
			y: - radius * Math.cos(angle(index))
		}
	}

	const handleOnClick = route => {
		if (route) {
			history.push('/frameworks/' + route)
		}
	}

	const { x, y } = calcCoordinates(index)
	const { textX, textY, scale, anchor, rotate } = calcTextAttr(x, y, index)

	return (
		<g
			onClick={() => handleOnClick(route)}
			onMouseEnter={() => handleOnMouseEnter(index)}
			onMouseLeave={handleOnMouseLeave}
		>
			<circle
				style={route ? { cursor: 'pointer' } : { cursor: 'default' }}
				cx={x}
				cy={y}
				r={circleScale(radius)}
				fill={isSelected || isSelected === undefined ? darkColor : lightColor}
			/>
			<text
				style={route ?
					{ fontSize: textScale(radius), cursor: 'pointer' } :
					{ fontSize: textScale(radius), cursor: 'default' }}
				x={textX}
				y={textY}
				dy='.35em'
				textAnchor={anchor}
				transform={`rotate(${rotate},${x}, ${y}) scale(${scale[0]},${scale[1]})`}
				fill={isSelected || isSelected === undefined ? 'black' : 'lightgray'}
				fontFamily='Raleway'
			>
				{name.length < 16 ? name : name.slice(0, 14).concat('...')}
			</text>
		</g>
	)

}

export default withRouter(NonRibbonChordNode)