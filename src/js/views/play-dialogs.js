/*

EP.PlayDialog

*/


var EP = EP || {};

EP.PlayDialogs = function() {

	// Only available to registered players
	if (EP.CurrentUser.isRegistered === false) { return; }

	/* 
	---------------------------------------------------------------------------------------------------
	Toolbar 
	---------------------------------------------------------------------------------------------------
	*/

	function setToolbar(isAvailable, hasJustBeenHookedUp) {
		if (isAvailable) {
			EP.Dom.$submitMatchButton.hide();
			EP.Dom.$playButton.hide();
			EP.Dom.$cancelPlayButton.show();
		} else {
			EP.Dom.$submitMatchButton.show();
			EP.Dom.$playButton.show();
			EP.Dom.$cancelPlayButton.hide();
		}
		if(hasJustBeenHookedUp) {
			EP.Dom.$playButton.hide();
		}
	}

	setToolbar(false);


	/* 
	---------------------------------------------------------------------------------------------------
	Manage properties
	---------------------------------------------------------------------------------------------------
	*/

	// availablePlayer
	EP.Properties.get('availablePlayer', {
		found: function(property) {
			var propertyDate = new Date(property.version.when);
			if (EP.Helpers.today() > propertyDate) {
				// We remove the property if it is expired (not from today)
				EP.Properties.delete('availablePlayer');
				setToolbar(false);
				checkResponse();
			} else {
				// The user has a pending request!
				if (property.value.username === EP.CurrentUser.username) {
					setToolbar(true);
					waitForResponse();
				} else {
					setToolbar(false);					
					checkResponse();
				}
			}
		},
		notFound: function () {
			setToolbar(false);
			checkResponse();
		}
	});

	// gameResponseFor_<username>
	function checkResponse(successCallback) {
		EP.Properties.get('gameResponseFor_' + EP.CurrentUser.username, {
			found: function(property) {
				if (new Date() <= new Date(property.version.when).addMinutes(30)) {
					// The user has a match!
					showHookedUpPopup(property.value);
					setToolbar(false, true);
				}
				EP.Properties.delete('gameResponseFor_' + EP.CurrentUser.username);
				setToolbar(false, true);
				if (successCallback) { successCallback(); }
			},
			notFound: function() {}
		});
	}

	function waitForResponse() {
		var timer = window.setInterval(function() {
			checkResponse(function() {
				window.clearInterval(timer)
			});
		}, 5000);
	}


	function propertyData(player) {
		return {
			username:  player.username,
			firstName: player.firstName,
			lastName:  player.lastName,
			stageName: player.stageName,
			email:     player.email
		}
	}

	/* 
	---------------------------------------------------------------------------------------------------
	Hooked-up popup	
	---------------------------------------------------------------------------------------------------
	*/
	 
	function showHookedUpPopup(data) {
		$('#hooked-up-popup').remove();
		$('body').append(JST.hookedUpPopup(data));
		AJS.dialog2("#hooked-up-popup").show();
	}

	// AJS.messages.success({
	// 	title: data.value.stageName + ' is available',
	// 	body: '<p>Have a nice game! (Details have been sent by email)</p>',
	// 	delay: 15000,
	// 	closeable: true
	// })



	/* 
	---------------------------------------------------------------------------------------------------
	Game request dialog
	---------------------------------------------------------------------------------------------------
	*/
 
	// Create dialog from template
	
	$('body').append(JST.playDialog({}));
	var dialog = AJS.dialog2("#play-dialog");
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers

	EP.Dom.$playButton.click(function() {dialog.show();});

	// Cancel action
	$('#play-cancel-button').click( function() { dialog.hide() });

	// Submit action
	$('#play-submit-button').click( function() {

		EP.Confluence.freezeDialog();

		EP.Data.getLock(function() {

			EP.Properties.get('availablePlayer', {
				
				found: function(propAvailPlayer) {
					
					// We've got someone, no need to wait!

					var templateDataOpponent = _(propAvailPlayer.value).extend({files: ['hookedUpBanner']});
					var templateDataUser = _(propertyData(EP.CurrentUser)).extend({files: ['hookedUpBanner']});

					EP.Mail.send(EP.CurrentUser, 'hookedup', templateDataOpponent, function() {
						EP.Mail.send(new EP.Player(propAvailPlayer.value), 'hookedup', templateDataUser, function() {
							EP.Properties.delete('availablePlayer', function() {
								EP.Data.releaseLock(function() {
									EP.Properties.set('gameResponseFor_' + propAvailPlayer.value.username, propertyData(EP.CurrentUser));
									dialog.hide();
									setToolbar(true);
									window.setTimeout(function() {
										showHookedUpPopup(templateDataOpponent);
										setToolbar(false, true);
									}, 1000)
								})
							})
						})
					});
				},
				
				notFound: function() {

					// Nobody's available, but let's poll to notify in real time shall somone becomes available

					EP.Properties.set('availablePlayer', propertyData(EP.CurrentUser), function() {
						EP.Data.releaseLock(function() {
							AJS.messages.success({
								title: 'Game request submitted',
								body: '<p>Don\'t forget to cancel shall you become unavailable...</p>'
							});
							setToolbar(true);
							waitForResponse();
						})
					});					
				}
			}) 
		});
	});


	/* 
	---------------------------------------------------------------------------------------------------
	Cancel request dialog
	---------------------------------------------------------------------------------------------------
	*/
 
	// Create dialog from template
	$('body').append(JST.cancelPlayDialog());
	var cancelDialog = AJS.dialog2("#cancel-play-dialog");
	cancelDialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers
	EP.Dom.$cancelPlayButton.click(function() {cancelDialog.show();});

	// Cancel action
	$('#cancel-play-cancel-button').click( function() { cancelDialog.hide() });

	// Submit action
	$('#cancel-play-ok-button').click( function() {

		EP.Confluence.freezeDialog();

		EP.Properties.get('availablePlayer', {
			found: function (data) {
				if (data.value.username === EP.CurrentUser.username) {
					EP.Properties.delete('availablePlayer', function() {
						AJS.messages.success({title: 'Game request cancelled'});
						setToolbar(false);
					});
				} else {
					AJS.messages.generic({title: 'You don\'t have any pending request'});
					setToolbar(false);
				}
			},
			notFound: function () {
				AJS.messages.generic({title: 'You don\'t have any pending request'});
				setToolbar(false);
			}
		});
	});

};
