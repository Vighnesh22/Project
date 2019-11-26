import React from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import FullscreenIcon from '@material-ui/icons/FullscreenRounded'
import NodeIcon from '@material-ui/icons/LensRounded'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/styles/useTheme'

import NonRibbonChordVisualization from './includes/NonRibbonChordVisualization'
import MatchingVisualization from './includes/MatchingVisualization'


const useStyles = makeStyles(theme => ({
	root: {
		paddingBottom: theme.spacing(4),
	},
	header: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(3),
	},
	legendNode: {
		display: 'flex'
	},
	leftLegendIcon: {
		color: '#FFB279',
		marginRight: theme.spacing(2)
	},
	rightLegendIcon: {
		color: '#7BADD3',
		marginRight: theme.spacing(2)
	},
	switch: {},
	switchFullScreen: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(2),
	}
}))

const AgileMapCard = props => {
	const { chordData, matchingData, height, width, title, fullScreen, handleFullscreenDialogOpen } = props

	const classes = useStyles()
	const theme = useTheme()

	const [showChord, setShowCord] = React.useState(true)

	const proportions = { title: 0.1, visualization: 0.8, legend: 0.1 }

	const handleSwitchToggle = () => {
		setShowCord(!showChord)
	}

	const Wrapper = props => {
		const { children, fullScreen } = props
		return fullScreen ? <div>{children}</div> : <Paper elevation={6} className={classes.root}>{children}</Paper>
	}

	return (
		<Wrapper fullScreen={fullScreen}>
			<div style={{ display: 'flex' }}>
				<Typography variant='h4' className={classes.header}>{`${title} Map`}</Typography>

				{!fullScreen && <div style={{ flexGrow: 1 }}></div>}

				<FormControlLabel
					style={fullScreen ? {marginTop: theme.spacing(3), marginLeft: theme.spacing(2)} : {}} control={<Switch color='primary' checked={showChord} onChange={handleSwitchToggle} value='showChord' />}
					label='Chord'
				/>
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
			{showChord ?
				<NonRibbonChordVisualization
					width={width}
					height={height * proportions.visualization}
					radius={width < height ? width / 4.3 : height / 4.3}
					data={chordData}
				/>
				:
				<MatchingVisualization
					width={width}
					height={height * proportions.visualization}
					data={matchingData}
				/>
			}
			<Grid container direction='row' justify='space-evenly' alignItems='center'>
				<Grid item className={classes.legendNode}>
					<NodeIcon className={classes.leftLegendIcon} />
					<Typography variant='h5'>{title}</Typography>
				</Grid>
				<Grid item className={classes.legendNode}>
					<NodeIcon className={classes.rightLegendIcon} />
					<Typography variant='h5'>Scaling Frameworks</Typography>
				</Grid>
			</Grid>
		</Wrapper>
	)
}

export default AgileMapCard