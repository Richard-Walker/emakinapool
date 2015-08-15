/*


EP.Mail

Send emails using Mandrill REST api 

*/


var EP = EP || {};

EP.Mail = function() {

	EP.Mail = {}

	var subjects = {
		test: "Emakina pool test email"
	}

	EP.Mail.send = function (recipients, template, templateData, callback) {

		recipients = recipients.constructor === Array ? recipients : [recipients];

		var url = 'https://mandrillapp.com/api/1.0/messages/send.json'
		var apiKey = 'c2nNjdQl1L3LaDd12rfZnQ'
		var subject = subjects[template] || "Emakina Pool";
		var html = JST[template + 'Mail'](templateData);
		
		var to = _(recipients).map(function (p) {
			return {
				email: p.username + '@emakina.com',
				name: p.stageName,
				type: 'to'
			};
		});

		var data = {
		    "key": apiKey,
		    "message": {
		        "html": html,
		        // "text": "Example text content",
		        "subject": subject,
		        "from_email": EP.Settings.supportEmail,
		        "from_name": EP.Settings.supportName,
		        "to": to,
		        "headers": {
		            //"Reply-To": "message.reply@example.com"
		        },
		        "important": false,
		        "track_opens": null,
		        "track_clicks": null,
		        "auto_text": null,
		        "auto_html": null,
		        "inline_css": null,
		        "url_strip_qs": null,
		        "preserve_recipients": null,
		        "view_content_link": null,
		        //"bcc_address": "message.bcc_address@example.com",
		        "tracking_domain": null,
		        "signing_domain": null,
		        "return_path_domain": null,
		        // "merge": true,
		        // "merge_language": "mailchimp",
		        // "global_merge_vars": [
		        //     {
		        //         "name": "merge1",
		        //         "content": "merge1 content"
		        //     }
		        // ],
		        // "merge_vars": [
		        //     {
		        //         "rcpt": "recipient.email@example.com",
		        //         "vars": [
		        //             {
		        //                 "name": "merge2",
		        //                 "content": "merge2 content"
		        //             }
		        //         ]
		        //     }
		        // ],
		        "tags": [
		            EP.Settings.environment,
		            template
		        ]
		        // "subaccount": "customer-123",
		        // "google_analytics_domains": [
		        //     "example.com"
		        // ],
		        // "google_analytics_campaign": "message.from_email@example.com",
		        // "metadata": {
		        //     "website": "www.example.com"
		        // },
		        // "recipient_metadata": [
		        //     {
		        //         "rcpt": "recipient.email@example.com",
		        //         "values": {
		        //             "user_id": 123456
		        //         }
		        //     }
		        // ],
		        // "attachments": [
		        //     {
		        //         "type": "text/plain",
		        //         "name": "myfile.txt",
		        //         "content": "ZXhhbXBsZSBmaWxl"
		        //     }
		        // ],
		        // "images": [
		        //     {
		        //         "type": "image/png",
		        //         "name": "IMAGECID",
		        //         "content": "ZXhhbXBsZSBmaWxl"
		        //     }
		        // ]
		    },
		    "async": true,
		    // "ip_pool": "Main Pool"
		    // "send_at": "example send_at"
		}

		$.ajax({

			url: url,
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: callback

		}).fail(function() {

			AJS.messages.error('Error! Could not send email.');

		});

	}




}