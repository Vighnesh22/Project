import FetchService from './FetchService'
import { WORKSPACE_URL } from '../config'
import { PATTERNS_MXL_URL } from '../constants';

export default class ItemsService {

	// Returns token from the local storage
	static getBearerToken() {
		return 'Bearer ' + JSON.parse(localStorage.getItem('authentication')).token;
	}

	static getFrameworks() {
		return FetchService.sendPost(WORKSPACE_URL, { expression: this.getFrameworksQuery() })
	}

	static getFramework(id) {
		return FetchService.sendPost(WORKSPACE_URL, { expression: this.getFrameworksQuery() + ".where(id = \"" + id + "\" )" })
	}

	static getFrameworkVersions() {
		return FetchService.sendPost(WORKSPACE_URL, { expression: this.getFrameworkVersionsQuery() })
	}

	static getFrameworkVersion(id) {
		return FetchService.sendPost(WORKSPACE_URL, { expression: this.getFrameworkVersionsQuery() + ".where(id = \"" + id + "\" )" })
	}

	static getPatternElement(entity, id) {
		const entities = {
			Stakeholders: this.getStakeholdersQuery,
			Concerns: this.getConcernsQuery,
			Principles: this.getPrinciplesQuery,
			CoordinationPatterns: this.getCoordinationPatternsQuery,
			MethodologyPatterns: this.getMethodologyPatternsQuery,
			VisualizationPatterns: this.getVisualizationPatternsQuery,
			AntiPatterns: this.getAntiPatternsQuery
		}
		return FetchService.sendPost(PATTERNS_MXL_URL, { expression: entities[entity.replace(/\s/g, '')]() + ".where(id = \"" + id + "\" )" })
	}

	static getPatternData() {
		return [
			[
				{ description: "Stakeholders", query: this.getStakeholdersQuery }
			],
			[
				{ description: "Concerns", query: this.getConcernsQuery }
			],
			[
				{ description: "Anti Patterns", query: this.getAntiPatternsQuery }
			],
			[
				{ description: "Principles", query: this.getPrinciplesQuery },
				{ description: "Coordination Patterns", query: this.getCoordinationPatternsQuery },
				{ description: "Methodology Patterns", query: this.getMethodologyPatternsQuery }
			],
			[
				{ description: "Visualization Patterns", query: this.getVisualizationPatternsQuery }
			]
		].map(level => {
			return level.map(entity => {
				return {
					description: entity.description,
					promise: FetchService.sendPost(PATTERNS_MXL_URL, { expression: entity.query() })
				}
			})
		})
	}

	static getMatchingData() {
		return [
			{ description: "Agile Methods", element: "Foundational Method", relation: "Foundational Methods" },
			{ description: "Agile Activities", element: "Foundational Activity", relation: "Foundational Activities" },
			{ description: "Agile Principles", element: "Foundational Principle", relation: "Foundational Principles" },
			{ description: "Agile Artifacts", element: "Foundational Artifact", relation: "Foundational Artifacts" }
		].map(({ description, element, relation }) => ({
			description: description,
			promise: FetchService.sendPost(WORKSPACE_URL, { expression: `find('${element}').select({id, name, frameworks: get Framework whereis '${relation}'.select({id, name})})` })
		}))
	}

	static getFrameworksQuery() {
		return "find(Framework).select({" +
			"id," +
			"name: Name," +
			"description: Description," +
			"purpose: Purpose," +
			"outcome: Outcome," +
			"pictureFileId: 'Picture File Id'," +
			"rating: Rating," +
			"caseStudies: Cases," +
			"teamSizeMin: 'Team Size Min'," +
			"teamSizeMax: 'Team Size Max'," +
			"multipleProductSupport: 'Multiple Product Support'," +
			"category: Category," +
			"community: Community," +
			"contributions: Contributions," +
			"documentation: Documentation," +
			"methodologist: Methodologist.select(name)," +
			"organization: Organization.select(name)," +
			"roles: Roles.select(name)," +
			"website: Website," +
			"publicationDate: 'Publication Date'," +
			"scalingLevel:'Scaling Level'," +
			"trainingCourses: 'Training Courses'," +
			"agileMethods: 'Foundational Methods'.select(name)," +
			"agileActivities: 'Foundational Activities'.select(name)," +
			"agilePrinciples: 'Foundational Principles'.select(name)," +
			"agileArtifacts: 'Foundational Artifacts'.select(name)," +
			"frameworkVersions: 'Framework Versions'.select(name)," +
			"architectureDesign: 'Architecture Design'" +
			"})"
	}

