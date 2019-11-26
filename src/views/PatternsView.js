import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'

import ItemsService from '../services/ItemsService'
import PatternViewComponent from '../components/Patterns/PatternViewComponent'
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

const PatternsView = props => {
	const { history } = props

	const classes = useStyles()

	const [data, setData] = React.useState()
	const [loading, setLoading] = React.useState(true)

	const handleSetData = data => {
		setData(data)
	}

	React.useEffect(() => {
		const unresolvedData = ItemsService.getPatternData()
		const numEntities = unresolvedData.flatMap(e => e).length

		let dataSet = []
		unresolvedData.forEach((level, indexLevel) => {
			dataSet.push([])
			level.forEach(entity => {
				entity.promise.then(data => {
					dataSet[indexLevel].push({
						description: entity.description,
						data: data.value,
					})
					if (dataSet.reduce((sum, level) => sum + level.length, 0) === numEntities) {
						handleSetData(dataSet)
						setLoading(false)
					}
				})
			})
		})
	}, [])

	if (loading) {
		return <CircularProgress size={75} thickness={4} className={classes.loader} />
	}

	return (
		<div className={classes.root}>
			<PatternViewComponent history={history} data={data} />
			<Footer />
		</div>
	)
}

export default PatternsView
