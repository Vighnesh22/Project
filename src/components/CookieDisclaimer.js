import React from 'react'

import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import CloseIcon from '@material-ui/icons/CloseRounded'


const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	}
}))

const CookieDisclaimer = props => {
	const { open, handleClose } = props

	const classes = useStyles()

	const SlideTransition = props => {
		return <Slide {...props} direction='up' />
	}

	return (
		<div>
			<Snackbar
				className={classes.root}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={open}
				onClose={handleClose}
				ContentProps={{ 'aria-describedby': 'message-id', }}
				message={
					<Typography variant='body1' id='message-id'>
						&#x1F36A; We use cookies to enable site functionality. We do not use, store or distribute any personal information.
					</Typography>
				}
				action={
					<IconButton
						key='close'
						aria-label='close'
						color='inherit'
						className={classes.close}
						onClick={handleClose}
					>
						<CloseIcon />
					</IconButton>
				}
				TransitionComponent={SlideTransition}
			/>
		</div>
	)
}

export default CookieDisclaimer