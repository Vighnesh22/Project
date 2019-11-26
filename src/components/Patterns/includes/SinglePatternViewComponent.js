import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { GET_ENTITY_COLOR } from '../../../config'
import PatternVisualization from './PatternVisualization';


const useStyles = makeStyles(theme => {
	const chip = {
		margin: theme.spacing(1, 1, 0, 0),
		padding: theme.spacing(1, 1, 1, 0),
		maxWidth: '90%',
	}
	return {
		root: {
			marginTop: theme.spacing(5),
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			backgroundColor: theme.palette.common.white
		},
		paper: {
			padding: theme.spacing(2, 5, 0, 5),
			[theme.breakpoints.up('md')]: {
				margin: theme.spacing(0, 10, 10, 10),
			},
		},
		title: {
			marginBottom: theme.spacing(1)
		},
		chip: {
			...chip
		},
		chipLabel: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			width: '100%'
		},
		chipRelations: {
			...chip,
			color: theme.palette.common.white,
		},
		circle: {
			color: theme.palette.primary.contrastText,
			borderRadius: '50%',
			height: '50px',
			width: '50px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		paperBackground: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.default,
			paddingTop: theme.spacing(7),
			marginBottom: '-100px'
		}
	}
})


const SinglePatternViewComponent = props => {
	const { history, data, entity, positionData, linkData, hovered, selectedItem, height, width, nodeRadius, handleNodeEnter, handleNodeLeave, handleNodeClick } = props

	const classes = useStyles()

	const isDataEmpty = () => Object.keys(data).filter(key => !['id', 'name', 'identifier'].includes(key)).filter(key => !(Array.isArray(data[key]) && data[key].length === 0)).length !== 0


	const handleChipClick = (identifier, entity) => {
		history.push(`/patterns/${entity}/${identifier}`)
	}

	return (
		<div className={classes.root}>
			<PatternVisualization displayDynamic={false} positionData={positionData} linkData={linkData} height={height} width={width} nodeRadius={nodeRadius} hovered={hovered} handleNodeEnter={handleNodeEnter} handleNodeLeave={handleNodeLeave} searched={[]} onPath={[]} selectedItem={selectedItem} handleNodeClick={handleNodeClick} />
			<Paper square elevation={24} className={classes.paperBackground}>
				<Paper elevation={6} className={classes.paper}>
					<div style={{ display: 'flex' }}>
						<Typography variant='h5'>{entity.slice(0, entity.length - 1)}</Typography>
						<div style={{ flexGrow: 1 }}></div>
						<div className={classes.circle} style={{ backgroundColor: GET_ENTITY_COLOR(entity) }}><Typography>{data.identifier}</Typography></div>
					</div>
					<Typography className={classes.title} variant='h4'>{data.name}</Typography>
					{isDataEmpty() && <Divider />}
					<div style={{ display: 'block' }}>
						<table style={{ tableLayout: 'fixed', width: '100%', borderSpacing: '0px 20px' }}>
							<tbody >
								{Object.keys(data).filter(key => !['id', 'name', 'identifier'].includes(key)).map((key, index) => {
									if (!(Array.isArray(data[key]) && data[key].length === 0) && data[key] !== null) {
										const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
										return (
											<tr key={index} style={{ border: 'none' }}>
												<td style={{ width: '250px', paddingRight: '10px' }}>
													<Typography>{title}</Typography>
												</td>
												<td>
													{Array.isArray(data[key]) ?
														typeof (data[key][0]) === 'object' ?
															data[key].map((item, index) => (<Chip key={index} classes={{ label: classes.chipLabel }} style={{ backgroundColor: GET_ENTITY_COLOR(key) }} className={classes.chipRelations} label={`${item.identifier} - ${item.name}`} onClick={() => handleChipClick(item.identifier, title)} />))
															:
															data[key].map((item, index) => (<Chip key={index} classes={{ label: classes.chipLabel }} className={classes.chip} label={item} />))
														:
														<Typography>{data[key]}</Typography>
													}
												</td>
											</tr>
										)
									}
								})}
							</tbody>
						</table>
					</div>
				</Paper>
			</Paper>
		</div>
	)
}

export default SinglePatternViewComponent


