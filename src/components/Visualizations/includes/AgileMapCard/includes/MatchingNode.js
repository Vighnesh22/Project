import React from 'react'
import { withRouter } from 'react-router-dom'


const MatchingNode = props => {
	const { history, data, isSelected, x, y, radius, anchor, handleOnMouseEnter, handleOnMouseLeave } = props

	const handleOnClick = data => {
		if (data.type === 'framework') {
			history.push('/frameworks/' + data.route)
		}
	}

	const splitText = () => {
		let indicesWhitespace = []
		data.name.split('').forEach((character, index) => {
			if (character === ' ') indicesWhitespace.push(index)
		})

		let middle = data.name.length / 2
		if (indicesWhitespace.length !== 0) {
			let distance = 999
			let seperateAt = undefined
			indicesWhitespace.forEach(index => {
				if (distance > Math.abs(middle - index)) {
					distance = Math.abs(middle - index)
					seperateAt = index
				}
			})

			return [data.name.slice(0, seperateAt), data.name.slice(seperateAt + 1)]
		} else {
			return [data.name.slice(0, middle) + '-', data.name.slice(middle + 1)]
		}
	}

	return (
		<g
			onClick={() => handleOnClick(data)}
			onMouseEnter={() => handleOnMouseEnter()}
			onMouseLeave={handleOnMouseLeave}
		>
			<circle
				style={{ cursor: data.type === 'framework' ? 'pointer' : 'default' }}

				cx={x}
				cy={y}
				r={radius}
				fill={isSelected === undefined || isSelected ? data.darkColor : data.lightColor}
			/>
			<text
				style={{
					fontSize: isSelected ? 15 : 13,
					cursor: data.type === 'framework' ? 'pointer' : 'default'
				}}
				x={x + (anchor === 'end' ? -1 : 1) * (radius + 5)}
				y={y}
				dy='.35em'
				textAnchor={anchor}
				fill={isSelected === undefined || isSelected ? 'darkgray' : 'lightgray'}
				fontFamily='Raleway'
			>
				{data.type === 'framework' ?
					splitText().map((line, index) => {
						return (
							<tspan
								key={index}
								x={x + (anchor === 'end' ? -1 : 1) * (radius + 5)}
								dy={index * 17}
							>
								{line}
							</tspan>
						)
					})
					:
					data.name
				}
			</text>
		</g>
	)
}

export default withRouter(MatchingNode)




