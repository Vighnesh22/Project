import React from 'react'

import Typography  from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'


const useStyles = makeStyles(theme => ({
    footer: {
        height: '62px',
        marginTop: '-62px',
        color: 'black',
        backgroundColor: 'white',
        marginTop: theme.spacing(4)
    }
}))

const Footer = () => {
    const classes = useStyles()

    return (
        <Grid container direction='row' justify='center' alignItems='center' alignContent='center' className={classes.footer}>
            <Grid item>
                <Typography variant='body1'>
                    © {new Date().getFullYear()} SEBIS. ALL RIGHTS RESERVED.
                </Typography>
            </Grid>
        </Grid>
    )
}

export default Footer