import React from 'react'

import SwipeableViews from 'react-swipeable-views'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import CircularProgress from '@material-ui/core/CircularProgress'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Visibility from '@material-ui/icons/Visibility'
import LockOpenIcon from '@material-ui/icons/LockOpenRounded'
import CloseIcon from '@material-ui/icons/CloseRounded'

import ItemsService from '../services/ItemsService'


const useStyles = makeStyles(theme => {
	const avatar = {
		marginBottom: theme.spacing(2),
		height: 50,
		width: 50,
	}
	return {
		root: {
			padding: theme.spacing(6, 6, 10, 6),
			textAlign: 'center'
		},
		avatarLocked: {
			...avatar,
			backgroundColor: theme.palette.secondary.main,
		},
		avatarUnlocked: {
			...avatar,
			backgroundColor: theme.palette.primary.main,
		},
		form: {
			width: '100%',
			marginTop: theme.spacing(3),
		},
		submit: {
			marginTop: theme.spacing(3),
		},
		login: {
			marginTop: theme.spacing(2)
		},
		wrapper: {
			position: 'relative',
			display: 'inline-block'
		},
		progress: {
			position: 'absolute',
			top: -4,
			left: -4,
		},
		closeIcon: {
			position: 'absolute',
			top: 2,
			right: 3
		}
	}
})

