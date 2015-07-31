/*

Submit match feature:

  * Dialog
  * Match table update
  * Players table update

*/


$(function() {

	// Wait for the template to be loaded (it's an iframe)
	
	EP.Dom.Templates.$submitMatch.load(function() {

		// Create the dialog from the template
		
		$('body').append( EP.Dom.Templates.$submitMatch.contents().find('section') );
		var dialog = AJS.dialog2("#add-match-dialog");

		// Tooltips
		
		AJS.$("#tooltip-perfects").tooltip({html: true });
		AJS.$("#tooltip-games").tooltip({html: true });

		// Validation rules

		var Validations = {
			 	
		 	mandatoryFields: function() {
		 		Validations.State.mandatoryFields =
		 			$('input[name=match-outcome]:checked').length > 0 &&
		 			$("#match-opponent").val() != ''
		 	}

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
		$("#match-opponent, input[name=match-outcome]").change(Validations.mandatoryFields);

		// Wire buttons
		
		EP.Dom.$submitMatchButton.click( function() { EP.Helpers.resetForm($("#add-match-dialog")); dialog.show() });
		$('#match-cancel-button').click( function() { dialog.hide() });

	} )

});