	static getFrameworkVersionsQuery() {
		return "find('Framework Version').select({" +
			"id," +
			"name: Name," +
			"framework: Framework.select(name)," +
			"furtherDevelopment: Framework.select('Further Development')," +
			"influencedBy: 'Influenced By'.select(name)," +
			"publicationDate: 'Publication Date'," +
			"supersededBy: 'Superseded By'.select(name)" +
			"})"
	}

	static getStakeholdersQuery() {
		return "find(Stakeholder).select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"alias: alias," +
			"concerns: has.select({id: id, identifier: identifier, name: name})" +
			"})"
	}

	static getConcernsQuery() {
		return "find(Concern).select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"category: category," +
			"scalingLevel: 'scaling level'," +
			"principles: 'is addressed by (Principle)'.select({id: id, identifier: identifier, name: name})," +
			"coordinationPatterns: 'is addressed by (C-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"methodologyPatterns: 'is addressed by (M-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"visualizationPatterns: 'is addressed by (V-Pattern)'.select({id: id, identifier: identifier, name: name})" +
			"})"
	}

	static getPrinciplesQuery() {
		return "find('Principle').select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"visualizationPatterns: 'utilizes (V-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"alias: alias," +
			"consequences: consequences," +
			"context: context," +
			"forces: forces," +
			"knownUses: 'known uses'," +
			"otherStandards: 'other standards'," +
			"problem: problem," +
			"rationale: rationale," +
			"variants: variants," +
			"seeAlso: 'see also'" +
			"})"
	}

	static getCoordinationPatternsQuery() {
		return "find('Coordination Pattern').select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"coordinationPatterns: 'utilizes (CO-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"methodologyPatterns: 'utilizes (M-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"visualizationPatterns: 'utilizes (V-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"knownUses: 'known uses'," +
			"otherStandards: 'other standards'," +
			"problem: problem," +
			"seeAlso: 'see also'," +
			"alias: alias," +
			"consequences: consequences," +
			"context: context," +
			"example: example," +
			"forces: forces," +
			"implementation: implementation," +
			"solution: solution," +
			"summary: summary," +
			"variants: variants" +
			"})"
	}

	static getMethodologyPatternsQuery() {
		return "find('Methodology Pattern').select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"methodologyPatterns: 'uses results of (M-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"visualizationPatterns: 'utilizes (V-Pattern)'.select({id: id, identifier: identifier, name: name})," +
			"knownUses: 'known uses'," +
			"otherStandards: 'other standards'," +
			"problem: problem," +
			"seeAlso: 'see also'," +
			"alias: alias," +
			"consequences: consequences," +
			"context: context," +
			"example: example," +
			"forces: forces," +
			"implementation: implementation," +
			"solution: solution," +
			"summary: summary," +
			"variants: variants" +
			"})"
	}

	static getVisualizationPatternsQuery() {
		return "find('Visualization Pattern').select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"knownUses: 'known uses'," +
			"otherStandards: 'other standards'," +
			"problem: problem," +
			"seeAlso: 'see also'," +
			"alias: alias," +
			"consequences: consequences," +
			"context: context," +
			"example: example," +
			"forces: forces," +
			"implementation: implementation," +
			"solution: solution," +
			"summary: summary," +
			"variants: variants," +
			"type: type" +
			"})"
	}

	static getAntiPatternsQuery() {
		return "find('Anti-Pattern').select({" +
			"id: id," +
			"identifier: identifier," +
			"name: Name," +
			"alias: alias," +
			"consequences: consequences," +
			"context: context," +
			"example: example," +
			"forces: forces," +
			"generalForm: 'general form'," +
			"otherStandards: 'other standards'," +
			"problem: problem," +
			"revisedSolution: 'revised solution'," +
			"seeAlso: 'see also'," +
			"summary: summary," +
			"variants: variants" +
			"})"
	}

	static getToken(username, password) {
		return FetchService.sendPost('https://sah.sebis.in.tum.de/api/v1/jwt', { username: username, password: password })
	}

	static getUserInfo(userId, token) {
		return FetchService.sendGet(`https://sah.sebis.in.tum.de/api/v1/users/${userId}`, {"Authorization": `Bearer ${token}`})
	}

	static getNewUser(name, email, password) {
		return FetchService.sendPost('https://sah.sebis.in.tum.de/api/v1/users', { name: name, email: email, password: password })
	}

	// Hardcoded the id of the entityType
	static createPattern(id,name,attributes){
		return FetchService.sendPost('https://sah.sebis.in.tum.de/api/v1/entityTypes/'+ id +'/entities', {
			"name": name,
			"attributes":attributes
		},{authorization: this.getBearerToken()})
	}

	// Hardcoded the id of the created entity
	static editPattern(id,name,attributes){
		return FetchService.sendPut('https://sah.sebis.in.tum.de/api/v1/entities/'+ id, {
			"name": name,
			"attributes":attributes
		},{authorization: this.getBearerToken()})
	}
}

