import React from 'react'
import * as d3 from 'd3'

import NonRibbonChordNode from './NonRibbonChordNode'
import NonRibbonChordLink from './NonRibbonChordLink'


const NonRibbonChordVisualization = props => {
	const { data, height, width, radius } = props

	const [selectedNodes, setSelectedNodes] = React.useState([])

	const getAngle = data => d3.scaleLinear().domain([0, data.nodes.length]).range([0, 2 * Math.PI])

	const handleOnMouseEnterNode = index => {
		setSelectedNodes([index].concat(data.links.filter(link => link[0] === index).map(link => link[1])
			.concat(data.links.filter(link => link[1] === index).map(link => link[0]))))
	}

	const handleOnMouseLeaveNode = () => {
		setSelectedNodes([])
	}

	return (
		<svg width='100%' height='100%' viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}>
			<circle
				cx={0}
				cy={0}
				r={radius}
				fill='#E4E4E4'
			/>
			{data.links.filter(link => !selectedNodes.includes(link[0]) || !selectedNodes.includes(link[1]))
				.concat(data.links.filter(link => selectedNodes.includes(link[0]) && selectedNodes.includes(link[1])))
				.map((link, index) => {
					return (
						<NonRibbonChordLink
							key={index}
							data={link}
							radius={radius}
							angle={getAngle(data)}
							isSelected={selectedNodes.length === 0 ? undefined : selectedNodes.includes(link[0]) && selectedNodes.includes(link[1])}
						/>
					)
				})}
			{data.nodes.map((node, index) => {
				return (
					<NonRibbonChordNode
						key={index}
						index={index}
						data={node}
						radius={radius}
						angle={getAngle(data)}
						isSelected={selectedNodes.length === 0 ? undefined : selectedNodes.includes(index) ? true : false}
						handleOnMouseEnter={handleOnMouseEnterNode}
						handleOnMouseLeave={handleOnMouseLeaveNode}
					/>
				)
			})}
		</svg>
	)
}

export default NonRibbonChordVisualization