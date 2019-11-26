import React from 'react'

import SwipeableViews from 'react-swipeable-views'

import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/CloseRounded'
import Slide from '@material-ui/core/Slide'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'


const useStyles = makeStyles(theme => ({
	exitIconButton: {
		position: 'absolute',
		right: theme.spacing(3),
		top: theme.spacing(3),
	},
	exitIcon: {
		fontSize: '60px',
	},
	tabAppBar: {
		backgroundColor: 'transparent',
		boxShadow: 'none'
	},
	tab: {
		color: theme.palette.secondary.dark,
	}
}))

const a11yProps = index => {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

const Transition = React.forwardRef((props, ref) => <Slide direction='up' ref={ref} {...props} />)

const FullScreenDialog = props => {
	const { children, selected, setSelected, tabTitles, open, handleClose } = props

	const classes = useStyles()
	const theme = useTheme()

	const handleChange = (event, newValue) => {
		setSelected(newValue)
	}

	const handleChangeIndex = index => {
		setSelected(index)
	}

	return (
		<Dialog
			fullScreen
			PaperProps={{ style: { borderRadius: '30px', marginTop: theme.spacing(10) } }}
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
		>
			<AppBar position='static' className={classes.tabAppBar}>
				<Tabs
					value={selected}
					onChange={handleChange}
					indicatorColor='primary'
					textColor='primary'
					variant='fullWidth'
					aria-label='tabs for choosing visualization'

				>
					{children.map((child, index) => (
						<Tab key={index} className={classes.tab} label={tabTitles[index]} {...a11yProps(index)} />
					))}
				</Tabs>
			</AppBar>
			<SwipeableViews
				axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
				index={selected}
				onChangeIndex={handleChangeIndex}
			>
				{children}
			</SwipeableViews>

			<IconButton
				className={classes.exitIconButton}
				aria-label='exit full screen'
				aria-controls={'exit-full-screen'}
				color='inherit'
				onClick={handleClose}
			>
				<CloseIcon className={classes.exitIcon} />
			</IconButton>
		</Dialog>
	)
}

export default FullScreenDialog