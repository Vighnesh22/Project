import React from 'react'

import { Link } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import makeStyles from '@material-ui/core/styles/makeStyles'


const useStyles = makeStyles(theme => {
    const description = {
        marginTop: theme.spacing(1),
        overflow: 'scroll',
    }

    return {
        wrapper: {
            position: 'relative',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            transition: theme.transitions.create(
                ['box-shadow', 'transform'],
                { duration: theme.transitions.duration.standard, easing: theme.transitions.easing.easeInOut }
            ),
            willChange: 'box-shadow, transform',
            '&:hover': {
                boxShadow: '0 7px 18px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.05, 1.05)',
            },
            '&:hover div': {
                background: theme.palette.primary.main,
            },
            '& h2': {
                color: theme.palette.primary.main
            },
            '& p': {
                color: theme.palette.text.primary
            },
            '&:hover h2': {
                color: theme.palette.text.secondary
            },
            '&:hover p': {
                color: theme.palette.text.secondary
            },
            '&:hover svg': {
                color: theme.palette.common.white
            }
        },
        card: {
            height: 300,
            [theme.breakpoints.up('md')]: {
                height: 400
            },
            background: 'rgb(245, 245, 245)',
        },
        cardLink: {
            textDecoration: 'none',
        },
        media: {
            height: 140,
            [theme.breakpoints.up('md')]: {
                height: 240,
            },
            background: 'white'
        },
        mediaImage: {
            objectFit: 'scale-down'
        },
        standardDescription: {
            ...description,
            lineHeight: '26px',
            maxHeight: '78px',
        },
        standardDescriptionMissingImage: {
            ...description,
            lineHeight: '26px',
        },
        overlay: {
            position: 'absolute',
            top: theme.spacing(1),
            right: 0,
            backgroundColor: 'transparent',
        },
        titleMissingImage: {
            marginTop: theme.spacing(10)
        }
    }
})

const CardComponent = props => {
    const { link, imageLink, title, description, actionIcon, actionCheckedIcon, action, actionChecked, cardClass, mediaClass, mediaImageClass } = props

    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <Link to={link} className={classes.cardLink}>
                <Card className={cardClass || classes.card}>
                    {imageLink &&
                        <CardMedia
                            className={mediaClass || classes.media}
                            component='img'
                            src={imageLink}
                            onError={error => { error.target.src = 'assets/images/Image404_cardView.png' }}
                            classes={{media: mediaImageClass || classes.mediaImage}}
                        />
                    }
                    <CardContent>
                        {typeof title === 'string' ? <Typography noWrap variant='h4' component='h2' className={!imageLink ? classes.titleMissingImage : ''}>{title}</Typography> : title}
                        <Typography className={imageLink ? classes.standardDescription : classes.standardDescriptionMissingImage} variant='body1' component='p'>
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
            {action &&
                <FormControlLabel
                    className={classes.overlay}
                    control={
                        <Checkbox
                            icon={actionIcon}
                            checkedIcon={actionCheckedIcon}
                            onClick={action}
                            checked={actionChecked}
                        />
                    }
                />
            }
        </div>
    )
}

export default CardComponent