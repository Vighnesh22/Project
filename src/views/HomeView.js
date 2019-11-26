import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import HomeViewComponent from '../components/Home/HomeViewComponent'
import Header from '../components/Header'
import Footer from '../components/Footer'


const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: '#fafafa'
	},
	appBar: {
		background: 'transparent',
		position: 'absolute'
	}
}))

const HomeView = props => {
	const { history } = props

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Header history={history} appBarClasses={classes.appBar} elevation={0}/>
			<HomeViewComponent />
			<Footer />
		</div>
	)
}

export default HomeView