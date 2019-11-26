import React from 'react'
import { Helmet } from 'react-helmet';
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import FullscreenIcon from '@material-ui/icons/FullscreenRounded'
import RotateIcon from '@material-ui/icons/ScreenRotationRounded'

import AgileMapCard from './includes/AgileMapCard/AgileMapCard'
import EvolutionMapCard from './includes/EvolutionMapCard/EvolutionMapCard'
import FullScreenDialog from './includes/AgileMapCard/includes/FullScreenDialog'
import FloatingButton from '../FloatingButton'
import { Typography } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	cardsContainer: {
		marginTop: theme.spacing(10),
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
	},
	rotateArea: {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		textAlign: 'center'
	}
}))

const VisualizationsList = props => {
	const { history, matchingData, frameworksData, frameworkVersionsData } = props

	const classes = useStyles()

	const [numberOfColumns, setNumberOfColumns] = React.useState(window.innerWidth > changeAtWidth ? 2 : 1)
	const [selectedVisualization, setSelectedVisualization] = React.useState()
	const [openFullSizeDialog, setOpenFullSizeDialog] = React.useState(false)
	const [isPortraitMode, setIsPortraitMode] = React.useState(window.innerWidth < window.innerHeight && window.innerWidth < 960)

	const changeAtWidth = 900
	const cardHeights = { agileMap: 700, evolutionMap: 800 }
	const evolutionMapTitles = ['Evolution Map']
	const agileMapTitles = ['Agile Methods', 'Agile Activities', 'Agile Principles', 'Agile Artifacts']

	React.useEffect(() => {
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleFullscreenDialogOpen = index => {
		setSelectedVisualization(index)
		setOpenFullSizeDialog(true)
	}
	const handleFullscreenDialogClose = () => {
		setOpenFullSizeDialog(false)
	}

	const generateAgileMapData = (data, element) => {
		const agileObject = (element.charAt(0).toLowerCase() + element.substr(1)).replace(/ /g, '')

		let agileObjects = []
		let frameworks = []
		data.forEach(framework => {
			frameworks.push({
				type: 'Framework',
				name: framework.name,
				route: framework.name,
				darkColor: '#7BADD3',
				lightColor: '#c6e6ff'
			})
			framework[agileObject].forEach(object => {
				agileObjects.push(object)
			})
		})

		agileObjects = agileObjects.filter((v, i) => agileObjects.indexOf(v) === i)


		let links = []
		data.forEach((framework, index) => {
			framework[agileObject].forEach(object => {
				links.push([index, agileObjects.indexOf(object)])
			})
		})
		links = links.map(link => [link[0], link[1] + frameworks.length])

		agileObjects = agileObjects.map(object => {
			return {
				type: agileObject,
				name: object,
				route: undefined,
				darkColor: '#FFB279',
				lightColor: '#ffe2cc'
			}
		})

		return {
			nodes: frameworks.concat(agileObjects),
			links: links
		}
	}

	const generateEvolutionMapData = data => {
		data.sort((a, b) => a.dateTime < b.dateTime ? -1 : a.dateTime > b.dateTime ? 1 : 0)
		const versionSupersedes = data.flatMap(version => version.supersededBy)
		let nodes = []
		data.forEach((version, index) => {
			nodes.push(version)
			if (version.supersededBy.length === 0) {
				nodes[index].lightColor = '#e8e6df'
				nodes[index].darkColor = '#c6c5be'
			} else if (versionSupersedes.includes(version.name)) {
				nodes[index].lightColor = '#c8dbef'
				nodes[index].darkColor = '#abbcce'
			} else if (!version.furtherDevelopment) {
				nodes[index].lightColor = '#e5b9ac'
				nodes[index].darkColor = '#b79489'
			} else {
				nodes[index].lightColor = '#c3c7a7'
				nodes[index].darkColor = '#9da086'
			}

			nodes[index].index = index
		})

		let links = []
		nodes.forEach((version, index) => {
			version.supersededBy.forEach(supersede => {
				const supersedeIndex = nodes.findIndex(v => {
					return supersede === v.name
				})
				if (supersedeIndex > -1) {
					links.push({
						source: supersedeIndex,
						target: index,
						dashed: false
					})
				}
			})
			version.influencedBy.forEach(influencer => {
				const influencerIndex = nodes.findIndex(v => {
					return influencer === v.name
				})
				if (influencerIndex > -1) {
					links.push({
						source: influencerIndex,
						target: index,
						dashed: true
					})
				}
			})
		})

		return { nodes: nodes, links: links }
	}

	const generateMatchingData = (data, description) => {
		const paddingY = 30
		const agileData = data.filter(element => element.description === description)[0].data
		const frameworks = agileData.flatMap(element => element.frameworks)
		let uniqueFrameworks = []
		const map = new Map()
		for (const framework of frameworks) {
			if (!map.has(framework.id)) {
				map.set(framework.id, true)
				uniqueFrameworks.push({ id: framework.id, name: framework.name })
			}
		}

		const frameworkNodes = uniqueFrameworks.map((framework, index) => {
			return {
				type: 'framework',
				id: framework.id,
				name: framework.name,
				route: framework.name,
				x: (window.innerWidth / numberOfColumns) / 9 * 7,
				y: (cardHeights.agileMap * 0.8 - paddingY) / uniqueFrameworks.length * index + paddingY / 2,
				darkColor: '#7BADD3',
				lightColor: '#c6e6ff'
			}
		})

		let agileNodes = []
		let links = []

		agileData.forEach((element, index) => {
			const x = (window.innerWidth / numberOfColumns) / 9 * 5
			const y = (cardHeights.agileMap * 0.8 - paddingY) / agileData.length * index + paddingY / 2
			agileNodes.push({
				type: 'agile',
				id: element.id,
				name: element.name,
				x: x,
				y: y,
				darkColor: '#FFB279',
				lightColor: '#ffe2cc'
			})

			element.frameworks.forEach(framework => {
				links.push({
					agileId: element.id,
					frameworkId: framework.id,
					startX: frameworkNodes.filter(frameworkNode => frameworkNode.id === framework.id)[0].x,
					endX: x,
					startY: frameworkNodes.filter(frameworkNode => frameworkNode.id === framework.id)[0].y,
					endY: y
				})
			})
		})

		return { nodes: frameworkNodes.concat(agileNodes), links: links }
	}

	const generatedMatchingData = agileMapTitles.map(element => generateMatchingData(matchingData, element))
	const agileMapData = agileMapTitles.map(element => generateAgileMapData(frameworksData, element))
	const evolutionMapData = generateEvolutionMapData(frameworkVersionsData)


	const updateNumberOfColumns = () => {
		setNumberOfColumns(window.innerWidth > changeAtWidth ? 2 : 1)
	}

	const handleResize = () => {
		updateNumberOfColumns()
		setIsPortraitMode(window.innerWidth < window.innerHeight && window.innerWidth < 960)
	}

	if (isPortraitMode) {
		return (
			<div className={classes.root}>
				<Grid className={classes.rotateArea} container direction='column' justify='center' alignItems='center'>
					<Grid item xs={12}>
						<RotateIcon fontSize='large' color='primary'/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant='h4' component='p'>Rotate your screen to view visualizations.</Typography>
					</Grid>
				</Grid>
			</div>
		)
	}

	return (
		<div className={classes.root}>
			<Helmet>
          <title>Graphical representation of the history of agile frameworks</title>
          <meta name="description" content="Representation using pie charts" />
          <meta name="theme-color" content="#008f68" />
          <meta name="keywords" content="xxxxxxxxxxxx" />
        </Helmet>
			<Grid container spacing={7} direction='column' justify='center' alignItems='center' className={classes.cardsContainer}>
				<Grid item container spacing={7} direction='row' justify='space-evenly' alignItems='center'>
					{evolutionMapTitles.map((title, index) => (
						<Grid key={index} item xs={12}>
							<EvolutionMapCard
								width={window.innerWidth}
								height={cardHeights.evolutionMap}
								title={title}
								data={evolutionMapData}
								handleFullscreenDialogOpen={() => handleFullscreenDialogOpen(index)}
							/>
						</Grid>
					))}
				</Grid>
				<Grid item container spacing={7} direction='row' justify='space-evenly' alignItems='center'>
					{agileMapTitles.map((element, index) => (
						<Grid key={index} item xs={12} md={6}>
							<AgileMapCard
								width={window.innerWidth / numberOfColumns}
								height={cardHeights.agileMap}
								title={element}
								chordData={agileMapData[index]}
								matchingData={generatedMatchingData[index]}
								handleFullscreenDialogOpen={() => handleFullscreenDialogOpen(index + evolutionMapTitles.length)}
							/>
						</Grid>
					))}
				</Grid>
			</Grid>
			<FullScreenDialog
				selected={selectedVisualization}
				setSelected={setSelectedVisualization}
				tabTitles={evolutionMapTitles.concat(agileMapTitles)}
				open={openFullSizeDialog}
				handleClose={handleFullscreenDialogClose}
			>
				{evolutionMapTitles.map((title, index) => (
					<EvolutionMapCard
						fullScreen
						key={index}
						index={index}
						width={window.innerWidth}
						height={cardHeights.evolutionMap}
						title={title}
						data={evolutionMapData}
					/>
				)).concat(
					agileMapTitles.map((element, index) => (
						<AgileMapCard
							fullScreen
							key={index + evolutionMapTitles.length}
							index={index + evolutionMapTitles.length}
							width={window.innerWidth / numberOfColumns}
							height={cardHeights.agileMap}
							title={element}
							chordData={agileMapData[index]}
							matchingData={generatedMatchingData[index]}
						/>
					)))}
			</FullScreenDialog>
			<FloatingButton history={history} path='/visualizations' description='Fullscreen' icon={<FullscreenIcon />} handleClick={() => handleFullscreenDialogOpen(0)} />
		</div>
	)
}

export default VisualizationsList