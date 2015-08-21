/*

EP.PlayersTable

*/

var EP = EP || {};

EP.PlayersTable = function() {

	EP.PlayersTable = {}

	// Remove usernames

	EP.Dom.$players.find('td:first-child').each(function () {
		var newHtml = $(this).html().replace(/ \(.*\)/,'');
		$(this).html(newHtml);
	})

	EP.Players.onready.add(function() {
	
		// Display players avatars
		_(EP.Players.list()).each(function (p) {
			var htmlAvatar = JST.playerAvatar(p);
			$(p.row).find('td').eq(0).prepend(htmlAvatar);
		})
	
		// Enable tooltips
		$('.players-table span[title]').tooltip();

	});

}