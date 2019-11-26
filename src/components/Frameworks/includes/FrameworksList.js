import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { BASE_URL } from '../../../config'
import CardComponent from '../../CardComponent';


const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	cardsContainer: {
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
		marginTop: theme.spacing(10),
	},
	emptyText: {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	}
}))

const FrameworksList = props => {
	const { data, favorites, handleFavoritesChanged } = props

	const classes = useStyles()

	if (data.length === 0) {
		return (
			<div className={classes.root}>
				<Typography className={classes.emptyText} variant='h4' component='p'>&#x1F575; No frameworks were found with the selected filters.</Typography>
			</div>
		)
	}

	return (
		<div className={classes.root}>
			<Grid container direction='row' justify='space-evenly' alignItems='center' spacing={5} className={classes.cardsContainer}>
				{data.map((framework, index) => (
					<Grid key={index} item xs={12} md={6} lg={4} xl={3}>
						<CardComponent
							link={`/frameworks/${framework.name}`}
							imageLink={framework.pictureFileId && `${BASE_URL}/file/${framework.pictureFileId}`}
							title={framework.name}
							description={framework.description}
							actionIcon={
								<svg viewBox='0 0 24 24' width={35} height={35}>
									<path fill='#ffc7df' d='M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z' />
									<path fill='#ff006f' d='M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z' />
								</svg>
							}
							actionCheckedIcon={
								<svg viewBox='0 0 24 24' width={35} height={35}>
									<path fill='#ff006f' d='M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z' />
								</svg>
							}
							action={event => handleFavoritesChanged(event, framework.name)}
							actionChecked={favorites.includes(framework.name)}
						/>
					</Grid>
				))}
			</Grid>
		</div>
	)
}

export default FrameworksList