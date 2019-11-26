import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import ItemsService from '../services/ItemsService'
import FrameworksViewComponent from '../components/Frameworks/FrameworksViewComponent'
import Footer from '../components/Footer'


const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: '#fafafa'
	},
	loader: {
		position: 'fixed',
		top: '50%',
		left: '50%',
	}
}))

const FrameworksView = props => {
	const { history, cookiesAccepted } = props

	const classes = useStyles()

	const [loading, setLoading] = React.useState(true)
	const [data, setData] = React.useState([])

	React.useEffect(() => {
		ItemsService.getFrameworks().then(data => {
			setData([...data.value])
			setLoading(false)
		})
	}, [])

	if (loading) {
		return <CircularProgress size={75} thickness={4} className={classes.loader} />
	}

	return (
		<div className={classes.root}>
			<FrameworksViewComponent history={history} data={data} cookiesAccepted={cookiesAccepted} />
			<Footer />
		</div>
	)
}

export default FrameworksView