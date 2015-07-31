/*

Common settings and data used by other modules (EP.Settings)

*/

var EP = EP || {};

$(function() {

	EP.Settings = {


	}

	var $navLinks = $('.client-side-toc-macro span.toc-item-body a');
	var $sections = $('.contentLayout2 .columnLayout');

	EP.Dom = {

		$toolbar: $('#page-toolbar'),
		$currentUser: $('#user-menu-link'),
		$players: $('.players-table'),
		$submitMatchButton: $('#add-match-button'),

		NavLinks: {
			$join: 		$navLinks.eq(0),
			$profile: 	$navLinks.eq(1),
			$players: 	$navLinks.eq(2),
			$matches: 	$navLinks.eq(3),
			$gallery: 	$navLinks.eq(4),
			$faq: 		$navLinks.eq(5)
		},
		Sections: {
			$nav: 			$sections.eq(0),
			$join: 			$sections.eq(1),
			$profile: 		$sections.slice(2,4),
			$players: 		$sections.eq(4),
			$matches: 		$sections.eq(5),
			$gallery: 		$sections.eq(6),
			$faq: 			$sections.eq(7),
			$profileSummary: 		$sections.eq(2),
			$profileAchievements: 	$sections.eq(3)
		},
		Templates: {
			$submitMatch: $('#submit-match-template')	
		}

	};

	var username = EP.Dom.$currentUser.attr('data-username');

	EP.CurrentUser = {
		username : username,
		isRegistered : EP.Dom.$players.find('td:first-child a').is('[data-username="' + username + '"]'),
		picture:  EP.Dom.$currentUser.find('.aui-avatar img').attr('src')
	};

});
