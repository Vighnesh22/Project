import React from 'react'
import * as d3 from 'd3'

import Node from './EvolutionMapNode'
import Link from './EvolutionMapLink'


const EvolutionMapVisualization = props => {
	const { data, outerHeight, outerWidth, innerHeight, innerWidth, verticalPadding, horizontalPadding } = props
	const { nodes, links } = data

	const [selectedNode, setSelectedNode] = React.useState(undefined)
	const [selectedNodes, setSelectedNodes] = React.useState([])

	const rectWidth = innerWidth => d3.scaleLinear().domain([0, 1680]).range([30, 70])(innerWidth)
	const rectHeight = innerWidth => d3.scaleLinear().domain([0, 1680]).range([10, 30])(innerWidth)

	const generateNodePositions = nodes => {
		const frameworks = nodes.map(version => version.framework)
		const uniqueFrameworks = frameworks.filter((v, i) => frameworks.indexOf(v) === i)

		const versionDateTimes = nodes.map(version => version.dateTime)
		const scaleX = d3.scaleLinear()
			.domain([Math.min(...versionDateTimes), Math.max(...versionDateTimes)])
			.range([0, innerWidth - rectWidth(innerWidth)])
		const scaleY = d3.scaleLinear()
			.domain([0, uniqueFrameworks.length - 1])
			.range([0, innerHeight - rectHeight(innerWidth)])

		let generatedNodes = []
		nodes.forEach((node, index) => {
			generatedNodes.push(node)
			generatedNodes[index].x = scaleX(node.dateTime)
			generatedNodes[index].y = scaleY(uniqueFrameworks.indexOf(node.framework))
		})

		return generatedNodes
	}

	const generatedNodes = generateNodePositions(nodes)

	const getPathToTarget = index => {
		let path = [index]
		const target = links.filter(link => !link.dashed).filter(link => link.source === index)

		if (target.length !== 0) {
			path = path.concat(getPathToTarget(target[0].target))
			return path
		} else {
			return [index]
		}
	}

	const getPathToSource = index => {
		let path = [index]
		const source = links.filter(link => !link.dashed).filter(link => link.target === index)

		if (source.length !== 0) {
			path = path.concat(getPathToSource(source[0].source))
			return path
		} else {
			return [index]
		}
	}

	const getPathOfNode = index => {
		const path = getPathToSource(index).concat(getPathToTarget(index))
		return path.slice(1, path.length)
	}

	const handleOnMouseEnterNode = index => {
		setSelectedNode(index)
		setSelectedNodes(getPathOfNode(index))
	}

	const handleOnMouseLeaveNode = () => {
		setSelectedNode(undefined)
		setSelectedNodes([])
	}

	const renderCoordinateSystem = numberOfLines => {
		const verticalLines = []

		for (let i = 0; i < numberOfLines; i++) {
			verticalLines.push({
				x1: (innerWidth / (numberOfLines + 1)) * (i + 1),
				y1: 0,
				x2: (innerWidth / (numberOfLines + 1)) * (i + 1),
				y2: innerHeight + verticalPadding / 2
			})
		}

		const nodeYears = generatedNodes.map(node => parseInt(node.year))
		const scaleYear = d3.scaleLinear()
			.domain([0 * 0.5, innerWidth * 0.9])
			.range([Math.min(...nodeYears), Math.max(...nodeYears)])

		return (
			<g>
				{verticalLines.map((line, index) => {
					return (
						<g key={index}>
							<line
								x1={line.x1}
								y1={line.y1}
								x2={line.x2}
								y2={line.y2}
								style={{
									stroke: 'lightgray',
									strokeWidth: 6,
									strokeDasharray: 30
								}}
							/>
							<text
								x={line.x2}
								y={line.y2 + 15}
								textAnchor='middle'
								alignmentBaseline='central'
								fill='black'
								fontSize={20}
								fontFamily='Raleway'
							>
								{Math.ceil(scaleYear(line.x1))}
							</text>
						</g>
					)
				})}
				<line
					x1={0}
					y1={innerHeight + verticalPadding / 2}
					x2={innerWidth}
					y2={innerHeight + verticalPadding / 2}
					style={{
						stroke: 'lightgray',
						strokeWidth: 6
					}}
					markerEnd='url(#marker_legend)'
				/>
			</g>
		)
	}

	const renderLinks = links => {
		return links.map((link, index) => (
			<Link
				key={index}
				x1={generatedNodes[link.source].x + rectWidth(innerWidth)}
				y1={generatedNodes[link.source].y + rectHeight(innerWidth) / 2}
				x2={generatedNodes[link.target].x}
				y2={generatedNodes[link.target].y + rectHeight(innerWidth) / 2}
				selected={selectedNodes.length === 0 || selectedNodes.includes(link.source) && selectedNodes.includes(link.target)}
				dashed={link.dashed}
			/>
		))
	}

	const renderNodes = () => {
		const allOtherNodes = generatedNodes.filter(node => node.index !== selectedNode).map(node => {
			return (
				<Node
					key={node.index}
					index={node.index}
					name={node.name}
					year={node.year}
					x={node.x}
					y={node.y}
					color={{ light: node.lightColor, dark: node.darkColor }}
					rectWidth={rectWidth(innerWidth)}
					rectHeight={rectHeight(innerWidth)}
					selected={selectedNodes.length === 0 ? undefined : selectedNodes.includes(node.index)}
					handleOnMouseEnter={handleOnMouseEnterNode}
					handleOnMouseLeave={handleOnMouseLeaveNode}
					route={node.route}
				/>
			)
		})

		if (selectedNode !== undefined) {
			const selected = generatedNodes[selectedNode]

			const selectedNodeElement = (
				<Node
					key={selected.index}
					index={selected.index}
					name={selected.name}
					year={selected.year}
					x={selected.x}
					y={selected.y}
					color={{ light: selected.lightColor, dark: selected.darkColor }}
					rectWidth={rectWidth(innerWidth)}
					rectHeight={rectHeight(innerWidth)}
					selected={selectedNodes.length === 0 ? undefined : selectedNodes.includes(selected.index)}
					handleOnMouseEnter={handleOnMouseEnterNode}
					handleOnMouseLeave={handleOnMouseLeaveNode}
					route={selected.route}
				/>
			)
			return allOtherNodes.concat([selectedNodeElement])
		}
		return allOtherNodes
	}

	return (
		<svg width={outerWidth} height={outerHeight}>
			<defs>
				<marker
					id='marker_arrow'
					markerHeight='5'
					markerWidth='5'
					markerUnits='strokeWidth'
					orient='auto'
					refX='4'
					refY='0'
					viewBox='-5 -5 10 10'
				>
					<path d='M 0,0 m -5,-5 L 5,0 L -5,5 Z' fill='black' />
				</marker>
				<marker
					id='marker_legend'
					markerHeight='5'
					markerWidth='5'
					markerUnits='strokeWidth'
					orient='auto'
					refX='0'
					refY='0'
					viewBox='-5 -5 10 10'
				>
					<path d='M 0,0 m -5,-5 L 5,0 L -5,5 Z' fill='lightgray' />
				</marker>
				<filter id='node-shadow' height='130%'>
					<feDropShadow id='node-shadow' dx='-2' dy='2' stdDeviation='2' floodColor='darkgray' floodOpacity='0.9' />
				</filter>
			</defs>

			<g transform={`translate(${horizontalPadding / 2}, 5)`}>
				{renderCoordinateSystem(4)}
				{renderLinks(links)}
				{renderNodes()}
			</g>

		</svg>
	)
}

export default EvolutionMapVisualization
