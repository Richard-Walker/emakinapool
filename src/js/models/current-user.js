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
		var name = EP.Helpers.parseName(EP.Dom.$currentUser.attr('title'));
		EP.CurrentUser.firstName = name.firstName;
		EP.CurrentUser.lastName =  name.lastName;
	}

	EP.CurrentUser.picture = EP.Dom.$currentUser.find('.aui-avatar img').attr('src');

};
