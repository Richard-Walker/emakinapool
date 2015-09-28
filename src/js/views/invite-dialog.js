/*


EP.InviteDialog


*/

var EP = EP || {};

// $('body').append(JST.inviteDialog({}));
// EP.inviteDialog = AJS.dialog2('#invite-dialog');

EP.InviteDialog = function() {

	EP.InviteDialog = {};

	// Create dialog from template
	
	var html = JST.inviteDialog({});
	$('body').append(html);
	Confluence.Binder.autocompleteUserOrGroup('#invite-dialog'); 
	var dialog = AJS.dialog2('#invite-dialog');
	EP.InviteDialog.dialog = dialog;
		
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers

	EP.Dom.$inviteButton.click(function() {dialog.show();});

	// Validation rules

	function setSubmitState() {
	    var cannotSubmit = _.chain(Validations.State).values().contains(false).value();
		$('#invite-send-button').prop('disabled', cannotSubmit);		
	}

	var Validations = {	
	 	mandatoryFields: function() {
	 		Validations.State.mandatoryFields = $('#invite-selected-player').val() !== '';
	 	},
		notAlreadyRegistered: function() {
			
			var player = EP.Players.get($('#invite-selected-player').val());

			Validations.State.notAlreadyRegistered = player === undefined;

			if (Validations.State.notAlreadyRegistered) {
				$('#invite-player-error')
					.css('visibility', 'hidden');
			} else {
				$('#invite-player-error')
					.text('User already registered! (as "' + player.stageName + '")')
					.css('visibility', 'visible');
			}
		},
		emailAvailable: function() {

			Validations.State.emailAvailable = false; // Set to false until proven otherwise

			if (Validations.State.notAlreadyRegistered === false || $('#invite-selected-player').val() === '') { return }

			EP.Confluence.getUser($('#invite-selected-player').val(), function(userData) {

				Validations.State.emailAvailable = userData.displayableEmail !== undefined;

				if (Validations.State.emailAvailable) {
					$('#invite-email').val(userData.displayableEmail);
					$('#invite-player-error').css('visibility', 'hidden');
				} else {
					$('#invite-player-error')
						.text('This user\'s email is not public, we can\'t send an invitation, sorry.')
						.css('visibility', 'visible');
				}
				setSubmitState(); // We have to do it manually because it is an async call

			});
		}
	}

	// Update the submit button state on every validation function
	_(Validations).each(function(func, name) {
		Validations[name] = function() {
	    	func();
	    	setSubmitState();
		}
	})

	Validations.State = {};
	$('#invite-selected-player').on('change', Validations.mandatoryFields);
	$('#invite-selected-player').on('change', Validations.notAlreadyRegistered);
	$('#invite-selected-player').on('change', Validations.emailAvailable);
	dialog.on('show', Validations.mandatoryFields);


	// Dynamics

	var Dynamics = {
		selectUser: function (context, user) {
			$('#invite-player').val(user.content.title);
			$('#invite-selected-player').val(user.content.username).change();
		},
		unselectUser: function() {
			if ($('#invite-selected-player').val() !== '') {
				$('#invite-selected-player').val('').change();
			}
		}



	}

	$('#invite-player').on('selected.autocomplete-user', Dynamics.selectUser);
	$('#invite-player').on('input propertychange paste', Dynamics.unselectUser);


	// Cancel
	
	$('#invite-cancel-button').click( function() { dialog.hide() });


	// Submit

	$('#invite-send-button').click( function() {

		EP.Confluence.freezeDialog();

		var invitee = $('#invite-player').val();
		var inviteeEmail = $('#invite-email').val();
		var inviteeUsername = $('#invite-selected-player').val();
		var to = invitee + ' <' + inviteeEmail + '>';

		var data = {
			invitee: EP.Helpers.parseName(invitee).firstName,
			referer: EP.CurrentUser,
			message: $('#invite-message').val(),
			url: AJS.Confluence.getBaseUrl() + EP.Settings.pagePath,
			banner: EP.Banners.get()
		}

		EP.Mail.send(to, 'invitation', data, function() {
			
			// Update player profile upon success
			EP.Data.update(function () {			
				EP.Players.readData();
				var currentUser = EP.Players.get(EP.CurrentUser.username);
				currentUser.invitations = _(currentUser.invitations).union([inviteeUsername]);
				EP.Achievements.evaluate(currentUser);
				EP.Players.writeData();
				EP.Data.saveAndReload({title: 'Invitation sent!', body:'Thanks for spreading the word :)'});
			});

		})
		
	});

};
