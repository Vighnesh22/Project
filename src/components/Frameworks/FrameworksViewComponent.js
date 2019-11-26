import React from 'react'
import { Helmet } from 'react-helmet';
import IconButton from '@material-ui/core/IconButton'
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded'
import ArrowForward from '@material-ui/icons/ArrowForwardIosRounded'
import makeStyles from '@material-ui/core/styles/makeStyles'
import DoneIcon from '@material-ui/icons/DoneRounded'

import RightDrawer from './includes/RightDrawer'
import FrameworksList from './includes/FrameworksList'
import RecommendationDialog from './includes/RecommendationDialog'
import Header from '../../components/Header'
import HeaderSearchField from '../../components/HeaderSearchField'
import FloatingButton from '../FloatingButton'
import SingleFrameworkViewComponent from './includes/SingleFrameworkViewComponent'


const useStyles = makeStyles(theme => ({
	root: {
		display: 'block',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	fabIndent: {
		zIndex: theme.zIndex.drawer + 1,
		[theme.breakpoints.up('md')]: {
			right: '270px',
		},
	},
}))

const FrameworksViewComponent = props => {
	const { history, data } = props

	const classes = useStyles()

	const initialFilters = {
		scalingLevel: ['Enterprise', 'IT Organization', 'Portfolio', 'Program', 'Team'],
		documentation: false,
		community: false,
		contributions: [0, 50],
		rating: [0, 5],
		teamSize: [0, 20],
		multipleProductSupport: false,
		architectureDesign: ['Emergent', 'Intentional', 'Emergent & Intentional'],
		onlyFavorites: false
	}
	const initialSortType = 'alphabetical'
	const initialSortDirection = 'ascending'
	const initialSearchTerm = ''

	const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth > 960)
	const [filteredData, setFilteredData] = React.useState(data)
	const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm)
	const [searchedData, setSearchedData] = React.useState(filteredData)
	const [sortType, setSortType] = React.useState(localStorage.getItem('sortType') ? localStorage.getItem('sortType') : initialSortType)
	const [sortDirection, setSortDirection] = React.useState(localStorage.getItem('sortDirection') ? JSON.parse(localStorage.getItem('sortDirection')) : initialSortDirection)
	const [filters, setFilters] = React.useState(localStorage.getItem('filters') ? JSON.parse(localStorage.getItem('filters')) : initialFilters)
	const [dialogOpen, setDialogOpen] = React.useState(false)
	const [favorites, setFavorites] = React.useState(localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [])

	React.useEffect(() => {
		setFilteredData(sortData(filterData(data, filters, favorites), sortType, sortDirection))
		setSearchedData(sortData(searchData(filterData(data, filters, favorites), searchTerm), sortType, sortDirection))
	}, [])

	const changeDateFormat = framework => {
		const parts = framework.publicationDate.split('.')
		return [parts[1], parts[0], parts[2]].join('/')
	}

	const handleSearchChange = event => {
		const newSearchTerm = event.target.value.toLowerCase()
		setSearchTerm(newSearchTerm)
		setSearchedData(sortData(searchData(filteredData, newSearchTerm), sortType, sortDirection))
	}

	const handleDrawerOpen = () => {
		setDrawerOpen(true)
	}

	const handleDrawerClose = () => {
		setDrawerOpen(false)
	}

	const handleSortTypeChange = type => {
		localStorage.setItem('sortType', type)
		setSortType(type)
		setFilteredData(sortData(filteredData, type, sortDirection))
		setSearchedData(sortData(searchedData, type, sortDirection))
	}

	const handleFiltersChange = filters => {
		localStorage.setItem('filters', JSON.stringify(filters))
		setFilters(filters)
		setFilteredData(sortData(filterData(data, filters, favorites), sortType, sortDirection))
		setSearchedData(sortData(searchData(filterData(data, filters, favorites), searchTerm), sortType, sortDirection))
	}

	const handleFavoritesChanged = (event, name) => {
		const newFavorites = event.target.checked ? [...favorites, name] : favorites.filter(el => el !== name)
		localStorage.setItem('favorites', JSON.stringify(newFavorites))
		setFavorites(newFavorites)
		setFilteredData(sortData(filterData(data, filters, newFavorites), sortType, sortDirection))
		setSearchedData(sortData(searchData(filterData(data, filters, newFavorites), searchTerm), sortType, sortDirection))
	}

	const handleResetClicked = () => {
		localStorage.setItem('filters', JSON.stringify(initialFilters))
		localStorage.setItem('sortType', initialSortType)
		setFilters(initialFilters)
		setSortType(initialSortType)
		setFilteredData(sortData(filterData(data, initialFilters, favorites), initialSortType, initialSortDirection))
		setSearchedData(sortData(searchData(filterData(data, initialFilters, favorites), searchTerm), initialSortType, initialSortDirection))
	}

	const handleDialogOpen = () => {
		setDialogOpen(true)
	}
	const handleDialogClose = () => {
		setDialogOpen(false)
	}

	const handleSortDirectionChange = () => {
		const newDirection = sortDirection === 'ascending' ? 'descending' : 'ascending'
		setSortDirection(newDirection)
		setFilteredData(sortData(filteredData, sortType, newDirection))
		setSearchedData(sortData(searchedData, sortType, newDirection))
	}

	const sortData = (data, type, direction) => {
		const sortedData = [...data]

		switch (type) {
			case 'alphabetical':
				sortedData.sort((a, b) => (direction === 'ascending' ? 1 : -1) * (a.name <= b.name ? a.name < b.name ? -1 : 0 : 1))
				break
			case 'rating':
				sortedData.sort((a, b) => {
					if (a === null && b === null) {
						return (direction === 'ascending' ? 1 : -1) * (a.name <= b.name ? a.name < b.name ? -1 : 0 : 1)
					}
					if (a === null && b === 0) {
						return (direction === 'ascending' ? 1 : -1) * 1
					}
					if (b === null && a === 0) {
						return (direction === 'ascending' ? 1 : -1) * -1
					}
					return (direction === 'ascending' ? 1 : -1) * (a.rating <= b.rating ? a.rating < b.rating ? 1 : a.name <= b.name ? a.name < b.name ? 1 : 0 : -1 : -1)
				})
				break
			case 'publicationDate':
				sortedData.sort((a, b) => (direction === 'ascending' ? 1 : -1) * (new Date(changeDateFormat(b)) - new Date(changeDateFormat(a))))
				break
			default:
				return
		}
		return sortedData
	}

	const filterData = (data, filters, favorites) => {
		return data.filter(item => {
			return (item.rating * 5 >= filters.rating[0] && item.rating * 5 <= filters.rating[1]) &&
				(item.contributions >= filters.contributions[0] && item.contributions <= filters.contributions[1]) &&
				((item.teamSizeMin === null || item.teamSizeMin >= filters.teamSize[0]) && item.teamSizeMax <= filters.teamSize[1]) &&
				(filters.documentation ? item.documentation : true) &&
				(filters.community ? item.community : true) &&
				(filters.scalingLevel.includes(item.scalingLevel) || filters.scalingLevel.length === 0) &&
				(filters.multipleProductSupport ? item.multipleProductSupport : true) &&
				(filters.architectureDesign.includes(item.architectureDesign) || filters.architectureDesign.length === 0) &&
				(!filters.onlyFavorites || favorites.includes(item.name))
		})
	}

	const searchData = (data, searchTerm) => data.filter(item => item.name.toLowerCase().search(searchTerm) !== -1 || item.description.toLowerCase().search(searchTerm) !== -1)

	if (history.location.pathname.split('/').filter(word => word !== '').length <= 1) {
		return (
			<div className={classes.root}>
				<Helmet>
          <title>Frameworks</title>
          <meta name="description" content="Different Frameworks related to softwares developed using agile methodologies" />
          <meta name="theme-color" content="#008f68" />
		  <meta name="keywords" content="xxxxxxxxxxxx"/>
        </Helmet>
				<Header
					history={history}
					additionalToolbarLeft={<HeaderSearchField handleOnChange={handleSearchChange} placeholder='Search frameworks ...' />}
					additionalToolbarRight={
						drawerOpen ?
							<IconButton
								aria-label='close drawer'
								aria-haspopup='true'
								color='inherit'
								onClick={handleDrawerClose}
							>
								<ArrowForward />
							</IconButton>
							:
							<IconButton
								aria-label='open drawer'
								aria-haspopup='true'
								color='inherit'
								onClick={handleDrawerOpen}
							>
								<ArrowBack />
							</IconButton>}
				/>
				<FrameworksList
					data={searchedData}
					filters={filters}
					favorites={favorites}
					handleFavoritesChanged={handleFavoritesChanged}
				/>
				<RightDrawer
					filters={filters}
					open={drawerOpen}
					sortType={sortType}
					sortDirection={sortDirection}
					handleSortDirectionChange={handleSortDirectionChange}
					handleSortTypeChange={handleSortTypeChange}
					handleResetClicked={handleResetClicked}
					handleFiltersChange={handleFiltersChange}
				/>
				<FloatingButton fabClasses={drawerOpen && classes.fabIndent} history={history} path='/frameworks' description='Recommendation' icon={<DoneIcon />} handleClick={handleDialogOpen} />
				<RecommendationDialog filters={filters} open={dialogOpen} handleDialogClose={handleDialogClose} handleFiltersChange={handleFiltersChange} />
			</div>
		)
	}

	return (
		<div>
			<Header history={history} />
			<SingleFrameworkViewComponent data={data.filter(item => item.name === history.location.pathname.split('/').filter(word => word !== '')[1])[0]} />
		</div>
	)
}

export default FrameworksViewComponent