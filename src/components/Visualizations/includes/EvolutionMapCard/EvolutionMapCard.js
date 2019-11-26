import React from 'react'

import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import FullscreenIcon from '@material-ui/icons/FullscreenRounded'
import NodeIcon from '@material-ui/icons/LensRounded'

import EvolutionMapVisualization from '../EvolutionMapCard/includes/EvolutionMapVisualization'


const useStyles = makeStyles(theme => ({
	root: {
		paddingBottom: theme.spacing(4),
	},
	header: {
		display: 'flex',
		marginBottom: theme.spacing(2)
	},
	title: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(3),
	},
	legendNode: {
		display: 'flex'
	},
	legendArrow: {
		marginTop: theme.spacing(2),
		marginRight: theme.spacing(2),
	}
}))

const EvolutionMapCard = props => {
	const { data, fullScreen, height, width, title, handleFullscreenDialogOpen } = props

	const classes = useStyles()
	const theme = useTheme()

	const horizontalPadding = 220
	const verticalPadding = 20
	const proportions = [10, 80, 10]

	const Wrapper = props => {
		const { children, fullScreen } = props
		return fullScreen ? <div>{children}</div> : <Paper elevation={6} className={classes.root}>{children}</Paper>
	}

	return (
		<Wrapper fullScreen={fullScreen}>
			<div className={classes.header} >
				<Typography variant='h4' className={classes.title}>{title}</Typography>

				<div style={{ flexGrow: 1 }}></div>

				{!fullScreen &&
					<IconButton
						aria-label='enter full screen'
						aria-controls={'enter-full-screen'}
						color='inherit'
						onClick={handleFullscreenDialogOpen}
					>
						<FullscreenIcon fontSize='large' />
					</IconButton>
				}
			</div>
			<EvolutionMapVisualization
				horizontalPadding={horizontalPadding}
				verticalPadding={verticalPadding}
				outerWidth={width}
				outerHeight={height * (proportions[1] / 100)}
				innerWidth={width - horizontalPadding}
				innerHeight={height * (proportions[1] / 100) - (verticalPadding / 2 + 50)}
				data={data}
			/>
			<Grid container direction='row' justify='space-evenly' alignItems='center'>
				{[{ title: 'Start of development', color: '#e8e6df' }, { title: 'Current version', color: '#c3c7a7' }, { title: 'Intermediate version', color: '#c8dbef' },
				{ title: 'No further development', color: '#e5b9ac' }].map((data, index) => (
					<Grid key={index} item className={classes.legendNode}>
						<NodeIcon style={{ color: data.color, marginRight: theme.spacing(2) }} />
						<Typography variant='h5'>{data.title}</Typography>
					</Grid>
				))}
				<div style={{ display: 'flex' }}>
					<Typography className={classes.legendArrow} variant='h5' component='p'>Superseded by </Typography>
					<Typography variant='h2' component='p'>&#8594;</Typography>
				</div>
				<div style={{ display: 'flex' }}>
					<Typography className={classes.legendArrow} variant='h5' component='p'>Influenced by </Typography>
					<Typography variant='h2' component='p'>&#8674;</Typography>
				</div>
			</Grid>
		</Wrapper>
	)
}

export default EvolutionMapCard