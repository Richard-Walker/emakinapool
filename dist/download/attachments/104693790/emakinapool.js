/*! emakinapool - v0.1.0 - 2015-08-03
* Copyright (c) 2015 Richard Walker; Licensed GPL-3.0 */

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

/*

EP.Dom

Dom accessors for the confluence page

IMPORTANT:
	Modules should always use EP.Dom to access elements in the confluence page. 
	The use of "$(selector)" is not recommended.

*/

var EP = EP || {};

EP.Dom = function() {

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

	EP.Dom.Achievements = {
		$gauge : EP.Dom.Sections.$profileAchievements.find('.aui-lozenge').eq(0)
	};


};

/*

EP.Enhancements

Desktop enhancements:
  * More sections and buttons
  * Tabs
  * Tooltips

*/

var EP = EP || {};

EP.Enhancements = function() {

	// SECTION AND TOOLBAR ----------------------------------

	EP.Dom.NavLinks.$gallery.show();
	EP.Dom.Sections.$gallery.show();

	if (EP.CurrentUser.isRegistered) {
		$('#page-toolbar').show();
		EP.Dom.NavLinks.$profile.show();
		EP.Dom.Sections.$profile.show();
	}

	if (!EP.CurrentUser.isRegistered) {
		EP.Dom.NavLinks.$join.show();
		EP.Dom.Sections.$join.show();
	}


	// TABS -------------------------------------------------

	function hideTab(tab) {
		EP.Dom.Sections[tab].hide();
		EP.Dom.NavLinks[tab].removeClass('active');	
	}

	function showTab(tab) {
		EP.Dom.NavLinks[tab].addClass('active');
		EP.Dom.Sections[tab].show();
	} 

	// Hide titles
	$('.wiki-content h1').hide();

	// Show first tab hide others
	var visibleTabs = _.filter(_.keys(EP.Dom.NavLinks), function(k) { return EP.Dom.NavLinks[k].is(':visible') });
	showTab(visibleTabs[0]);
	visibleTabs.shift();
	_.each(visibleTabs, function(tab) { hideTab(tab) });

	// Add click behaviour
	_.each(EP.Dom.NavLinks, function($navLink, key) {

		$navLink.click(function() {
			var newTab = key;
			var curTab = _.find(_.keys(EP.Dom.NavLinks), function(k) { return EP.Dom.NavLinks[k].hasClass('active') });
			
			if (curTab) { hideTab(curTab) }
			showTab(newTab);
			
			return false;
		})

	});


	// TOOLTIPS --------------------------------------------------

	var tooltipId = 0;
	
	function createTooltip($a) {
		
		var href = $a.attr('href')
		var match = href.match(/tooltip\(([^)]*)\)/);
		var tooltipContent = match[1];
		tooltipContent = tooltipContent.replace(/\+/g, ' ');
		tooltipContent = tooltipContent.replace(/\;/g, '<br> ');

		AJS.InlineDialog(
			$a, 
			'inline-tooltip-' + tooltipId , 
			function(content, trigger, showPopup) { 
				content.css({ padding: '15px' }).html(tooltipContent);
    			showPopup();
    			return false;
			},
			{
				width: 'inherit',
				closeOnTriggerClick: true
			}
		);
		tooltipId++;
	}

	$('a[href*="-tooltip("]').each(function() {
		createTooltip($(this));
	});


	// STAGE NAMES --------------------------------------------------

	//TODO: implement

};

/*

EP.Helpers

Helpers

*/

var EP = EP || {};