const SignDialog = props => {
	const { open, handleClose } = props

	const classes = useStyles()
	const theme = useTheme()

	const [selected, setSelected] = React.useState(0)
	const [firstName, setFirstName] = React.useState('')
	const [lastName, setLastName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [showPassword, setShowPassword] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [success, setSuccess] = React.useState(false)
	const [inputErrorMessage, setInputErrorMessage] = React.useState()

	const [isLoggedIn, setIsLoggedIn] = React.useState(false);
	const [isAdmin, setIsAdmin] = React.useState(false);
	const [isVerified, setIsVerified] = React.useState(false);

	const handleSignInSwitch = () => {
		setSelected(1)
	}

	const validateInput = () => {
		if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email)) {
			throw Error('Email address is not valid.')
		}
		if (password === '') {
			throw Error('Please enter your password.')
		}
		if (!selected && firstName === '') {
			throw Error('First name must be given.')
		}
		if (!selected && lastName === '') {
			throw Error('Last name must be given.')
		}
	}

	const handleSignInClick = () => {
		try {
			validateInput()

			ItemsService.getToken(email, password).then(data => {
				localStorage.setItem('authentication', JSON.stringify({ user: data.payload.name, token: data.token, expires: data.payload.exp * 1000 }))
				setIsLoggedIn(true);
				getUserInfo(data.payload.sub, data.token);
				setLoading(true)
				setTimeout(() => {
					setLoading(false)
					setSuccess(true)
					setTimeout(() => {
						handleClose()
						setTimeout(() => {
							setSuccess(false)
							setInputErrorMessage('')
						}, 1000)
					}, 800)
				}, 2000)
			}).catch(error => {
				if (error.message === 'Unauthorized') {
					setInputErrorMessage('Sorry, either your email address or password are incorrect. Please check your credentials and try again.')
				}
			})
		} catch (error) {
			setInputErrorMessage(error.message)
		}
	}

	const getUserInfo = (userId, token) => {
		ItemsService.getUserInfo(userId, token).then(data => {
			setIsAdmin(data.isAdministrator);
			setIsVerified(data.isVerified);
		}).catch(error => {
			if (error.message === 'Unauthorized') {
				setInputErrorMessage('Sorry, you are not authorized to make this request.')
			}
		})
	}

	const handleSignUpClick = () => {
		try {
			validateInput()

			ItemsService.getNewUser([firstName, lastName].join(' '), email, password).then(data => {
				setLoading(true)
				setTimeout(() => {
					setLoading(false)
					setSuccess(true)
					setTimeout(() => {
						handleClose()
						setTimeout(() => {
							setSuccess(false)
							setInputErrorMessage('')
						}, 1000)
					}, 800)
				}, 2000)
			}).catch(error => {
				if (error.message === 'Not Acceptable') {
					setInputErrorMessage(`An account with the E-Mail address "${email}" already exists. Please try to sign in.`)
				}
			})
		} catch (error) {
			setInputErrorMessage(error.message)
		}
	}

	const handleShowPasswordClick = () => {
		setShowPassword(!showPassword)
	}

	const handleSignUpSwitch = () => {
		setSelected(0)
	}

	const handleIndexChange = index => {
		setSelected(index)
	}

	const handleChange = event => {
		switch (event.target.name) {
			case 'firstName':
				setFirstName(event.target.value)
				break
			case 'lastName':
				setLastName(event.target.value)
				break
			case 'email':
				setEmail(event.target.value)
				break
			case 'password':
				setPassword(event.target.value)
				break
			default:
				break
		}
	}

	return (
		<Dialog
			fullScreen={window.innerWidth < 960}
			open={open}
			onClose={() => {
				setInputErrorMessage('')
				handleClose()
			}}
			aria-labelledby='account-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<IconButton className={classes.closeIcon} color='inherit' onClick={handleClose} aria-label='close'>
				<CloseIcon />
			</IconButton>
			<div className={classes.root}>
				<div className={classes.wrapper}>
					<Avatar className={success ? classes.avatarUnlocked : classes.avatarLocked}>
						{success ? <LockOpenIcon /> : <LockOutlinedIcon />}
					</Avatar>
					{loading && <CircularProgress size={58} className={classes.progress} />}
				</div>

				<SwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={selected}
					onChangeIndex={handleIndexChange}
				>
					<Grid item container direction='column' justify='space-evenly' alignItems='center' index={0}>
						<Grid item xs={12}>
							<Typography component='h1' variant='h5'>Sign up</Typography>
						</Grid>
						<form className={classes.form} onSubmit={handleSignUpClick}>
							<Grid item xs={12} container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField
										InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
										autoComplete='fname'
										name='firstName'
										variant='outlined'
										required
										fullWidth
										id='firstName'
										label='First Name'
										autoFocus
										onChange={handleChange}
										value={firstName}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
										variant='outlined'
										required
										fullWidth
										id='lastName'
										label='Last Name'
										name='lastName'
										autoComplete='lname'
										onChange={handleChange}
										value={lastName}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
										variant='outlined'
										required
										fullWidth
										id='email'
										label='Email Address'
										name='email'
										autoComplete='email'
										onChange={handleChange}
										value={email}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
										variant='outlined'
										required
										fullWidth
										name='password'
										label='Password'
										type={showPassword ? 'text' : 'password'}
										id='password'
										autoComplete='current-password'
										onChange={handleChange}
										value={password}
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton
														edge='end'
														aria-label='toggle password visibility'
														onClick={handleShowPasswordClick}
													>
														{showPassword ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<Button
										fullWidth
										variant='contained'
										color='primary'
										disabled={loading || success}
										className={classes.submit}
										onClick={handleSignUpClick}
									>
										Sign up
			        					</Button>
								</Grid>
								<Grid item>
									<Link variant='body2' onClick={handleSignInSwitch}>
										Already have an account? Sign in.
              							</Link>
								</Grid>
								<Grid item xs={12}>
									<Typography color='error' style={{ display: inputErrorMessage ? 'block' : 'none' }}>{inputErrorMessage}</Typography>
								</Grid>
							</Grid>
						</form>
					</Grid>

					<Grid item container direction='column' justify='space-evenly' alignItems='center' index={0}>
						<Grid item xs={12}>
							<Typography component='h1' variant='h5'>Sign in</Typography>
						</Grid>
						<form className={classes.form} onSubmit={handleSignInClick}>
							<Grid item xs={12} container spacing={2}>
								<Grid item xs={12}>
									<TextField
										InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
										variant='outlined'
										required
										fullWidth
										id='email'
										label='Email Address'
										name='email'
										autoComplete='email'
										onChange={handleChange}
										value={email}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										InputLabelProps={{ style: { color: theme.palette.secondary.main } }}
										variant='outlined'
										required
										fullWidth
										name='password'
										label='Password'
										type={showPassword ? 'text' : 'password'}
										id='password'
										autoComplete='current-password'
										onChange={handleChange}
										value={password}
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton
														edge='end'
														aria-label='toggle password visibility'
														onClick={handleShowPasswordClick}
													>
														{showPassword ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<Button
										fullWidth
										variant='contained'
										color='primary'
										disabled={loading || success}
										className={classes.submit}
										onClick={handleSignInClick}
									>
										Sign in
			        					</Button>
								</Grid>
								<Grid item>
									<Link variant='body2' onClick={handleSignUpSwitch}>
										Don't have an account yet? Sign up.
              							</Link>
								</Grid>
								<Grid item xs={12}>
									<Typography color='error' style={{ display: inputErrorMessage ? 'block' : 'none' }}>{inputErrorMessage}</Typography>
								</Grid>
							</Grid>
						</form>
					</Grid>
				</SwipeableViews>
			</div>
		</Dialog>
	)
}

export default SignDialog