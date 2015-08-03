/*

EP.CurrentUser

Information about the logged user

*/

var EP = EP || {};

EP.CurrentUser = function() {

	var username = EP.Dom.$currentUser.attr('data-username');

	EP.CurrentUser = {
		username : username,
		isRegistered : EP.Dom.$players.find('td:first-child a').is('[data-username="' + username + '"]'),
		picture:  EP.Dom.$currentUser.find('.aui-avatar img').attr('src')
	};

};
