/*


EP.Mail

Send emails using REST api 

*/

var EP = EP || {};

EP.Mail = function() {

	EP.Mail = {}

	EP.Mail.send = function (to, template, templateData, images, callback) {

		function parseRecipient(r) {
			switch (r.constructor) {
				case String: 		return EP.Helpers.parseEmail(r);
				case EP.Player: 	return { name: r.stageName, email: r.email };
				default: 			return r;
			}
		}
		to = EP.Settings.forceEmailTo || to;
		to = to.constructor === Array ? to : [to];
		to = _(to).map(parseRecipient);

		var from = EP.Helpers.parseEmail(EP.Settings.emailFrom);

		var $html = $(JST[template + 'Mail'](templateData));

		var data = {
			from: from.email,
			fromname: from.name,
			to: _(to).pluck('email'),
			toname: _(to).pluck('name'),
			subject: $.trim($html.find('subject').text()),
			html: JST.mailHeader() + $html.find('message').html()
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

			AJS.messages.error({title: 'Error! Could not send email.'});

		});

	}

}