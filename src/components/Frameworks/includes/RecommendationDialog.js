import React from 'react'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepButton from '@material-ui/core/StepButton'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import Slider from '@material-ui/core/Slider'
import makeStyles from '@material-ui/core/styles/makeStyles'


const useStyles = makeStyles(theme => ({
    button: {
        marginRight: theme.spacing(1),
    },
    checked: {
        color: theme.palette.primary.main
    }
}))

const RecommendationDialog = props => {
    const { filters, open, handleDialogClose, handleFiltersChange } = props

    const classes = useStyles()

    const [activeStep, setActiveStep] = React.useState(0)
    const [completed, setCompleted] = React.useState({})
    const [chosenFilters, setChosenFilters] = React.useState(filters)

    const steps = ['How many products should be developed?',
        'On which organizational level do you aim to scale?',
        'How many teams should be involved in the development?',
        'Which type of architecture design should be supported?'
    ]

    const handleRangeFilterChange = (filter, newValue) => {
        const newFilters = {
            ...chosenFilters,
            [filter]: newValue
        }
        setChosenFilters(newFilters)
    }

    const handleProductSupportChange = event => {
        const newFilters = {
            ...chosenFilters,
            multipleProductSupport: event.target.value === 'multiple'
        }
        setChosenFilters(newFilters)
    }

    const handleArrayFilterChange = (event, filter, item) => {
        const newFilters = {
            ...chosenFilters,
            [filter]: event.target.checked ? [...chosenFilters[filter], item] : chosenFilters[filter].filter(el => el !== item)
        }
        setChosenFilters(newFilters)
    }

    const getStepContent = step => {
        switch (step) {
            case 0:
                return (
                    <FormControl component='fieldset'>
                        <RadioGroup
                            aria-label='product-support'
                            name='product-support'
                            value={chosenFilters.multipleProductSupport ? 'multiple' : 'single'}
                            onChange={handleProductSupportChange}
                        >
                            <FormControlLabel value='single' control={<Radio className={classes.checked} color='primary' />} label='Single' />
                            <FormControlLabel value='multiple' control={<Radio className={classes.checked} color='primary' />} label='Multiple' />
                        </RadioGroup>
                    </FormControl>
                )
            case 1:
                return (
                    <List>
                        {['Enterprise', 'IT Organization', 'Portfolio', 'Program', 'Team'].map((item, index) => {
                            const labelId = `checkbox-list-label-${item}`
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Checkbox
                                            className={classes.checked}
                                            color='primary'
                                            onClick={event => handleArrayFilterChange(event, 'scalingLevel', item)}
                                            edge='start'
                                            checked={chosenFilters.scalingLevel.includes(item)}
                                            tabIndex={-1}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            color='primary'
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={item} />
                                </ListItem>
                            )
                        })}
                    </List>
                )
            case 2:
                return (
                    <Slider
                        value={chosenFilters.teamSize}
                        onChange={(event, newValue) => handleRangeFilterChange('teamSize', newValue)}
                        valueLabelDisplay='auto'
                        aria-labelledby='range-slider-teamSize'
                        getAriaValueText={() => chosenFilters.teamSize}
                        step={1}
                        min={0}
                        max={20}
                    />
                )
            case 3:
                return (
                    <List>
                        {['Emergent', 'Intentional', 'Emergent & Intentional'].map((item, index) => {
                            const labelId = `checkbox-list-label-${item}`
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Checkbox
                                            className={classes.checked}
                                            onClick={event => handleArrayFilterChange(event, 'architectureDesign', item)}
                                            edge='start'
                                            checked={chosenFilters.architectureDesign.includes(item)}
                                            tabIndex={-1}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            color='primary'
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={item} />
                                </ListItem>
                            )
                        })}
                    </List>
                )
            default:
                break
        }
    }

    const completedSteps = () => {
        return Object.keys(completed).length
    }

    const isLastStep = () => {
        return activeStep === steps.length - 1
    }

    const allStepsCompleted = () => {
        return completedSteps() === steps.length
    }

    const handleNextClick = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ?
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1
        setActiveStep(newActiveStep)
    }

    const handleBackClick = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const handleStepClick = step => () => {
        setActiveStep(step)
    }

    const handleReset = () => {
        setChosenFilters(filters)
        setActiveStep(0)
        setCompleted({})
    }

    const handleFilterClick = () => {
        const newCompleted = completed
        newCompleted[activeStep] = true
        setCompleted(newCompleted)

        handleFiltersChange(chosenFilters)

        if (allStepsCompleted()) {
            handleDialogClose()
            handleReset()
        } else {
            handleNextClick()
        }
    }

    const handleClose = () => {
        handleReset()
        handleDialogClose()
    }

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>Follow the steps to find your frameworks</DialogTitle>
            <DialogContent>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepButton onClick={handleStepClick(index)} completed={completed[index]} />
                        </Step>
                    ))}
                </Stepper>
                <DialogContentText color='secondary'>{steps[activeStep]}</DialogContentText>
                {getStepContent(activeStep)}

            </DialogContent>
            <DialogActions>
                <Button disabled={activeStep === 0} onClick={handleBackClick} className={classes.button}>
                    Back
                </Button>
                <Button
                    disabled={isLastStep()}
                    color='primary'
                    onClick={handleNextClick}
                    className={classes.button}
                >
                    Next
                </Button>
                <Button color='primary' onClick={handleFilterClick}>
                    {completedSteps() === steps.length - 1 ? 'Finish' : 'Filter'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default RecommendationDialog