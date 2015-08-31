/*


EP.RegisterDialog

Flow:
	1. Reset & Show dialog
	2. Handle user input (validation rules and dynamics)
	3. Submit and save player 

*/

var EP = EP || {};

EP.RegisterDialog = function() {

	// Create dialog from template
	
	var html = JST.registerDialog({number: EP.Players.list().length + 1});
	$('body').append(html);
	var dialog = AJS.dialog2('#register-dialog');
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers

	EP.Dom.$joinButton.click(function() {dialog.show();});
	EP.Dom.$registerButton.click(function() {dialog.show();});

	// Validation rules

	var Validations = {	
	 	mandatoryFields: function() {
	 		Validations.State.mandatoryFields = $('#player-stage-name').val() !== '';
	 	},
		nameNotTaken: function() {
			
			var stageName = $.trim($('#player-stage-name').val()).toUpperCase();
			var playerWithSameName = _(EP.Players.list()).find(function (p) { return p.stageName.toUpperCase() === stageName });
			
			Validations.State.nameNotTaken = playerWithSameName === undefined;

			if (Validations.State.nameNotTaken) {
				$('#player-stage-name-error')
					.css('visibility', 'hidden');
			} else {
				$('#player-stage-name-error')
					.text('"' + playerWithSameName.stageName + '" is already taken! (by ' + playerWithSameName.fullName() + ')')
					.css('visibility', 'visible');
			}
		},


	}

	// Update the save button active state (added to every validation function)
	
	_(Validations).each(function(func, name) {
		Validations[name] = function() {
	     func();
	     var cannotSubmit = _.chain(Validations.State).values().contains(false).value();
			$('#player-save-button').prop('disabled', cannotSubmit);
		}
	})

	// Wiring
	Validations.State = {};
	$('#player-stage-name').on('input propertychange paste', Validations.mandatoryFields);
	$('#player-stage-name').on('input propertychange paste', Validations.nameNotTaken);
	dialog.on('show', Validations.mandatoryFields);

	// Cancel action
	$('#player-cancel-button').click( function() { dialog.hide() });

	// Save action
	$('#player-save-button').click( function() {

		EP.Confluence.freezeDialog();

		EP.Players.add( {
			username: EP.CurrentUser.username,
			firstName: EP.CurrentUser.firstName,
			lastName: EP.CurrentUser.lastName,
			stageName: $.trim($('#player-stage-name').val())
		});
		
	});


};
