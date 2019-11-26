import React from 'react'

import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListSubheader from '@material-ui/core/ListSubheader'
import Slider from '@material-ui/core/Slider'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import ResetIcon from '@material-ui/icons/Replay'
import SortIcon from '@material-ui/icons/Sort'
import FavoriteIcon from '@material-ui/icons/FavoriteRounded'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorderRounded'
import DownIcon from '@material-ui/icons/ArrowDropDownCircleRounded'


const useStyles = makeStyles(theme => {
	const drawerWidth = 240
	return {
		drawer: {
			position: 'relative',
			width: drawerWidth,
			flexShrink: 0,
			zIndex: theme.zIndex.appBar - 1
		},
		drawerPaper: {
			width: window.innerWidth,
			[theme.breakpoints.up('md')]: {
				width: drawerWidth,
			},
		},
		filterSection: {
			marginTop: theme.spacing(9)
		},
		iconButtonSection: {
			display: 'flex',
			justifyContent: 'space-evenly',
			alignItems: 'center'
		},
		listSubheader: {
			color: 'black',
			fontSize: 20,
			fontWeight: 400
		},
		checkbox: {
			color: theme.palette.primary.main
		},
		reset: {
			willChange: 'transform',
			transform: 'rotate(0deg)',
			transition: theme.transitions.create(
				['transform'],
				{ duration: theme.transitions.duration.shortest }
			),
		},
		resetClicked: {
			willChange: 'transform',
			transform: 'rotate(-360deg)',
			transition: theme.transitions.create(
				['transform'],
				{ duration: theme.transitions.duration.complex }
			),
		},
		sort: {
			willChange: 'transform',
			transform: 'rotate(0deg)',
			transition: theme.transitions.create(
				['transform'],
				{ duration: theme.transitions.duration.complex }
			),
		}
	}
})

