/*

EP.Data

The persistence layer

Usage:

	EP.Data.Get(function () {
		
		// Some updates
		EP.Data.$.add('Hello World');
		
		EP.Data.Save();
	});

*/


var EP = EP || {};

EP.Data = function() {

	EP.Data = {};
	EP.Data.$ = null;

	var url = 'https://share.emakina.net/rest/api/content/' + EP.Settings.pageId;
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

	EP.Data.get = function(callback) {

		// Load content from REST service

		$.get(url + '?expand=body.storage,version', function(data) {
			
			version = data.version.number;
			title = data.title;
			
			var html = xml2Html(data.body.storage.value);
			EP.Data.$ = $('<div>' + html + '</div>');

			callback();

		}).fail(function() {
			
			AJS.messages.error({title: 'Error! Cannot get page content from REST service.' });

		});		

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
			success: callback,

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
