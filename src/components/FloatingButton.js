import React from 'react'

import Zoom from '@material-ui/core/Zoom'
import Fab from '@material-ui/core/Fab'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'


const useStyles = makeStyles(theme => ({
	fab: {
		position: 'fixed',
		bottom: theme.spacing(4),
		right: theme.spacing(5)
	},
}))

const FloatingButton = props => {
	const { fabClasses, history, path, description, icon, handleClick } = props

	const classes = useStyles()
	const theme = useTheme()

	const transitionDuration = {
		enter: theme.transitions.duration.enteringScreen,
		exit: theme.transitions.duration.leavingScreen,
	}

	return (
		<Zoom
			in={history.location.pathname === path}
			timeout={transitionDuration}
			style={{
				transitionDelay: `${history.location.pathname === path ? transitionDuration.exit : 0}ms`,
			}}
			unmountOnExit
		>
			<Fab onClick={handleClick} variant='extended' className={[fabClasses, classes.fab].join(' ')} color='primary'>
				{icon}
				<div style={{ width: theme.spacing(1), flexGrow: 1 }}></div>
				{description}
			</Fab>
		</Zoom>
	)
}

export default FloatingButton