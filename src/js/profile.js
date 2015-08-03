/*

EP.Profile

Fills the profile section with information from the players table

*/

var EP = EP || {};

EP.Profile = function() {

	// Only available if user is registered
	
	if (!EP.CurrentUser.isRegistered) {return}

	// Get profile data from players table

	var $cells = EP.Dom.$players.find('td:first-child a[data-username="' + EP.CurrentUser.username + '"]').parents('tr').eq(0).find('td');

	EP.Profile = {
		username: EP.CurrentUser.username,
		picture: EP.CurrentUser.picture,
		ownsBelt: $cells.eq(0).find('p').is(':contains("Belt owner")'),
		stageName: $cells.eq(1).text(),
		matches: $cells.eq(2).text(),
		won: $cells.eq(3).text(),
		lost: $cells.eq(4).text(),
		rating: $cells.eq(5).text(),
		rank: $cells.eq(6).text(),
		level: $cells.eq(7).find('p').eq(0).text(),
		achievements: EP.Helpers.TooltipFormater.decodeToArray( $cells.eq(7).find('p').eq(1).find('a').attr('href') ),
		totalNumberOfAchievements: EP.Dom.Sections.$profileAchievements.find('table').slice(0,-1).find('tr:has(td)').length,
		perfects: $cells.eq(8).text()
	}
	
	EP.Profile.summary = EP.Profile.level.toUpperCase() + ' &nbsp;-&nbsp; Ranked #' + EP.Profile.rank;
	if (EP.Profile.ownsBelt) {
		EP.Profile.summary += ' &nbsp;-&nbsp; Belt owner';
	}

	// Inject data in profile section

	var $section = EP.Dom.Sections.$profileSummary;	
	$section.find('img').eq(0).attr('src', EP.Profile.picture).attr('');
	$section.html( EP.Helpers.expandVariables($section.html(), EP.Profile) );

	// Mark completed achievements

	var achievements = _(EP.Profile.achievements).map(function(a) { return a.toUpperCase() });
	var $matches = EP.Dom.Sections.$profileAchievements.find('td p:first-child').filter(function () { 
		return _(achievements).contains($(this).text().trim().toUpperCase());
	});
	$matches.closest('tr').addClass('completed');

	// Set gauge

	var percentage = Math.floor($matches.length / EP.Profile.totalNumberOfAchievements * 100);

	EP.Dom.Achievements.$gauge.before('<span id="achievements-gauge"> </span>');
	$('#achievements-gauge').css('width', percentage + '%');
	EP.Dom.Achievements.$gauge.text(percentage + '% completed');

	// Mark level related achievements

	var $match = EP.Dom.Sections.$profileAchievements.find('table').last().find('td>p:first-child').filter(function () { 
		return EP.Profile.level.toUpperCase() === $(this).text().trim().toUpperCase();
	});
	$match.closest('tr').addClass('completed').prevAll(':has(td)').addClass('completed');

};
