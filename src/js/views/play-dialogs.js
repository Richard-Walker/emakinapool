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

	EP.Dom.$playButton.hide();
	EP.Dom.$cancelPlayButton.hide();
	EP.Dom.$submitMatchButton.hide();
	EP.Properties.get('availablePlayer', {
		found: function (playerData) {
			setToolbar(playerData.userName === EP.CurrentUser.userName)
		},
		notFound: function () {
			setToolbar(false)
		}
	});


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
				
				found: function(playerData) {
					EP.Mail.send(EP.CurrentUser, 'hookedup', playerData, function() {
						EP.Mail.send(new EP.Player(playerData), 'hookedup', EP.CurrentUser, function() {
							EP.Properties.delete('availablePlayer', function() {
								EP.Data.releaseLock(function() {
									AJS.messages.success({
										title: playerData.stageName + ' is available, have a nice game! (Details have been sent by email)',
										closeable: true,
										delay: 10000
									})
									setToolbar(false, true);
								})
							})
						})
					});
				},
				
				notFound: function() {
					EP.Properties.set('availablePlayer', EP.CurrentUser, function() {
						EP.Data.releaseLock(function() {
							AJS.messages.success({
								title: 'Request submitted, you will get an email as soon as someone becomes available.',
								closeable: true,
								delay: 10000
							});
							setToolbar(true);
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
			found: function (playerData) {
				if (playerData.userName === EP.CurrentUser.userName) {
					EP.Properties.delete('availablePlayer', function() {
						AJS.messages.success({title: 'Game request cancelled.'});
						setToolbar(false);
					});
				} else {
					AJS.messages.generic({title: 'You don\'t have any pending request.'});
					setToolbar(false);
				}
			},
			notFound: function () {
				AJS.messages.generic({title: 'You don\'t have any pending request.'});
				setToolbar(false);
			}
		});
	});

};
