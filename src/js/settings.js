/*

EP.Settings

Common settings used by other modules

Important:

	There should be 1 file per environment.
	This is an EXAMPLE file.
	Sensitive inforamtion has been removed.

	Use this file to set a configuration for a specific environement (rename to settings.<env name>.js)

*/

var EP = EP || {};

EP.Settings = {

	// Environement ('dev', 'test' or 'prod'), influence the publication
	environment: 'test',

	// Openshift server credentials.
	serverAuthUsername: 'ABC',
	serverAuthPassword: 'XYZ',

	// Value of 'from' field when sending emails
	emailFrom: 'Emakinapool test app <info@xyz.com>',

	// Force email recipient. If set, all emails are sent to this address. A must have in test environement!
	forceEmailTo: 'Emakinapool tester <abc@xyz.com>',

	// Confluence Page that holds all the league data.
	// ATTENTION: DO NOT USE THE PRODUCTION PAGE IN TEST or your tests will mess up the official players ratings.  
	pageId: '102662893',
	pageUrl: 'https://share.emakina.net/display/activities/Pool+League',

	// Elo config
	kFactor: 32,
	initialRating: 1500,

	// If set to true, the k factor is multiplied when matches involve multiple games
	biggerKFactorForLongerMatches: true,

	// Number of matches required before being officially ranked
	matchesRequired: 10,

	// Number of row initially shown in matches table
	matchesRows: 10,

	// Wether to allow loser to encode a match
	allowLoserToEncode: false,

	// List of admin users with advanced priviledges:
	// * can edit the page
	// * recieve errors by email
	// * the first admin is the contact for edit requests
	admins: [{
		username: 'rwa',
		email: 'rwa@emakina.com',
		name: 'Richard Walker'
	}],

	// Set to true to send error notifications by email to the admins.
	sendErrors: false,

	// Initial belt owner's username (used for data verification)
	initialBeltOwner: 'rwa'

}




try {
	module.exports = EP.Settings;
}
catch(e) {
	console.log('Module loaded ouside nodejs');
}
