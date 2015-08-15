/*

EP.CurrentUser

Information about the logged user

*/

var EP = EP || {};

EP.CurrentUser = function() {

	var username = EP.Dom.$currentUser.attr('data-username');
	var player = EP.Players.get(username);

	EP.CurrentUser = player || { username: username, } ; 
	EP.CurrentUser.isRegistered = player !== undefined;

	if (!EP.CurrentUser.isRegistered) {
		var fullName = EP.Dom.$currentUser.attr('title');
		var nameParts = fullName.match(/(\w+) ([\w ]*)/i) || [fullName, fullName, ''];
		EP.CurrentUser.firstName = nameParts[1];
		EP.CurrentUser.lastName =  nameParts[2];
	}

	EP.CurrentUser.picture = EP.Dom.$currentUser.find('.aui-avatar img').attr('src');

};
