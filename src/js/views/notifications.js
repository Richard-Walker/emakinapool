/*

EP.Notifications

*/

var EP = EP || {};

EP.Notifications = function() {

	EP.Notifications = {};

	var achievements = _(EP.CurrentUser.notifications).where({type: 'achievement'});
	
	if (achievements.length > 0) {

		var data = {
			achievements: _.chain(achievements).pluck('value').map(EP.Achievements.get).value(),
			currentLevel: EP.CurrentUser.level,
			nextLevel: EP.Achievements.nextLevel(EP.CurrentUser)
		}

		$('body').append(JST.achievementNotification(data));

		var dialog = AJS.dialog2('#achievement-notification');

		$('#achievement-close-button').click(function() {
			dialog.hide();
			EP.Players.removeNotifications(EP.CurrentUser.username);
		});

		dialog.show();

	}

}