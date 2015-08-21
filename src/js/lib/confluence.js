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
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false
		});
		return AJS.messages.origError(opts);
	}
	AJS.messages.origSuccess = AJS.messages.success;
	AJS.messages.success = function(opts) {
		opts = _(opts).defaults({
			fadeout: true,
			closeable: false
		});
		return AJS.messages.origSuccess(opts);
	}

}

