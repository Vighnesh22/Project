import React from 'react'
import { withRouter } from 'react-router-dom'
import * as d3 from 'd3'


const EvolutionMapNode = props => {
	const { history, x, y, selected, rectWidth, rectHeight, index, route, color, name, year, handleOnMouseEnter, handleOnMouseLeave } = props

	const calcFontSize = (size, rectWidth) => size === 'big' ? d3.scaleLinear().domain([0, rectWidth]).range([1, 12]) : d3.scaleLinear().domain([0, rectWidth]).range([1, 10])
	const style = { rx: 3, ry: 3, strokeWidth: 2 }

	const handleOnClick = route => {
		if (route) {
			history.push('/frameworks/' + route)
		}
	}

	return (
		<g
			style={{ cursor: 'pointer' }}
			opacity={selected === undefined || selected ? 1 : 0.5}
			onClick={() => handleOnClick(route)}
			onMouseEnter={() => handleOnMouseEnter(index)}
			onMouseLeave={handleOnMouseLeave}
		>
			<rect
				width={rectWidth}
				height={rectHeight}
				style={{
					fill: color.light,
					stroke: color.dark,
					strokeWidth: style.strokeWidth,
					rx: style.rx,
					ry: style.ry
				}}
				x={x}
				y={y}
				filter='url(#node-shadow)'
			/>

			<text
				x={x + rectWidth / 2}
				y={y + rectHeight / 2 - calcFontSize('small', rectWidth)(rectWidth) / 2}
				textAnchor='middle'
				alignmentBaseline='central'
				fontSize={calcFontSize('big', rectWidth)(rectWidth)}
				fontFamily='Raleway'
			>
				{name}
			</text>

			<text
				x={x + rectWidth / 2}
				y={y + rectHeight / 2 + calcFontSize('small', rectWidth)(rectWidth) / 2}
				textAnchor='middle'
				alignmentBaseline='central'
				fill='black'
				fontSize={calcFontSize('small', rectWidth)(rectWidth)}
				fontFamily='Raleway'
			>
				{year}
			</text>
		</g>
	)
}

export default withRouter(EvolutionMapNode)