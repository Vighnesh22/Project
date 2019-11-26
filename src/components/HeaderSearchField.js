import React from 'react'

import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles, fade } from '@material-ui/core/styles'


const useStyles = makeStyles(theme => ({
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(1),
			width: 'auto',
		},
	},
	searchIcon: {
		width: theme.spacing(7),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 0, 1, 7),
		transition: theme.transitions.create('width'),
		width: 0,
		[theme.breakpoints.up('sm')]: {
			width: 200,
			'&:focus': {
				width: 300,
			},
		},
	},
}))

const HeaderSearchField = props => {
	const { placeholder, handleOnChange } = props

	const classes = useStyles()

	return (
		<div className={classes.search}>
			<div className={classes.searchIcon}>
				<SearchIcon />
			</div>
			<InputBase
				placeholder={window.innerWidth < 960 ? '' : placeholder}
				onChange={handleOnChange}
				classes={{
					root: classes.inputRoot,
					input: classes.inputInput,
				}}
				inputProps={{ 'aria-label': 'search' }}
			/>
		</div>
	)
}

export default HeaderSearchField