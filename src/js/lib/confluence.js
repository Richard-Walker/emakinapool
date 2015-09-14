/*


EP.Confluence

Helpers functions to wrap confluence feature, mainly REST api calls

*/


EP = EP || {}

EP.Confluence = function() {

	EP.Confluence = {}

	EP.Confluence.getUser = function(username, callback) {

		var url = AJS.REST.getBaseUrl() + 'user/non-system/' + username + '.json';
		$.get(url, function(data) {
			callback(data);
		}).fail(function() {			
			AJS.messages.error({title: 'Error! Cannot get user data from REST service.'});
		});		
	}

	EP.Confluence._origError = AJS.messages.error;
	AJS.messages.error = function(opts) {
		EP.Confluence.closeDialog();
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false,
			sendByEmail: true
		});


		// Send error report
		if (EP.Settings.sendErrors && opts.sendByEmail) {
			EP.Mail.send(EP.Settings.admins, 'errorNotification', {
				environment: EP.Settings.environment,
				user: EP.Dom.$currentUser.attr('data-username'),
				error: opts.title
			});
		}

		return EP.Confluence._origError.call(this, opts);
	}

	EP.Confluence._origSuccess = AJS.messages.success;
	AJS.messages.success = function(opts) {
		EP.Confluence.closeDialog();
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false
		});
		return EP.Confluence._origSuccess.call(this, opts);
	}

	EP.Confluence._origGeneric = AJS.messages.generic;
	AJS.messages.generic = function(opts) {
		EP.Confluence.closeDialog();
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false
		});
		return EP.Confluence._origGeneric.call(this, opts);
	}


	EP.Confluence.freezeDialog = function() {
		$('.aui-dialog2').find('button, input, textarea, select, a').prop('disabled', true);
		$('.aui-dialog2').find('a').css('pointer-events', 'none');
		$('.aui-dialog2').find('.button-spinner').spin();
	}
	EP.Confluence.unFreezeDialog = function() {
		$('.aui-dialog2').find('button, input, textarea, select, a').prop('disabled', false);
		$('.aui-dialog2').find('a').css('pointer-events', '');
		$('.aui-dialog2').find('.button-spinner').spinStop();
	}
	EP.Confluence.closeDialog = function() {
		if ($('.aui-dialog2').length > 0) {
			EP.Confluence.unFreezeDialog();
			if ($('.aui-dialog2[aria-hidden="false"]').length > 0) {
				AJS.dialog2('.aui-dialog2[aria-hidden="false"]').hide()
			}
		}
	}

}

