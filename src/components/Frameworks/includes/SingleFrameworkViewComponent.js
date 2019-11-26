import React from 'react'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ClearIcon from '@material-ui/icons/ClearRounded'
import RemoveIcon from '@material-ui/icons/RemoveRounded'
import DoneIcon from '@material-ui/icons/DoneRounded'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { BASE_URL } from '../../../config'


const useStyles = makeStyles(theme => {
	const content = {
		flexGrow: 1,
		marginBottom: '-100px',
		backgroundColor: theme.palette.background.default,
		[theme.breakpoints.up('md')]: {
			padding: theme.spacing(7, 10, 8, 10),
		},
	}
	return {
		root: {
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			backgroundColor: theme.palette.common.white,
		},
		banner: {
			backgroundSize: 'auto 500px',
			backgroundRepeat: 'no-repeat',
			height: '600px',
			backgroundAttachment: 'fixed',
			backgroundPosition: '50% 70px',
		},
		contentArea: content,
		singleContentArea: {
			...content,
			marginTop: theme.spacing(7),
		},
		chip: {
			margin: theme.spacing(1, 1, 0, 0),
		}
	}
})

const SingleFrameworkViewComponent = props => {
	const { data } = props

	const classes = useStyles()

	const parts = [
		{
			title: 'Overview',
			sections: [
				{
					sectionName: 'Descriptive Information',
					attributes: [
						{
							heading: 'Name',
							content: data.name
						},
						{
							heading: 'Description',
							content: data.description
						},
						{
							heading: 'Methodologist',
							content: data.methodologist.sort()
						},
						{
							heading: 'Organization',
							content: data.organization.length > 0 ? data.organization.length === 1 ? data.organization[0] : data.organization : <RemoveIcon />
						},
						{
							heading: 'Publication Date',
							content: data.publicationDate
						},
						{
							heading: 'Category',
							content: data.category
						}
					]
				},
				{
					sectionName: 'Objectives',
					attributes: [
						{
							heading: 'Purpose',
							content: data.purpose ? data.purpose : <RemoveIcon />
						},
						{
							heading: 'Outcome',
							content: data.outcome ? data.outcome : <RemoveIcon />
						}
					]
				}
			]
		},
		{
			title: 'Adoption',
			sections: [
				{
					sectionName: 'Maturity',
					attributes: [
						{
							heading: 'Academic Contributions',
							content: data.contributions
						},
						{
							heading: 'Case Studies',
							content: data.caseStudies
						},
						{
							heading: 'Documentation',
							content: data.documentation ? <DoneIcon /> : <ClearIcon />
						},
						{
							heading: 'Training and Courses',
							content: data.trainingcourses ? <DoneIcon /> : <ClearIcon />
						},
						{
							heading: 'Community',
							content: data.community ? <DoneIcon /> : <ClearIcon />
						}
					]
				}
			]
		},
		{
			title: 'Scaling',
			sections: [
				{
					sectionName: 'Agile Foundations',
					attributes: [
						{
							heading: 'Agile Methods',
							content: data.agileMethods.length > 0 ? data.agileMethods.sort() : <RemoveIcon />
						},
						{
							heading: 'Agile Activities',
							content: data.agileActivities.length > 0 ? data.agileActivities.sort() : <RemoveIcon />
						},
						{
							heading: 'Agile Principles',
							content: data.agilePrinciples.length > 0 ? data.agilePrinciples.sort() : <RemoveIcon />
						},
						{
							heading: 'Agile Artifacts',
							content: data.agileArtifacts.length > 0 ? data.agileArtifacts.sort() : <RemoveIcon />
						}
					]
				},
				{
					sectionName: 'Concepts',
					attributes: [
						{
							heading: 'Multiple Product Support',
							content: data.multipleProductSupport ? <DoneIcon /> : <ClearIcon />
						},
						{
							heading: 'Scaling Level',
							content: data.scalingLevel.length > 0 ? data.scalingLevel : <RemoveIcon />
						},
						{
							heading: 'Roles',
							content: data.roles.length > 0 ? data.roles.sort() : <RemoveIcon />
						},
						{
							heading: 'Team Size',
							content: data.teamSizeMin && data.teamSizeMax > 0 ? 'from ' + data.teamSizeMin + ' to ' + data.teamSizeMax : <RemoveIcon />
						}
					]
				},
				{
					sectionName: 'Architecture',
					attributes: [
						{
							heading: 'Architecture Design',
							content: data.architectureDesign.length > 0 ? data.architectureDesign : <RemoveIcon />
						},
					]
				}
			]
		}
	]

	const [expanded, setExpanded] = React.useState(parts.map((part, index) => index))

	const handlePanelChange = index => () => {
		setExpanded(expanded.indexOf(index) !== -1 ? expanded.filter(item => item !== index) : [...expanded, index])
	}

	return (
		<div className={classes.root}>
			{data.pictureFileId && <div className={classes.banner} style={{ backgroundImage: `url(${BASE_URL}/file/${data.pictureFileId})` }}></div>}
			<Paper square elevation={24} className={data.pictureFileId ? classes.contentArea : classes.singleContentArea}>
				{parts.map((part, index) => (
					<ExpansionPanel key={index} expanded={expanded.indexOf(index) !== -1} onChange={handlePanelChange(index)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
							<Typography variant='h4'>{part.title}</Typography>
						</ExpansionPanelSummary>
						<Divider />
						{part.sections.map((section, index) => (
							<ExpansionPanelDetails key={index} style={{ display: 'block' }}>
								<Typography variant='h5'>{section.sectionName}</Typography>
								<table style={{ borderSpacing: '0px 20px' }}>
									<tbody >
										{section.attributes.map((attribute, index) => (
											<tr key={index} style={{ border: 'none' }}>
												<td style={{ width: '250px', paddingRight: '10px' }}>
													<Typography>{attribute.heading}</Typography>
												</td>
												<td>
													{Array.isArray(attribute.content) ?
														attribute.content.map((item, index) => (
															attribute.heading === 'Methodologist' ?
																<Chip key={index} className={classes.chip} avatar={<Avatar>{item.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}</Avatar>} label={item} />
																:
																<Chip key={index} className={classes.chip} label={item} />
														))
														:
														<Typography>{attribute.content}</Typography>
													}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{index < part.sections.length - 1 && <Divider light />}
							</ExpansionPanelDetails>
						))}
					</ExpansionPanel>
				))}
			</Paper>
		</div>
	)
}

export default SingleFrameworkViewComponent