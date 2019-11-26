import React from 'react'

import { fade, useTheme } from '@material-ui/core/styles'

import { GET_ENTITY_COLOR } from '../../../config'


const PatternVisualization = props => {
	const { displayDynamic, positionData, linkData, height, width, nodeRadius, hovered, searched, onPath, selectedItem, handleNodeEnter, handleNodeLeave, handleNodeClick } = props

	const theme = useTheme()

	return (
		<svg viewBox={`0 -30 ${width} ${height + 70}`}>
			{displayDynamic && positionData.map(level => level.entities.map((entity, index) => {
				const padding = 50
				return (
					<g key={index}>
						<filter id='entity-shadow' height='130%'>
							<feDropShadow id='entity-shadow' dx='5' dy='5' stdDeviation='4' floodColor='darkgray' floodOpacity='0.4' />
						</filter>
						<rect x={entity.startX + (padding || 0) / 2} y={entity.startY + (padding || 0) / 2} width={entity.width - (padding || 0)} height={entity.height - (padding || 0)} fill='#f0f0f0' rx={5} ry={5} filter='url(#entity-shadow)' />
						<text x={entity.startX + (padding || 0) / 2} y={entity.startY + (padding || 0) / 3} fontFamily='Raleway' fontSize={nodeRadius * 1.2}>{entity.entityName}</text>
					</g>
				)
			}))}

			{displayDynamic && positionData.map(level => level.entities.map(entity => entity.categories.map((category, index) => {
				const rx = 5
				const ry = 5
				if (category.categoryName !== 'all') {
					return (
						<g key={index}>
							<rect key={index} x={category.startX} y={category.startY} width={category.width} height={category.height} style={{ stroke: '#bfbfbf', strokeWidth: 2, fillOpacity: 0 }} rx={rx} ry={ry} />
							<text x={category.startX + category.width / 2} y={category.startY - 5} textAnchor='middle' fontFamily='Raleway' fontSize={nodeRadius * 0.8}>{category.categoryName}</text>
						</g>
					)
				}
			})))}

			{linkData.map((link, index) => {
				const highlighted = onPath.length === 0 || (onPath.includes(link[0].identifier) && onPath.includes(link[1].identifier))
				return (
					<g key={index}>
						<defs>
							<marker
								id='pattern_arrow'
								markerHeight={nodeRadius / 2}
								markerWidth={nodeRadius / 2}
								markerUnits='strokeWidth'
								orient='auto'
								refX={5 + nodeRadius / 2}
								viewBox='-5 -5 10 10'
							>
								<path d='M 0,0 m -5,-5 L 5,0 L -5,5 Z' fill='gray' />
							</marker>
						</defs>

						<line
							x1={link[0].startX}
							y1={link[0].startY}
							x2={link[1].startX}
							y2={link[1].startY}
							style={onPath.length === 0 && displayDynamic ? { stroke: fade('#9c9c9c', 0.3), strokeWidth: 1 } : highlighted || !displayDynamic ? { stroke: '#9c9c9c', strokeWidth: 2 } : { stroke: fade('#9c9c9c', 0.2), strokeWidth: 1 }}
							markerEnd={(onPath.includes(link[0].identifier) && onPath.includes(link[1].identifier)) || !displayDynamic ? 'url(#pattern_arrow)' : ''}
						/>
					</g>
				)
			})}

			{positionData.map(level => level.entities.map(entity => entity.categories.map(category => category.data.map((item, index) => {
				const highlighted = searched.length === 0 ? onPath.length === 0 || onPath.includes(item.identifier) : searched.includes(item.identifier) || onPath.includes(item.identifier)
				return (
					<g
						key={index}
						onMouseEnter={() => handleNodeEnter && handleNodeEnter(item.identifier)}
						onMouseLeave={handleNodeLeave && handleNodeLeave}
						onClick={() => handleNodeClick(item, entity.entityName)}
						style={{ cursor: 'pointer' }}
					>
						<circle
							cx={item.startX}
							cy={item.startY}
							r={nodeRadius}
							fill={highlighted ? GET_ENTITY_COLOR(entity.entityName) : fade(GET_ENTITY_COLOR(entity.entityName), 0.2)}
							stroke={searched.includes(item.identifier) || selectedItem === item.identifier ? theme.palette.primary.main : 'none'}
							strokeWidth={selectedItem === item.identifier ? 7 : 4}
						/>
						<text x={item.startX} y={item.startY} textAnchor='middle' alignmentBaseline='central' fontFamily='Raleway' fontSize={nodeRadius * 0.7} fill='white'>{item.identifier}</text>
					</g>
				)
			}))))}

			{positionData.map(level => level.entities.map(entity => entity.categories.map(category => category.data.map((item, index) => {
				const maxCharactersInRow = 30
				let words = item.name.split(' ')
				let textLines = []
				while (words.length !== 0) {

					let line = []
					while (line.length <= maxCharactersInRow && words.length !== 0) {
						if (line.length + words[0].length <= maxCharactersInRow) {
							const word = words.shift()
							line += line.length !== 0 ? ' ' + word : word
						} else {
							break
						}
					}
					textLines.push(line)
				}

				const mirrorHorizontally = item.startX > width - 300
				const mirrorVertically = item.startY < 200

				return (
					<g key={index} visibility={hovered === item.identifier ? 'visible' : 'hidden'} filter='url(#tooltip-shadow)'>
						<filter id='tooltip-shadow' height='130%'>
							<feDropShadow id='tooltip-shadow' dx='3' dy='3' stdDeviation='2' floodColor='darkgray' floodOpacity='0.4' />
						</filter>
						<path fill='#fafafa' transform={`translate(${item.startX - (mirrorHorizontally ? -18 : 12)}, ${item.startY - (mirrorVertically ? -170 : 170)}) scale(11, 7) scale(${mirrorHorizontally ? -1 : 1}, ${mirrorVertically ? -1 : 1})`} d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
						<text fontFamily='Raleway' fontSize={nodeRadius * 0.7} textAnchor='middle'>
							{textLines.map((line, index) => {
								return (
									<tspan key={index} x={item.startX + (mirrorHorizontally ? -116 : 120)} y={item.startY - (mirrorVertically ? -65 : 135) + index * 20 + (5 - textLines.length) * 10}>
										{line}
									</tspan>
								)
							})}
						</text>
					</g>
				)
			}))))}
		</svg>
	)
}

export default PatternVisualization
