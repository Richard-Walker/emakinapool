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

	AJS.messages.origError = AJS.messages.error;
	AJS.messages.error = function(opts) {
		EP.Confluence.closeDialogs();
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false
		});
		return AJS.messages.origError(opts);
	}

	AJS.messages.origSuccess = AJS.messages.success;
	AJS.messages.success = function(opts) {
		EP.Confluence.closeDialogs();
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false
		});
		return AJS.messages.origSuccess(opts);
	}


	EP.Confluence.freezeDialogs = function() {
		$('.aui-dialog2').find('button, input, textarea, select, a').prop('disabled', true);
		$('.aui-dialog2').find('a').css('pointer-events', 'none');
		$('.aui-dialog2').find('.button-spinner').spin();
	}
	EP.Confluence.unFreezeDialogs = function() {
		$('.aui-dialog2').find('button, input, textarea, select, a').prop('disabled', false);
		$('.aui-dialog2').find('a').css('pointer-events', '');
		$('.aui-dialog2').find('.button-spinner').spinStop();
	}
	EP.Confluence.closeDialogs = function() {
		if ($('.aui-dialog2').length > 0) {
			EP.Confluence.unFreezeDialogs();
			AJS.dialog2('.aui-dialog2').hide();
		}
	}

}

