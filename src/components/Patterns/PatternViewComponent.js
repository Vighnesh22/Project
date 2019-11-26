import React from 'react'
import { Helmet } from 'react-helmet';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import FilterIcon from '@material-ui/icons/FilterListRounded'
import RotateIcon from '@material-ui/icons/ScreenRotationRounded'

import PatternVisualization from './includes/PatternVisualization'
import Header from '../Header'
import HeaderSearchField from '../HeaderSearchField'
import SinglePatternViewComponent from './includes/SinglePatternViewComponent';


const useStyles = makeStyles(theme => ({
	root: {
		paddingTop: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	paper: {
		margin: theme.spacing(10, 4, 0, 4),
		padding: theme.spacing(3, 5, 5, 5)
	},
	rotateArea: {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		textAlign: 'center'
	},
	chip: {
		marginTop: theme.spacing(2)
	}
}))

const PatternViewComponent = props => {
	const { history, data } = props

	const classes = useStyles()

	const [hovered, setHovered] = React.useState()
	const [searched, setSearched] = React.useState([])
	const [selected, setSelected] = React.useState()
	const [onPath, setOnPath] = React.useState([])
	const [isPortraitMode, setIsPortraitMode] = React.useState(window.innerWidth < window.innerHeight && window.innerWidth < 960)
	const [filterAnchorEl, setFilterAnchorEl] = React.useState(undefined)

	const isFilterMenuOpen = Boolean(filterAnchorEl)
	const filterIndices = { level: 0, entity: 0 }

	React.useEffect(() => {
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleResize = () => {
		setIsPortraitMode(window.innerWidth < window.innerHeight && window.innerWidth < 960)
	}

	const filterData = data => {
		return data.map(level => level.filter(entity => entity.data.length != 0)).filter(level => level.length != 0)
			.map(level => level.map(entity => {
				return entity.description === 'Concerns' ?
					{ ...entity, data: entity.data.filter(item => item.coordinationPatterns.length + item.principles.length + item.methodologyPatterns.length + item.visualizationPatterns.length !== 0) }
					:
					entity
			}))
	}

	const filterConcers = data => {
		const concerns = data.map(level => level.filter(entity => entity.description === 'Concerns')).flat()[0].data.map(item => item.identifier)
		return data.map(level => level.map(entity => {
			return entity.data !== 0 && Object.keys(entity.data[0]).includes('concerns') ?
				{ ...entity, data: entity.data.map(item => ({ ...item, concerns: item.concerns.filter(concern => concerns.includes(concern.identifier)) })) }
				:
				entity
		}))
	}

	const sortData = data => {
		return data.map(level => {
			return level.map(entity => {
				return {
					...entity,
					data: entity.data.sort((a, b) => {
						const aIndex = parseInt(a.identifier.slice(a.identifier.indexOf('-') + 1))
						const bIndex = parseInt(b.identifier.slice(b.identifier.indexOf('-') + 1))
						return aIndex < bIndex ? -1 : aIndex > bIndex ? 1 : 0
					})
				}
			})
		})
	}

	const transformData = data => {
		return data.map(level => {
			return level.map(entity => {
				return {
					entityName: entity.description,
					categories: (Object.keys(entity.data[0]).includes('category') ?
						[...new Set(entity.data.map(item => item.category))].map(key => ({ categoryName: key, data: entity.data.filter(item => item.category === key) }))
						:
						[{ categoryName: 'all', data: entity.data }])
				}
			})
		})
	}

	const getNumGroupGrid = (level, maxColumns) => {
		const categories = level.map(entity => entity.categories.map(category => category.data)).flat()
		if (categories.reduce((count, group) => count + group.length, 0) <= maxColumns - (categories.length + 1)) {
			return { maxRows: 1, maxColumns: Math.max(...categories.map(group => group.length)) }
		}

		let maxGroupColumns = maxColumns - (categories.length + 1) - (categories.length - 1)
		while (maxColumns - (categories.length + 1) < categories.reduce((count, group) => count + Math.min(maxGroupColumns, group.length), 0)) {
			maxGroupColumns--
		}

		return { maxRows: Math.ceil(Math.max(...categories.map(group => group.length)) / maxGroupColumns), maxColumns: maxGroupColumns }
	}

	const calcGridData = (data, maxColumns) => {
		return data.map(level => {
			const groupGrid = getNumGroupGrid(level, maxColumns)
			const numColumnsPerEntity = level.map(entity => entity.categories.reduce((count, category) => count + Math.min(category.data.length, groupGrid.maxColumns) + 1, 0) + 1)
			return {
				rows: groupGrid.maxRows + 1,
				columns: numColumnsPerEntity.reduce((count, columns) => count + columns, 0),
				entities: level.map((entity, entityIndex) => {
					return {
						entityName: entity.entityName,
						rows: groupGrid.maxRows + 2,
						columns: numColumnsPerEntity[entityIndex],
						categories: entity.categories.map(category => {
							return {
								categoryName: category.categoryName,
								rows: Math.ceil(category.data.length / groupGrid.maxColumns),
								columns: Math.min(category.data.length, groupGrid.maxColumns),
								data: category.data
							}
						})
					}
				})
			}
		})
	}

	const calcPositionData = (data, height, width) => {
		const numTotalRows = data.reduce((count, level) => count + level.rows, 0)

		return data.map((level, levelIndex) => {
			const levelStartX = 0
			const levelStartY = data.slice(0, levelIndex).reduce((count, level) => count + level.rows, 0) / numTotalRows * height
			const levelHeight = level.rows / numTotalRows * height
			const levelWidth = width
			return {
				startX: levelStartX,
				startY: levelStartY,
				height: levelHeight,
				width: levelWidth,
				entities: level.entities.map((entity, entityIndex) => {
					const entityStartX = level.entities.slice(0, entityIndex).reduce((count, entity) => count + entity.columns, 0) / level.columns * levelWidth
					const entityStartY = 0
					const entityHeight = levelHeight
					const entityWidth = entity.columns / level.columns * levelWidth
					return {
						entityName: entity.entityName,
						startX: levelStartX + entityStartX,
						startY: levelStartY + entityStartY,
						height: entityHeight,
						width: entityWidth,
						categories: entity.categories.map((category, groupIndex) => {
							const groupStartX = (entity.categories.slice(0, groupIndex).reduce((count, category) => count + category.columns, 0) + groupIndex + 1) / entity.columns * entityWidth
							const groupStartY = (entity.rows - category.rows) / 2 / entity.rows * entityHeight
							const groupHeight = category.rows / entity.rows * entityHeight
							const groupWidth = category.columns / entity.columns * entityWidth
							return {
								categoryName: category.categoryName,
								startX: levelStartX + entityStartX + groupStartX,
								startY: levelStartY + entityStartY + groupStartY,
								height: groupHeight,
								width: groupWidth,
								data: category.data.map((item, nodeIndex) => {
									let nodeStartX = 0
									if (category.rows > 1 && Math.floor(nodeIndex / category.columns) === category.rows - 1) {
										nodeStartX = ((category.columns - (category.data.length - (category.rows - 1) * category.columns)) / 2 + (nodeIndex % category.columns + 0.5)) / category.columns * groupWidth
									} else {
										nodeStartX = (nodeIndex % category.columns + 0.5) / category.columns * groupWidth
									}
									const nodeStartY = (Math.floor(nodeIndex / category.columns) + 0.5) / category.rows * groupHeight
									return {
										...item,
										startX: levelStartX + entityStartX + groupStartX + nodeStartX,
										startY: levelStartY + entityStartY + groupStartY + nodeStartY
									}
								})
							}
						})
					}
				})
			}
		})
	}

	const getLinks = (data, relations) => {
		let links = []
		data.forEach(level => {
			level.forEach(entity => {
				entity.data.forEach(item => {
					relations.filter(relation => Object.keys(item).includes(relation.label)).forEach(relation => {
						item[relation.label].forEach(link => {
							const filteredEntities = data[relation.level].filter(entity => entity.description === relation.entityName)
							if (filteredEntities.length !== 0) {
								const related = filteredEntities[0].data.filter(relatedItem => relatedItem.identifier === link.identifier)[0]
								if (related) {
									links.push([item.identifier, related.identifier])
								}
							}
						})
					})
				})
			})
		})
		return links
	}

	const getLinkPositions = (links, positionData) => {
		let linkPositions = []
		links.forEach(link => {
			const linkItems = link.map(linkItem => positionData.map(level => level.entities.map(entity => entity.categories.map(category => category.data.filter(item => item.identifier === linkItem)))).flat().flat().flat())
			if (linkItems[0].length + linkItems[1].length === 2) {
				linkPositions.push([
					{ identifier: link[0], startX: linkItems[0][0].startX, startY: linkItems[0][0].startY },
					{ identifier: link[1], startX: linkItems[1][0].startX, startY: linkItems[1][0].startY }
				])
			}
		})
		return linkPositions
	}

	const getPath = (links, direction, identifier) => {
		let path = [identifier]
		const relative = links.filter(link => (direction === 'from' ? link[0] : link[1]) === identifier).map(link => direction === 'from' ? link[1] : link[0])
		if (relative.length !== 0) {
			relative.forEach(predecessor => {
				path = path.concat(getPath(links, direction, predecessor))
			})
			return path
		} else {
			return [identifier]
		}
	}

	const getSelectedData = data => {
		const selectedItem = history.location.pathname.split('/').filter(word => word !== '').length > 1 ? history.location.pathname.split('/')[3] : selected ? selected.identifier : undefined

		if (!selectedItem) {
			return { selectedItem: selectedItem, selectedData: data }
		}
		if (history.location.pathname.split('/').filter(word => word !== '').length > 1) {
			return { selectedItem: selectedItem, selectedData: filterData(data.map(level => level.map(entity => ({ ...entity, data: entity.data.filter(item => getPath(links, 'from', selectedItem).concat(getPath(links, 'to', selectedItem)).slice(1).includes(item.identifier)) })))) }
		}
		if (selected) {
			return { selectedItem: selectedItem, selectedData: filterData(data.map(level => level.map(entity => entity.description === 'Anti Patterns' ? entity : { ...entity, data: entity.data.filter(item => getPath(links, 'from', selectedItem).concat(getPath(links, 'to', selectedItem)).slice(1).includes(item.identifier)) })))}
		}
	}

	const filteredData = filterConcers(filterData(data))
	const relations = filteredData.map((level, index) => level.map(entity => ({ entityName: entity.description, label: entity.description.charAt(0).toLowerCase() + entity.description.slice(1).replace(/\s/g, ''), level: index }))).flat()
	const links = getLinks(filteredData, relations)
	const { selectedItem, selectedData } = getSelectedData(filteredData)
	const transformedData = transformData(sortData(selectedData))
	const width = window.innerWidth
	const nodeSize = window.innerWidth / 21
	const maxColumns = Math.floor(width / nodeSize)
	const nodeRadius = window.innerWidth / 85
	const gridData = calcGridData(transformedData, maxColumns)
	const numTotalRows = gridData.reduce((count, level) => count + level.rows, 0)
	const height = numTotalRows * nodeSize
	const positionData = calcPositionData(gridData, height, width)
	const linkData = getLinkPositions(links, positionData)

	const handleSearchChange = event => {
		const searchTerm = event.target.value.toLowerCase()
		if (searchTerm === '') {
			setSearched([])
		} else {
			setSearched(filteredData.map(level => level.map(entity => entity.data.filter(item => item.name.toLowerCase().includes(searchTerm)))).flat().flat().map(item => item.identifier))
		}
	}

	const handleNodeEnter = identifier => {
		setHovered(identifier)
		setOnPath(getPath(links, 'from', identifier).concat(getPath(links, 'to', identifier)).slice(1))
	}

	const handleNodeLeave = () => {
		setHovered(undefined)
		setOnPath([])
	}

	const handleNodeClick = (item, entityName) => {
		history.push(`/patterns/${entityName}/${item.identifier}`)
		setOnPath([])
		setHovered(undefined)
		setSearched([])
	}

	const handleFilterMenuClose = () => {
		setFilterAnchorEl(undefined)
	}

	const handleFilterMenuOpen = event => {
		setFilterAnchorEl(event.currentTarget)
	}

	const handleFilterChange = item => {
		setSelected({ identifier: item.identifier, name: item.name })
	}

	if (history.location.pathname.split('/').filter(word => word !== '').length > 1) {
		return (
			<div>
				<Header history={history} />
				<SinglePatternViewComponent
					history={history}
					data={filteredData.map(level => level.map(entity => entity.data.filter(item => item.identifier === selectedItem))).flat().flat()[0]}
					positionData={positionData}
					linkData={linkData}
					height={height}
					width={width}
					nodeRadius={nodeRadius}
					hovered={hovered}
					entity={history.location.pathname.split('/')[2]}
					selectedItem={selectedItem}
					handleNodeEnter={handleNodeEnter}
					handleNodeLeave={handleNodeLeave}
					handleNodeClick={handleNodeClick}
				/>
			</div>

		)
	}

	return (
		<div className={classes.root}>
			<Helmet>
          <title>Patterns and Anti patterns associated with the development of agile frameworks</title>
          <meta name="description" content="Pictographic representation of concerns associated with the development using agile methodologies" />
          <meta name="theme-color" content="#008f68" />
          <meta name="keywords" content="xxxxxxxxxxxx" />
        </Helmet>
			<Header
				history={history}
				additionalToolbarLeft={<HeaderSearchField handleOnChange={handleSearchChange} placeholder='Search patterns ...' />}
			/>

			{isPortraitMode ?
				<div className={classes.root}>
					<Grid className={classes.rotateArea} container direction='column' justify='center' alignItems='center'>
						<Grid item xs={12}>
							<RotateIcon fontSize='large' color='primary' />
						</Grid>
						<Grid item xs={12}>
							<Typography variant='h4' component='p'>Rotate your screen to view visualizations.</Typography>
						</Grid>
					</Grid>
				</div>
				:
				<Paper elevation={6} className={classes.paper}>

					<div style={{ display: 'flex' }}>
						<Typography variant='h4'>Large-Scale Agile Development Pattern Graph</Typography>

						<div style={{ flexGrow: 1 }}></div>
						
						{selected && <Chip className={classes.chip} avatar={<Avatar>{selected.identifier}</Avatar>} label={selected.name} />}
						<IconButton
							aria-label='show filter menu'
							aria-controls={'filter-menu'}
							aria-haspopup='true'
							onClick={handleFilterMenuOpen}
							color='inherit'
						>
							<FilterIcon fontSize='large' color='secondary' />
						</IconButton>
						<Menu
							anchorEl={filterAnchorEl}
							anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							id={'filter-menu'}
							keepMounted
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							open={isFilterMenuOpen}
							onClose={handleFilterMenuClose}
						>
							{filteredData[filterIndices.level][filterIndices.entity].data.concat().sort((a,b) => (parseInt(a.identifier.split('-')[1]) > parseInt(b.identifier.split('-')[1])) ? 1 : ((parseInt(b.identifier.split('-')[1]) > parseInt(a.identifier.split('-')[1])) ? -1 : 0)).map((item, index) => (
								<MenuItem key={index} style={{ color: selected && selected.identifier === item.identifier && 'grey' }} onClick={() => handleFilterChange(item)}>{`${item.identifier} - ${item.name}`}</MenuItem>)
							)}
						</Menu>
					</div>
					<PatternVisualization displayDynamic={true} positionData={positionData} linkData={linkData} height={height} width={width} nodeRadius={nodeRadius} hovered={hovered} searched={searched} onPath={onPath} selectedItem={selectedItem} handleNodeEnter={handleNodeEnter} handleNodeLeave={handleNodeLeave} handleNodeClick={handleNodeClick} />
				</Paper>
			}
		</div>
	)
}

export default PatternViewComponent