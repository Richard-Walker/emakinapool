/*

EP.Data

The persistence layer

USAGE:

	
	EP.Data.Get(function () {
		// Read some data
		var foo = EP.Data.$(selector).text();
	});

	or

	EP.Data.Update(function () {
		// Make some updates
		EP.Data.$.add('Hello World');
		// Save
		EP.Data.Save();
	});


IMPORTANT:
	Save() MUST always be called inside Update(), else page lock will not be released

*/


var EP = EP || {};

EP.Data = function() {

	EP.Data = {};
	EP.Data.$ = null;

	var url = AJS.Confluence.getBaseUrl() + '/rest/api/content/' + EP.Settings.pageId;
	var version = null;
	var title = null;
	var cdatas = [];

	// Adapt Conflence xml to standard html
	function xml2Html(xml) {
		cdatas = [];
	
		var html = xml.replace(/<!\[CDATA\[[^]*?\]\]>/gi, function(match) {
			cdatas.push(match);
			return "CDATA_" + (cdatas.length - 1);
		});

		return html;
	}

	// Adapt html to Confluence xml format
	function html2Xml(html) {

		// -> Add closure to <img> tags
		var xml = html.replace(/<(img [^>]*?[^\/])>/g, "<$1/>");

		// -> Add closure to <br> tags
		xml = xml.replace("<br>", "<br />");

		// -> Re-inject CDATA blocks
		_.each(cdatas, function (cdata,i) {
			xml = xml.replace("CDATA_" + i, cdata);
		});

		return xml;	
	}

	EP.Data.isLocked = false;
	EP.Data._origError = AJS.messages.error;

	// Release lock on error
	AJS.messages.error = function(opts) {
		if (EP.Data.isLocked) {
			EP.Data.releaseLock(function () { EP.Data._origError.call(this, opts) })
		} else {
			EP.Data._origError.call(this, opts);
		}
	}

	EP.Data.getLock = function(callback, numAttempts) {
		numAttempts = numAttempts || 1;

		$.ajax({
		
			url: url + '/property',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({key: 'lockedby', value: EP.CurrentUser.username}),
			success: function() { EP.Data.isLocked = true; callback(); }
		
		}).fail(function(xhr) {
		
			if (xhr.status === 409) {
				if (numAttempts <= 1) {
					window.setTimeout(function() { EP.Data.getLock(callback, numAttempts + 1); }, 1000)
				} else {
					AJS.messages.error({title: 'Error! The page is currently locked, try again later.' });					
				}
			} else {
				AJS.messages.error({title: 'Error! Could not lock the page for edition.' });			
			}
		
		});
	}

	EP.Data.releaseLock = function(callback) {
		$.ajax({
			url: url + '/property/lockedby',
			type: 'DELETE',
			contentType: 'application/json',
			success: function() { EP.Data.isLocked = false; callback(); }
		}).fail(function() {
			EP.Data._origError.call(AJS.messages, {title: 'Error! Could not release page lock.' });
		});		
	}

	EP.Data.get = function(callback) {

			$.get(url + '?expand=body.storage,version', function(data) {
				
				version = data.version.number;
				title = data.title;
				
				var html = xml2Html(data.body.storage.value);
				EP.Data.$ = $('<div>' + html + '</div>');

				callback();

			}).fail(function() {

				AJS.messages.error({title: 'Error! Cannot get page content.'});

			});
	}

	EP.Data.update = function(callback) {
		EP.Data.getLock(function() { EP.Data.get(callback) })
	}

	EP.Data.save = function(callback) {

		var xml = html2Xml(EP.Data.$.html());

		var data = {
			"type": "page",
			"title": title,
			"body": {
				"storage": {
					"value": xml,
					"representation": "storage"
				}
			},
			"version": {
				"number": version + 1
			}
		};

		$.ajax({

			url: url,
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function() { EP.Data.releaseLock(callback); }

		}).fail(function() {

			AJS.messages.error({title: 'Error! Could not save page data with REST service.'});
		
		});

	}

	EP.Data.saveAndReload = function(message) {
		EP.Data.save(function() {
			location.search = '?confirmation=' + encodeURIComponent(message);
		});
	}

}
