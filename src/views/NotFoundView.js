import React from 'react'

import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import Footer from '../components/Footer'
import Header from '../components/Header';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fafafa',
        textAlign: 'center'
    },
    text: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}))

const NotFoundView = props => {
    const { history } = props

    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Header history={history} />
            <Typography className={classes.text} variant='h2' component='h5'>404<br></br>Don't know what you're looking for, but it's certainly not here :(</Typography>
            <Footer />
        </div>
    )
}

export default NotFoundView