import React from 'react'
import { Helmet } from 'react-helmet';
import Particles from 'react-particles-js'
import { Parallax } from 'react-scroll-parallax'

import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'

import { PARTICLES_CONFIG, MAIN_NAV_DATA, MAIN_TEAM_DATA } from '../../config'
import CardComponent from '../CardComponent';


const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    titleContainer: {
        position: 'relative',
        textAlign: 'center'
    },
    title: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        color: theme.palette.primary.contrastText,
        opacity: 0,
        willChange: 'opacity',
        transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1) 2300ms',
    },
    mainArea: {
        borderRadius: '10px',
        padding: theme.spacing(3, 2, 0, 2),
        marginBottom: '-370px',
        [theme.breakpoints.up('md')]: {
            borderRadius: '20px',
            margin: theme.spacing(0, 10, 0, 10),
            padding: theme.spacing(8, 9, 0, 9)
        },
    },
    particles: {
        background: theme.palette.primary.main,
        height: 200,
        [theme.breakpoints.up('md')]: {
            height: 450
        },
    },
    parallax: {
        marginTop: '-290px',
        [theme.breakpoints.up('md')]: {
            marginTop: '-180px',
        },
    },
    cardsContainer: {
        padding: theme.spacing(4, 5, 0, 5)
    },
    card: {
        background: '#fafafa',
        height: 300,
        [theme.breakpoints.up('md')]: {
            height: 380
        },
    },
    media: {
        height: 150,
        background: 'white',
        [theme.breakpoints.up('md')]: {
            height: 250,
        },
    },
    mediaImage: {
        objectFit: 'cover'
    },
    textContainer: {
        textAlign: 'center',
        marginTop: theme.spacing(5),
    },
    personContainer: {
        textAlign: 'center',
        marginTop: theme.spacing(5)
    },
    personSection: {
        width: 350
    },
    avatar: {
        width: 150,
        height: 150,
        [theme.breakpoints.up('md')]: {
            width: 200,
            height: 200,
        },
        marginBottom: theme.spacing(2)
    },
    logo: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, opacity',
        opacity: 1,
        '& path': {
            stroke: 'white',
            strokeWidth: 2,
            willChange: 'fill-opacity, stroke-dashoffset',
        },
        '& path:nth-child(1)': {
            fillOpacity: 0,
            fill: 'white',
            strokeDasharray: '758px',
            strokeDashoffset: '758px',
            transition: 'fill-opacity 1500ms cubic-bezier(0.33, 0, 0.75, 0.96) 1100ms, stroke-dashoffset 1900ms cubic-bezier(0.4, 0, 0.2, 1) 100ms',
        },
        '& path:nth-child(2)': {
            fillOpacity: 0,
            fill: 'white',
            strokeDasharray: '483px',
            strokeDashoffset: '483px',
            transition: 'fill-opacity 1500ms cubic-bezier(0.33, 0, 0.75, 0.96) 1100ms, stroke-dashoffset 1600ms cubic-bezier(0.4, 0, 0.2, 1) 400ms',
        },
        '& path:nth-child(3)': {
            fillOpacity: 0,
            fill: 'white',
            strokeDasharray: '209px',
            strokeDashoffset: '209px',
            transition: 'fill-opacity 1500ms cubic-bezier(0.33, 0, 0.75, 0.96) 1100ms, stroke-dashoffset 1400ms cubic-bezier(0.4, 0, 0.2, 1) 600ms',
        },
        transition: 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1) 2000ms, opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1) 2000ms',
    },
}))

