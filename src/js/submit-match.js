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
