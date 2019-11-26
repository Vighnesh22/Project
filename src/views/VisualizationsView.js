import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import ItemsService from '../services/ItemsService'
import Header from '../components/Header'
import VisualizationsList from '../components/Visualizations/VisualizationsList'
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

const VisualizationsView = props => {
	const { history } = props

	const classes = useStyles()

	const [loading, setLoading] = React.useState(true)
	const [frameworksData, setFrameworksData] = React.useState([])
	const [frameworkVersionsData, setFrameworkVersionsData] = React.useState([])
	const [matchingData, setMatchingData] = React.useState([])


	React.useEffect(() => {
		ItemsService.getFrameworks().then(frameworksData => {
			setFrameworksData([...frameworksData.value])

			ItemsService.getFrameworkVersions().then(frameworkVersionsData => {
				setFrameworkVersionsData([...updateDate(frameworkVersionsData.value, frameworksData.value)])

				const unresolvedData = ItemsService.getMatchingData()
				let dataSet = []
				unresolvedData.forEach(element => {
					element.promise.then(data => {
						dataSet.push({
							description: element.description,
							data: data.value
						})
						if (dataSet.length === unresolvedData.length) {
							setMatchingData(dataSet)
							setLoading(false)
						}
					})
				})
			})
		})
	}, [])

	const updateDate = (frameworkVersionsData, frameworksData) => {
		frameworkVersionsData.forEach(version => {
			const publicationDate = version.publicationDate.substr(6, 4) + '-' + version.publicationDate.substr(3, 2) + '-' + version.publicationDate.substr(0, 2)
			version.publicationDate = publicationDate
			version.year = publicationDate.substr(0, 4)
			version.dateTime = new Date(publicationDate).getTime()
			version.framework = version.framework[0]
			version.route = frameworksData.filter(framework => framework.name === version.framework)[0].name
			version.furtherDevelopment = version.furtherDevelopment[0]
		})
		return frameworkVersionsData
	}

	if (loading) {
		return <CircularProgress size={75} thickness={4} className={classes.loader} />
	}

	return (
		<div className={classes.root}>
			<Header history={history} />
			<VisualizationsList
				history={history}
				frameworksData={frameworksData}
				frameworkVersionsData={frameworkVersionsData}
				matchingData={matchingData}
			/>
			<Footer />
		</div>
	)
}

export default VisualizationsView