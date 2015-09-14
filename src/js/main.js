/*

Entry point

*/


var EP = EP || {};

$(function () {
	
	// Global stuff
	EP.Helpers();
	EP.Rating();
	EP.Confluence();
	EP.Dom();
	EP.Mail();
	
	// Models
	EP.Data();
	EP.Properties();
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
	EP.RegisterDialog();
	EP.SubmitMatchDialog();
	EP.PlayDialogs();
	EP.InviteDialog();

	// Notifs
	EP.Notifications();

});
