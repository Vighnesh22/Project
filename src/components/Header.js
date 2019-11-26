import React from 'react'

import { Link } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/MenuRounded'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Zoom from '@material-ui/core/Zoom'
import Avatar from '@material-ui/core/Avatar'
import makeStyles from '@material-ui/core/styles/makeStyles'
import MessageIcon from '@material-ui/icons/MessageRounded'
import EmailIcon from '@material-ui/icons/EmailRounded'

import { MAIN_NAV_DATA, CONTACT_EMAIL_ADDRESS } from '../config'
import SignDialog from './SignDialog'


const useStyles = makeStyles(theme => ({
	logo: {
		width: 'auto',
		height: '40px',
		flexGrow: 1,
		marginRight: theme.spacing(5)
	},
	image: {
		height: '100%'
	},
	pageTitle: {
		display: 'flex'
	},
	desktopLink: {
		textDecoration: 'none',
		color: 'white',
	},
	mobileLink: {
		textDecoration: 'none',
		color: 'black',
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('lg')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('lg')]: {
			display: 'none',
		},
	},
	horizontalRule: {
		border: 0,
		borderTop: '2px solid white',
	},
	userAvatar: {
		backgroundColor: 'white',
		color: theme.palette.primary.main,
		fontSize: 16,
		height: '28px',
		width: '28px'
	}
}))

const HideOnScroll = props => {
	const { children } = props

	const trigger = useScrollTrigger()

	return (
		<Slide appear={false} direction='down' in={!trigger}>
			{children}
		</Slide>
	)
}

const Header = props => {
	const { history, additionalToolbarLeft, additionalToolbarRight, appBarClasses, elevation } = props

	const classes = useStyles()

	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(undefined)
	const [userAnchorEl, setUserAnchorEl] = React.useState(undefined)
	const [linkHover, setLinkHover] = React.useState()
	const [isAccountDialogOpen, setIsAccountDialogOpen] = React.useState(false)

	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
	const isUserMenuOpen = Boolean(userAnchorEl)

	const handleMobileMenuOpen = event => {
		setMobileMoreAnchorEl(event.currentTarget)
	}

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(undefined)
	}

	const handleUsereMenuOpen = event => {
		setUserAnchorEl(event.currentTarget)
	}


	const handleUsereMenuClose = () => {
		setUserAnchorEl(undefined)
		location.reload()
	}

	const handleLinkEnter = index => {
		setLinkHover(index)
	}

	const handleLinkLeave = () => {
		setLinkHover(undefined)
	}

	const handleMailClick = () => {
		window.location.href = `mailto:${CONTACT_EMAIL_ADDRESS}?subject=From SAH:`
	}

	const handleAccountClick = () => {
		setIsAccountDialogOpen(true)
	}

	const handleDialogClose = () => {
		setIsAccountDialogOpen(false)
	}

	const handleLogoutClick = () => {
		localStorage.removeItem('authentication')
		handleUsereMenuClose()
	}

	return (
		<div>
			<HideOnScroll {...props}>
				<AppBar className={appBarClasses} elevation={elevation !== undefined ? elevation : 3}>
					<Toolbar>
						<Link to='/' className={classes.logo}><img className={classes.image} src='assets/images/logo.png' alt='' /></Link>
						<Grid container spacing={5} direction='row' justify='flex-start' alignItems='center' className={classes.sectionDesktop}>
							{MAIN_NAV_DATA.map((data, index) => (
								<Grid key={index} item>
									<div className={classes.pageTitle}>
										{data.icon(undefined, { marginRight: '8px', paddingTop: '3px' })}
										<Link onMouseEnter={() => handleLinkEnter(index)} onMouseLeave={handleLinkLeave} className={classes.desktopLink} to={data.link}>
											<Typography variant='h6'>{data.title}</Typography>
										</Link>
									</div>
									<Zoom
										in={linkHover === index || history.location.pathname === data.link}
										{...(linkHover === index ? { timeout: { enter: 500, exit: 300 } } : {})}
									>
										<Divider className={classes.horizontalRule} />
									</Zoom>
								</Grid>
							))}
						</Grid>

						{additionalToolbarLeft}

						<IconButton
							aria-label='show more'
							aria-controls={'primary-search-account-menu-mobile'}
							aria-haspopup='true'
							onClick={handleMobileMenuOpen}
							color='inherit'
							className={classes.sectionMobile}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							anchorEl={mobileMoreAnchorEl}
							anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							id='primary-search-account-menu-mobile'
							keepMounted
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							open={isMobileMenuOpen}
							onClose={handleMobileMenuClose}
						>
							{MAIN_NAV_DATA.map((data, index) => (
								<Link key={index} className={classes.mobileLink} to={data.link}>
									<MenuItem>
										<Typography variant='body1' color={history.location.pathname === data.link ? 'secondary' : 'inherit'}>{data.title}</Typography>
									</MenuItem>
								</Link>
							))}
						</Menu>
						<IconButton
							aria-label='send an email'
							onClick={handleMailClick}
							color='inherit'
						>
							<EmailIcon />
						</IconButton>

						{localStorage.getItem('authentication') ?
							<div>
								<IconButton
									aria-label='account of current user'
									color='inherit'
									aria-controls='user-menu'
									aria-haspopup='true'
									onClick={handleUsereMenuOpen}
								>
									<Avatar className={classes.userAvatar}>
										{JSON.parse(localStorage.getItem('authentication')).user.split(/\s+/).map(name => name.charAt(0)).join('')}
									</Avatar>
								</IconButton>
								<Menu
									anchorEl={userAnchorEl}
									anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
									id='user-menu'
									keepMounted
									transformOrigin={{ vertical: 'top', horizontal: 'right' }}
									open={isUserMenuOpen}
									onClose={handleUsereMenuClose}
								>
									<MenuItem onClick={handleLogoutClick}>
										<Typography variant='body1'>Logout</Typography>
									</MenuItem>
								</Menu>
							</div>
							:
							<IconButton
								aria-label='sign up or sign in'
								onClick={handleAccountClick}
								color='inherit'
							>
								<AccountCircle />
							</IconButton>

						}

						{additionalToolbarRight}

					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<SignDialog open={isAccountDialogOpen} handleClose={handleDialogClose} />
		</div>
	)
}

export default Header