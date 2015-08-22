/*

EP.Settings

Common settings used by other modules

Important!

	There should be 1 file per environment.
	This example file is the only one commited.
	Sensitive inforamtion has been removed.

*/

var EP = EP || {};

EP.Settings = function() {

	EP.Settings = {

		// Environement name ('dev', 'test' or 'prod'), influence the publication
		environment: 'test',

		// Server credentials.
		serverAuthUsername: 'emakinapoolapp',
		serverAuthPassword: 'no1shouldbetrustEd',

		// Value of 'from' field when sending emails
		emailFrom: 'Emakinapool test app <info@league.emakinapool.xyz>',

		// Force email recipient. If set, all emails are sent to this address. A must have in test environement!
		forceEmailTo: 'Emakinapool tester <r.p.walker@gmail.com>',

		// Confluence Page that holds all the league data. DO NOT USE PRODUCTION PAGE IN TEST! 
		pageId: '102662893',
		pageUrl: 'https://share.emakina.net/display/activities/Pool+League',

		// Elo config
		kFactor: 32,
		initialRating: 1500,

		// Number of row initially shown in matches table
		matchesRows: 5
	}

};
