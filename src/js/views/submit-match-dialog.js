/*


EP.SubmitMatchDialog

Flow:
	1. Reset & Show dialog
	2. Handle user input (validation rules and dynamics)
	3. Submit and save match 

*/

var EP = EP || {};

EP.SubmitMatchDialog = function() {

	// Create dialog from template
	
	var players = _(EP.Players.list('firstName')).reject(function (p) { return p.username === EP.CurrentUser.username});
	var html = JST.submitMatchDialog({ players: players});
	$('body').append(html);
	var dialog = AJS.dialog2("#add-match-dialog");
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Tooltips
	
	// AJS.$("#tooltip-perfects").tooltip({html: true });
	// AJS.$("#tooltip-games").tooltip({html: true });

	// Triggers

	EP.Dom.$submitMatchButton.click(function() {dialog.show();});

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
			$('#match-save-button').prop('disabled', cannotSubmit);
		}
	})

	// Wiring
	Validations.State = {};
	$("#match-opponent, #match-outcome").change(Validations.mandatoryFields);
	dialog.on('show', Validations.mandatoryFields);


	// Form dynamics

	var Dynamics = {
		filterPerfects: function() {
			// Get som info
			var count = Math.floor(parseInt($("#match-format").val()) / 2) + 1;
			var $perfects = $('#match-perfects-me, #match-perfects-him');
			var numPerfects = $perfects.map(function () {return parseInt($(this).val())});
			
			// Compute maximum allowed value of each drop down
			var maximums1 = [
				$('#match-outcome').val() === '0' ? count - 1 : count,
				$('#match-outcome').val() === '1' ? count - 1 : count
			];
			var maximums = maximums1;
			if ($('#match-outcome').val() === '') {
				if (numPerfects[0] === count) { maximums[1] = count - 1; }
				if (numPerfects[1] === count) { maximums[0] = count - 1; }
			}  

			// Reset both drop-down if combination is invalid
			var isInvalid = _.chain(numPerfects).map(function (num, i) {return num <= maximums[i]}).contains(false).value();
			if (isInvalid) {
				maximums = maximums1;
				$perfects.find('option').removeAttr('selected');
				$perfects.find('option:first-child').attr('selected','selected');
			}

			// Reset options
			_(maximums).each(function(max, i) {
				var selected = parseInt($perfects.eq(i).find('option:selected').attr('value'));
				var html = _(_.range(max + 1)).map(function(j) {return '<option value="' + j + '">' + j + '</option>'}).join();
				$perfects.eq(i).html(html);
				$perfects.eq(i).find('option').eq(selected).attr('selected','selected');
			});

		}
	}
	// Wiring
	$("#match-outcome, #match-format, #match-perfects-me, #match-perfects-him").change(Dynamics.filterPerfects);
	dialog.on('show', Dynamics.filterPerfects);


	// Cancel action
	$('#match-cancel-button').click( function() { dialog.hide() });

	// Save action
	$('#match-save-button').click( function() {

		EP.Confluence.freezeDialog();

		var matchData = {
			players: [
				EP.CurrentUser.username, 
				$('#match-opponent').val()
			],
			perfects: [
				parseInt($('#match-perfects-me').val()),
				parseInt($('#match-perfects-him').val()),
			],
			game: $('#match-game').val(),
			bestOf: parseInt($('#match-format').val())
		};
		matchData.winner = $('#match-outcome').val() === '1' ? matchData.players[0] : matchData.players[1];

		EP.Matches.add(matchData);

	});

	// Glossary link
	$('#match-glossary-link').click( function() {
		dialog.hide();
		EP.Dom.NavLinks.$faq.click();
		return false;
	});

	// Invite link
	// $('#match-invite-link').click( function() {
	// 	dialog.hide();
	// 	EP.InviteDialog.dialog.show();
	// 	return false;
	// });

};