const HomeViewComponent = () => {
    const classes = useStyles()
    const theme = useTheme()

    const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <div className={classes.root}>
            <Helmet>
          <title>Recommender systems for scaling Agile frameworks</title>
          <meta name="description" content="Large scale agile development" />
          <meta name="theme-color" content="#008f68" />
          <meta name="keywords" content="xxxxxxxxxxxx" />
        </Helmet>
            <div className={classes.titleContainer}>
                <Particles params={PARTICLES_CONFIG(window.innerWidth)} className={classes.particles} />
                <svg className={classes.logo} style={loaded ? window.innerWidth > 960 ? { transform: `translate(-${window.innerWidth / 3}px, -50%)` } : { opacity: 0 } : {}} width={180} viewBox="0 0 204 175">
                    <path style={loaded ? { fillOpacity: 1, strokeDashoffset: '0px' } : {}} d='M 1.01,170.01 C 1.01,170.01 13.94,169.88 13.94,169.88 13.94,169.88 101.00,26.00 101.00,26.00 101.00,26.00 188.06,170.00 188.06,170.00 188.06,170.00 203.02,170.02 203.02,170.02 203.02,170.02 101.98,1.01 101.98,1.00 101.98,0.99 1.01,170.01 1.01,170.01 Z' />
                    <path style={loaded ? { fillOpacity: 1, strokeDashoffset: '0px' } : {}} d='M 100.94,53.03 C 100.94,53.03 165.98,161.00 165.98,161.00 165.98,161.00 151.00,161.02 151.00,161.02 151.00,161.02 100.98,73.96 100.98,73.96 100.98,73.96 51.00,161.00 51.00,161.00 51.00,161.00 35.99,161.01 35.99,161.01 35.99,161.01 100.94,53.03 100.94,53.03 Z' />
                    <path style={loaded ? { fillOpacity: 1, strokeDashoffset: '0px' } : {}} d='M 66.00,155.00 C 66.00,155.00 136.00,155.00 136.00,155.00 136.00,155.00 100.99,95.00 100.99,95.00 100.99,95.00 66.00,155.00 66.00,155.00 Z' />
                </svg>
                <Typography className={classes.title} style={loaded ? { opacity: 1 } : {}} variant='h1'>SCALING AGILE HUB</Typography>
            </div>
            <Parallax y={[30, -30]} className={classes.parallax}>
                <Paper className={classes.mainArea} elevation={24}>
                    <Grid container direction='row' justify='space-evenly' alignItems='center' spacing={5}>
                        {MAIN_NAV_DATA.map((data, index) => (
                            <Grid key={index} item xs={12} lg={4}>
                                <CardComponent
                                    link={data.link}
                                    imageLink={data.picture}
                                    title={
                                        <div style={{ display: 'flex' }}>
                                            {data.icon('primary', { marginRight: theme.spacing(1), fontSize: 35 })}
                                            <Typography variant='h4' component='h2'>
                                                {data.title}
                                            </Typography>
                                        </div>
                                    }
                                    description={data.description}
                                    cardClass={classes.card}
                                    mediaClass={classes.media}
                                    mediaImageClass={classes.mediaImage}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid className={classes.textContainer} container spacing={10} direction='column' justify='center' alignItems='center'>
                        <Grid item container spacing={2} direction='column' justify='center' alignItems='center'>
                            <Grid item>
                                <Typography variant='h3' color='primary'>Our Mission</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant='body1' color='textPrimary'>We want to provide practitioners and researchers a comprehensive overview of scaling agile frameworks and best practices for recurring challenges in large-scale agile development.</Typography>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={2} direction='column' justify='center' alignItems='center'>
                            <Grid item>
                                <Typography variant='h3' color='primary'>Team</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant='body1' color='textPrimary'>The Scaling Agile Hub is developed by sebis, Prof. Dr. Florian Matthes' Chair for Software Engineering for Business Information Systems at Technical University of Munich (TUM).</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid className={classes.personContainer} container spacing={10} direction='row' justify='space-around' alignItems='center'>
                        {MAIN_TEAM_DATA.map((data, index) => (
                            <Grid key={index} className={classes.personSection} item xs={12} md={4} container direction='column' justify='center' alignItems='center'>
                                <Grid item>
                                    <a href={data.link}><Avatar className={classes.avatar} src={data.picture}></Avatar></a>
                                </Grid>
                                <Grid item>
                                    <Typography variant='h5' color='primary'>{data.name}</Typography>
                                    <Typography variant='h6'>{data.role}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                </Paper>
            </Parallax>
        </div>
    )
}

export default HomeViewComponent