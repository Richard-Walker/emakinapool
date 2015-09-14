/*

EP.Page

Gloabl page enhancement such as:
  * More sections and buttons
  * Tabs
  * Tooltips

*/

var EP = EP || {};

EP.Page = function() {


	// DISABLE EDITION -------------------------------

	$('#editPageLink').show();

	if (!_.chain(EP.Settings.admins).pluck('username').contains(EP.CurrentUser.username).value()) {

		// disable keyboard shortcut ("e")

		window.document.onkeydown = function (e) { return e.which !== 69 };
		
		// add warning dialog when edit button is clicked
		
		$('body').append(JST.editInfoDialog(EP.Settings.admins[0]));
		var editInfoDialog = AJS.dialog2('#edit-info-dialog');

		$('#editPageLink').click(function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			editInfoDialog.show();
		});

		$('#edit-info-ok-button').click(function() { editInfoDialog.hide()})

	}

	// MESSAGING DIV -----------------------------

	// Add messaging div
	$('#rw_page_toolbar').before('<div id="aui-message-bar"></div>');

	// Display confirmation message if query string parameter set
	var confirmation = EP.Helpers.getQueryStringParam('confirmation');
	if (confirmation !== '') {
		AJS.messages.success({title: confirmation});
		history.replaceState(null, null, location.href.split("?")[0]);
	}


	// ADDITIONAL SECTIONS AND TOOLBAR ------------------------

	EP.Dom.NavLinks.$gallery.show();
	EP.Dom.Sections.$gallery.show();
	EP.Dom.$toolbar.show();

	if (EP.CurrentUser.isRegistered) {
		EP.Dom.$registerButton.hide();
		EP.Dom.NavLinks.$profile.show();
		EP.Dom.Sections.$profile.show();
	} else {
		EP.Dom.$submitMatchButton.hide();
		EP.Dom.$playButton.hide();
		EP.Dom.$cancelPlayButton.hide();
		EP.Dom.$inviteButton.hide();
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
		
		var tooltipContent = EP.Helpers.getTip($a).join('<br> ');

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

	$('a[href*="tip://"]').each(function() {
		createTooltip($(this));
	});


	// STAGE NAMES --------------------------------------------------

	//TODO: implement

};
