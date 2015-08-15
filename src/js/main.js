/*

Entry point

*/

$(function () {
	
	// Global stuff
	EP.Settings();
	EP.Helpers();
	EP.Dom();
	
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
	//EP.PlayersTable();
	//EP.MatchesTable();

	// Dialogs
	EP.SubmitMatchDialog();
	EP.RegisterDialog();

});
