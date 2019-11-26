import React from 'react'

import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'

import { ThemeProvider } from '@material-ui/styles'

import FrameworksView from './views/FrameworksView'
import HomeView from './views/HomeView'
import NotFoundView from './views/NotFoundView'
import TestView from './views/TestView'
import VisualizationsView from './views/VisualizationsView'
import PatternsView from './views/PatternsView'
import CookieDisclaimer from './components/CookieDisclaimer'
import { GLOBAL_THEME } from './config'


const App = () => {
	const [openSnackbar, setOpenSnackbar] = React.useState(false)

	const title = 'Recommender System for Scaling Agile Frameworks'
	const routes = [
		{ component: HomeView, path: '/', exact: true },
		{ component: FrameworksView, path: '/frameworks', exact: false },
		{ component: VisualizationsView, path: '/visualizations', exact: true },
		{ component: PatternsView, path: '/patterns', exact: false },
		{ component: TestView, path: '/test', exact: true },
		{ component: NotFoundView, path: '*' },
		
	]

	React.useEffect(() => {
		document.title = title
		setTimeout(() => {
			if (!localStorage.getItem('cookies') || (new Date().getTime() - JSON.parse(localStorage.getItem('cookies')).noticedAt > 7 * 24 * 60 * 60 * 1000)) {
				setOpenSnackbar(true)
			}
		}, 1000)
	}, [])

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}
		localStorage.setItem('cookies', JSON.stringify({ noticedAt: new Date().getTime() }))
		setOpenSnackbar(false)
	}

	return (
		<ThemeProvider theme={GLOBAL_THEME}>
			<ParallaxProvider>
				<Router>
					<Switch>
						{routes.map((route, index) => (<Route key={index} {...route} />))}
					</Switch>
				</Router>
			</ParallaxProvider>
			<CookieDisclaimer open={openSnackbar} handleClose={handleCloseSnackbar} />
		</ThemeProvider>
	)

}

export default App