const RightDrawer = props => {
	const { filters, open, sortType, sortDirection, handleSortDirectionChange, handleSortTypeChange, handleResetClicked, handleFiltersChange } = props

	const classes = useStyles()
	const theme = useTheme()

	const [sortAnchorEl, setSortAnchorEl] = React.useState(undefined)
	const [resetClicked, setResetClicked] = React.useState(false)

	const isSortMenuOpen = Boolean(sortAnchorEl)

	const handleSortMenuClose = () => {
		setSortAnchorEl(undefined)
	}

	const handleSortMenuOpen = event => {
		setSortAnchorEl(event.currentTarget)
	}

	const handleRangeFilterChange = (filter, newValue) => {
		const newFilters = {
			...filters,
			[filter]: newValue
		}
		handleFiltersChange(newFilters)
	}

	const handleCheckboxFilterChange = (event, filter) => {
		const newFilters = {
			...filters,
			[filter]: event.target.checked
		}
		handleFiltersChange(newFilters)
	}

	const handleArrayFilterChange = (event, filter, item) => {
		const newFilters = {
			...filters,
			[filter]: event.target.checked ? [...filters[filter], item] : filters[filter].filter(el => el !== item)
		}
		handleFiltersChange(newFilters)
	}

	const handleFilterFavoritesClick = event => {
		handleCheckboxFilterChange(event, 'onlyFavorites')
	}

	const handleResetIconClicked = () => {
		handleResetClicked()
		setResetClicked(true)
		setTimeout(() => {
			setResetClicked(false)
		}, theme.transitions.duration.complex)
	}

	return (
		<Drawer
			className={classes.drawer}
			variant='persistent'
			anchor='right'
			open={open}
			classes={{ paper: classes.drawerPaper }}
			style={{ display: open ? 'block' : 'none' }}
		>
			<div className={classes.filterSection}>
				<List className={classes.iconButtonSection}>
					<IconButton
						aria-label='clear filters'
						aria-controls={'clear-filters'}
						onClick={handleResetIconClicked}
						color='inherit'
					>
						<ResetIcon className={resetClicked ? [classes.reset, classes.resetClicked].join(' ') : classes.reset} fontSize='large' color='secondary' />
					</IconButton>
					<Checkbox
						icon={<FavoriteBorderIcon fontSize='large' color='secondary' />}
						checkedIcon={<FavoriteIcon fontSize='large' color='secondary' />}
						onClick={handleFilterFavoritesClick}
						checked={filters.onlyFavorites}
					/>
					<IconButton
						aria-label='show sort type'
						aria-controls={'sort-menu'}
						aria-haspopup='true'
						onClick={handleSortMenuOpen}
						color='inherit'
					>
						<SortIcon fontSize='large' color='secondary' />
					</IconButton>
					<Menu
						anchorEl={sortAnchorEl}
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						id={'sort-menu'}
						keepMounted
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={isSortMenuOpen}
						onClose={handleSortMenuClose}
					>
						{['Alphabetical', 'Publication Date', 'Rating'].map((item, index) => {
							const sortTerm = item.charAt(0).toLowerCase() + item.replace(/\s/g, '').slice(1)
							return (<MenuItem key={index} style={{ color: sortType === sortTerm && 'grey' }} onClick={() => handleSortTypeChange(sortTerm)}>{item}</MenuItem>)
						})}
					</Menu>
					<IconButton
						aria-label='change sort direction'
						aria-controls={'sort-direction'}
						onClick={handleSortDirectionChange}
						color='inherit'
					>
						<DownIcon className={classes.sort} style={sortDirection === 'ascending' ? { transform: 'rotate(180deg)' } : {}} fontSize='large' color='secondary' />
					</IconButton>
				</List>
				<Divider />
				<List subheader={<ListSubheader className={classes.listSubheader} component='div' id='list-subheader-scalingLevel'>Scaling Level</ListSubheader>}>
					{['Enterprise', 'IT Organization', 'Portfolio', 'Program', 'Team'].map((item, index) => {
						const labelId = `checkbox-list-label-${item}`
						return (
							<ListItem key={index}>
								<ListItemIcon>
									<Checkbox
										className={classes.checkbox}
										onClick={event => handleArrayFilterChange(event, 'scalingLevel', item)}
										edge='start'
										checked={filters.scalingLevel.includes(item)}
										tabIndex={-1}
										inputProps={{ 'aria-labelledby': labelId }}
										color='primary'
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={item} />
							</ListItem>
						)
					})}
				</List>
				<Divider />
				<List subheader={<ListSubheader className={classes.listSubheader} component='div' id='list-subheader-architectureDesign'>Architecture Design</ListSubheader>}>
					{['Emergent', 'Intentional', 'Emergent & Intentional'].map((item, index) => {
						const labelId = `checkbox-list-label-${item}`
						return (
							<ListItem key={index}>
								<ListItemIcon>
									<Checkbox
										className={classes.checkbox}
										onClick={event => handleArrayFilterChange(event, 'architectureDesign', item)}
										edge='start'
										checked={filters.architectureDesign.includes(item)}
										tabIndex={-1}
										inputProps={{ 'aria-labelledby': labelId }}
										color='primary'
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={item} />
							</ListItem>
						)
					})}
				</List>
				<Divider />
				<List subheader={<ListSubheader className={classes.listSubheader} component='div' id='list-subheader-other'>Other</ListSubheader>}>
					{['Documentation', 'Community', 'Multiple Product Support'].map((item, index) => {
						const labelId = `checkbox-list-label-${item}`
						const label = item.charAt(0).toLowerCase() + item.replace(/\s/g, '').slice(1)
						return (
							<ListItem key={index}>
								<ListItemIcon>
									<Checkbox
										className={classes.checkbox}
										onClick={event => handleCheckboxFilterChange(event, label)}
										edge='start'
										checked={filters[label]}
										tabIndex={-1}
										inputProps={{ 'aria-labelledby': labelId }}
										color='primary'
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={item} />
							</ListItem>
						)
					})}
				</List>
				<Divider />
				<List subheader={<ListSubheader className={classes.listSubheader} component='div' id='list-subheader-contributions'>Contributions</ListSubheader>}>
					<ListItem>
						<Slider
							value={filters.contributions}
							onChange={(event, newValue) => handleRangeFilterChange('contributions', newValue)}
							valueLabelDisplay='auto'
							aria-labelledby='range-slider-contributions'
							getAriaValueText={() => filters.contributions}
							step={1}
							min={0}
							max={50}
						/>
					</ListItem>
				</List>
				<Divider />
				<List subheader={<ListSubheader className={classes.listSubheader} component='div' id='list-subheader-teamSize'>Team Size</ListSubheader>}>
					<ListItem>
						<Slider
							value={filters.teamSize}
							onChange={(event, newValue) => handleRangeFilterChange('teamSize', newValue)}
							valueLabelDisplay='auto'
							aria-labelledby='range-slider-teamSize'
							getAriaValueText={() => filters.teamSize}
							step={1}
							min={0}
							max={20}
						/>
					</ListItem>
				</List>
				<Divider />
				<List subheader={<ListSubheader className={classes.listSubheader} component='div' id='list-subheader-rating'>Rating</ListSubheader>}>
					<ListItem>
						<Slider
							value={filters.rating}
							onChange={(event, newValue) => handleRangeFilterChange('rating', newValue)}
							valueLabelDisplay='auto'
							aria-labelledby='range-slider-rating'
							getAriaValueText={() => filters.rating}
							step={1}
							min={0}
							max={5}
						/>
					</ListItem>
				</List>
			</div>
		</Drawer>
	)
}

export default RightDrawer