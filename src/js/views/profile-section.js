/*

EP.ProfileSection

Fills the profile section with information about the current user

*/

var EP = EP || {};

EP.ProfileSection = function() {

	// Only available if user is registered
	if (!EP.CurrentUser.isRegistered) {return}
	
	// Variables

	var variables = {
		summary : EP.CurrentUser.level.toUpperCase() + ' &nbsp;-&nbsp; ' + (EP.CurrentUser.rank ? 'Ranked #' + EP.CurrentUser.rank : 'Not ranked')
	}

	if (EP.CurrentUser.hasBelt) {
		variables.summary += ' &nbsp;-&nbsp; Belt owner';
	}

	// Inject data in profile section

	var $section = EP.Dom.Sections.$profileSummary;
	$section.find('img').eq(0).attr('src', EP.CurrentUser.picture).attr('');
	
	var html = $section.html();
	html = EP.Helpers.expandVariables(html, EP.CurrentUser);
	html = EP.Helpers.expandVariables(html, variables);
	$section.html(html);

	// Mark completed achievements

	var achievements = _(EP.CurrentUser.achievements).map(function(a) { return a.toUpperCase() });
	var $matches = EP.Dom.Sections.$profileAchievements.find('td p:first-child').filter(function () { 
		return _(achievements).contains($(this).text().trim().toUpperCase());
	});
	$matches.closest('tr').addClass('completed');

	// Set gauge
	var percentage = EP.Achievements.percentage(EP.CurrentUser);
	EP.Dom.Achievements.$gauge.before('<span id="achievements-gauge"> </span>');
	$('#achievements-gauge').css('width', percentage + '%');
	EP.Dom.Achievements.$gauge.text(percentage + '% completed');

	// Mark level related achievements
	var $match = EP.Dom.Sections.$profileAchievements.find('table').last().find('td>p:first-child').filter(function () { 
		return EP.CurrentUser.level.toUpperCase() === $(this).text().trim().toUpperCase();
	});
	$match.closest('tr').addClass('completed').prevAll(':has(td)').addClass('completed');

};
