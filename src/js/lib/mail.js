/*


EP.Mail

Send emails using REST api 

*/

var EP = EP || {};

EP.Mail = function() {

	EP.Mail = {}


	// All files that can be used in templates
	EP.Mail.files = [{
      	cid:          'hookedUpBanner',
      	url:          'https://dl.dropboxusercontent.com/u/14573395/emakinapool/hooked-up-banner.jpg',
	    filename:     'hooked-up-banner.jpg'
	}, {
      	cid:          'invitationBanner',
      	url:          'https://dl.dropboxusercontent.com/u/14573395/emakinapool/invite-banner.jpeg',
	    filename:     'invite-banner.jpeg'
	}];


	EP.Mail.send = function (to, template, templateData, callback) {

		templateData.files = templateData.files || [];

		function parseRecipient(r) {
			switch (r.constructor) {
				case String: 		return EP.Helpers.parseEmail(r);
				case EP.Player: 	return { name: r.stageName, email: r.email };
				default: 			return r;
			}
		}

		if (EP.Settings.forceEmailTo) {
			if (!EP.Settings.forceEmailTemplates || _(EP.Settings.forceEmailTemplates).contains(template)) {
				to = EP.Settings.forceEmailTo;
			}
		}

		to = to.constructor === Array ? to : [to];
		to = _(to).map(parseRecipient);

		var from = EP.Helpers.parseEmail(EP.Settings.emailFrom);

		var html = JST[template + 'Mail'](templateData);
		var parsed = html.match(/<subject>([\S\s]*)<\/subject>[\S\s]*<message>([\S\s]*)<\/message>/m);
		var subject = $.trim(parsed[1]);
		var message = parsed[2];

		var data = {
			from: from.email,
			fromname: from.name,
			to: _(to).pluck('email'),
			toname: _(to).pluck('name'),
			subject: subject,
			html: JST.mailHeader() + message,
			files: _(EP.Mail.files).filter(function(f) { return _(templateData.files).contains(f.cid) })
		}

		$.ajax({

			url: 'https://emakinapool-brightmoods.rhcloud.com/email',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			headers: {
				"Authorization": "Basic " + window.btoa(EP.Settings.serverAuthUsername + ':' + EP.Settings.serverAuthPassword)
			},
			success: callback

		}).fail(function() {

			AJS.messages.error({
				title: 'Error! Could not send email.',
				sendByEmail: false
			});

		});

	}

}