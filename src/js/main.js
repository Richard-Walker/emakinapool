/*

Entry point

*/


var EP = EP || {};

$(function () {
	
	// Global stuff
	EP.Settings();
	EP.Helpers();
	EP.Confluence();
	EP.Dom();
	EP.Mail();
	
	// Models
	EP.Data();
	EP.Player();
	EP.Match();
	EP.Achievements();
	EP.Players();
	EP.Matches();
	EP.CurrentUser();

	// Views
	EP.Page();
	EP.ProfileSection();
	EP.PlayersTable();
	EP.MatchesTable();

	// Dialogs
	EP.SubmitMatchDialog();
	EP.RegisterDialog();
	EP.InviteDialog();

	// Notifs
	EP.Notifications();

});
