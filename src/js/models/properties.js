/* 
---------------------------------------------------------------------------------------------------

EP.Properties

Available properties:
- availablePlayer
- gameResponseFor_<username>

---------------------------------------------------------------------------------------------------
*/


EP = EP || {}

EP.Properties = function() {
	
	EP.Properties = {}

	var url = AJS.Confluence.getBaseUrl() + '/rest/api/content/' + EP.Settings.pageId + '/property';

	EP.Properties.get = function(key, callbacks) {

		$.ajax({
		
			url: url + '/' + key,
			type: 'GET',
			contentType: 'application/json',
			success: callbacks && callbacks.found ? function(data) { callbacks.found(data); } : null
		
		}).fail(function(xhr) {
		
			if (xhr.status === 404 && callbacks && callbacks.notFound) {
				callbacks.notFound()
			} else {
				AJS.messages.error({title: 'Error! Could not get page property "' + key + '".' });			
			}
		});

	}

	EP.Properties.set = function(key, value, callback) {

		$.ajax({
		
			url: url,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({key: key, value: value}),
			success: callback
		
		}).fail(function() {
		
			AJS.messages.error({title: 'Error! Could not set page property "' + key + '".' });			
		
		});
		
	}

	EP.Properties.delete = function(key, callback) {

		$.ajax({
		
			url: url + '/' + key,
			type: 'DELETE',
			contentType: 'application/json',
			success: callback
		
		}).fail(function() {
		
			AJS.messages.error({title: 'Error! Could not delete page property "' + key + '".' });			
		
		});
		
	}

}