EP.Helpers = function() {

	EP.Helpers = {};

	EP.Helpers.TooltipFormater = {
		decodeToHtml: function(url) {
			var match = url.match(/tooltip\(([^)]*)\)/);
			var html = match[1];
			html = html.replace(/\+/g, ' ');
			html = html.replace(/\;/g, '<br> ');
			return html;
		},
		decodeToArray: function(url) {
			var match = url.match(/tooltip\(([^)]*)\)/);
			var content = match[1];
			content = content.replace(/\+/g, ' ');
			return content.split(';');
		},
	};

	EP.Helpers.leafs = function($e) {
		return $e('*').filter( function() {
      		var isLeaf = $(this).children().length === 0;
      		return isLeaf;
   		});
	};

	EP.Helpers.expandVariables = function(string, variables) {
		
		var expandedString = string;
		_.each(variables, function (value, name) {
			var re = new RegExp('\\$' + name, 'gm');
			expandedString = expandedString.replace(re, value);
		});

		return expandedString;
	
	};

	EP.Helpers.resetDialog = function(dialog) {
		var $e = $(dialog);
		$e.find("select option").removeAttr('selected');
		$e.find("select option:first-child").attr('selected','selected');
		$e.find("input[type=radio]").prop("checked", false);
	};

	EP.Helpers.filterSelect = function($select, filter) {
		var $current = $select.find('option:selected');
		$select.find('option').hide();
		$select.find('option').filter(filter).show();

		if ($current.filter(filter).length === 0) {
			$current.removeAttr('selected');
			$select.find("option:first-child").attr('selected','selected');
		}
	};

};

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

/*

EP.Settings

Common settings used by other modules

*/

var EP = EP || {};

EP.Settings = function() {

	EP.Settings = {

	}

};

/*


EP.SubmitMatch


Submit match functionality:

  * Dialog
  * Match table update
  * Players table update

*/

var EP = EP || {};

EP.SubmitMatch = function() {

	
	EP.SubmitMatch = {};

	// Create dialog from template
	
	var html = JST.submitMatchDialog({});
	$('body').append(html);
	var dialog = AJS.dialog2("#add-match-dialog");
	EP.SubmitMatch.dialog = dialog;
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Tooltips
	
	// AJS.$("#tooltip-perfects").tooltip({html: true });
	// AJS.$("#tooltip-games").tooltip({html: true });

	// Validation rules

	var Validations = {	
	 	mandatoryFields: function() {
	 		Validations.State.mandatoryFields =
	 			$("#match-opponent").val() !== '' &&
	 			$("#match-outcome").val() !== ''
	 	},
	}

	// Update the save button active state (added to every validation function)
	
	_(Validations).each(function(func, name) {
		Validations[name] = function() {
	     func();
	     var cannotSubmit = _.chain(Validations.State).values().contains(false).value();
			$('#match-save-button').attr('aria-disabled', cannotSubmit ? 'true' : 'false');
		}
	})

	// Wire validations

	Validations.State = {};
	$("#match-opponent, #match-outcome").change(Validations.mandatoryFields);
	dialog.on('show', Validations.mandatoryFields);


	// Form dynamics

	var Dynamics = {
		filterPerfects: function() {

			// Get som info
			var count = parseInt($("#match-format").val());
			var $perfects = $('#match-perfects-me, #match-perfects-him');
			var numPerfects = $perfects.map(function () {return parseInt($(this).val())});
			
			// Compute maximum allowed value of each drop down
			var maximums = [count, count];
			maximums[0] -= numPerfects[1];
			maximums[1] -= numPerfects[0];
			if ( $('#match-outcome').val() === '0' ) { maximums[0] = Math.min(maximums[0], count/2) }
			if ( $('#match-outcome').val() === '1' ) { maximums[1] = Math.min(maximums[1], count/2) }

			// Reset both drop-down if combination is invalid
			var isInvalid = _.chain(numPerfects).map(function (num, i) {return num <= maximums[i]}).contains(false).value();
			if (isInvalid) {
				$perfects.find('option').removeAttr('selected');
				$perfects.find('option:first-child').attr('selected','selected');
			}

			// Limit drop down values to their maximums
			$perfects.find('option').show();
			_(maximums).each(function(max,i) {
				$perfects.eq(i).find('option').filter(function() {return parseInt($(this).attr('value')) > max}).hide();
			});
		}
	}

	// Wire dynamics

	$("#match-outcome, #match-format, #match-perfects-me, #match-perfects-him").change(Dynamics.filterPerfects);
	dialog.on('show', Dynamics.filterPerfects);

	// Wire call to actions
	
	EP.Dom.$submitMatchButton.click( function() {
		dialog.show();
	});

	$('#match-cancel-button').click( function() { dialog.hide() });

};

/*

Entry point

*/

$(function () {
	EP.Settings();
	EP.Helpers();
	EP.Dom();
	EP.CurrentUser();
	EP.Enhancements();
	EP.Profile();
	EP.SubmitMatch();
});
