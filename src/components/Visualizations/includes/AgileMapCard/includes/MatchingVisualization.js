import React from 'react'

import MatchingNode from './MatchingNode'
import MatchingLink from './MatchingLink'


const MatchingVisualization = props => {
	const { data, height, width } = props

	const [selectedNodes, setSelectedNodes] = React.useState([])

	const handleOnMouseEnterNode = id => {
		setSelectedNodes([id].concat(data.links.filter(link => link.frameworkId === id).map(node => node.agileId)
			.concat(data.links.filter(link => link.agileId === id).map(node => node.frameworkId))))
	}

	const handleOnMouseLeaveNode = () => {
		setSelectedNodes([])
	}

	return (
		<svg width='100%' height='100%' viewBox={`0 0 ${width} ${height}`}>
			{data.links.filter(link => !selectedNodes.includes(link.frameworkId) || !selectedNodes.includes(link.agileId))
				.concat(data.links.filter(link => selectedNodes.includes(link.frameworkId) && selectedNodes.includes(link.agileId)))
				.map((link, index) => {
					return (
						<MatchingLink
							key={index}
							data={link}
							isSelected={selectedNodes.length === 0 ? undefined : selectedNodes.includes(link.frameworkId) && selectedNodes.includes(link.agileId)}
						/>
					)
				})}
			{data.nodes.map((node, index) => {
				return (
					<MatchingNode
						key={index}
						data={node}
						x={node.x}
						y={node.y}
						route={node.route}
						anchor={node.type === 'agile' ? 'end' : 'start'}
						radius={Math.min((height / data.nodes.filter(node => node.type === 'framework').length / 2) - 3, (height / data.nodes.filter(node => node.type === 'agile').length / 2) - 3)}
						isSelected={selectedNodes.length === 0 ? undefined : selectedNodes.includes(node.id) ? true : false}
						handleOnMouseEnter={handleOnMouseEnterNode.bind(this, node.id)}
						handleOnMouseLeave={handleOnMouseLeaveNode.bind(this)}
					/>
				)
			})}

		</svg>
	)
}

export default MatchingVisualization