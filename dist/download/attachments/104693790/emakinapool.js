/*! emakinapool - v0.1.0 - 2015-08-15
* Copyright (c) 2015 Richard Walker; Licensed GPL-3.0 */

/*

EP.Helpers

Helpers

*/

var EP = EP || {};

EP.Helpers = function() {

	EP.Helpers = {}

	EP.Helpers.upperCase = function(s) { return s.toUpperCase() };

	EP.Helpers.getTip = function($e) {
		var $a = $e.is('a') ? $e : $e.find('a');
		var href = $a.attr('href') || 'tip://list';
		if (href === 'tip://list') { return [] }
		var listStr = href.match(/tip\:\/\/list\?(.*)/i)[1];
		return listStr === '' ? [] : _(listStr.split('++')).map(decodeURIComponent);
	}

	EP.Helpers.encodeURIComponentWithQuotes = function (str) {
		return encodeURIComponent(str).replace(/'/g, "%27");
	}
	EP.Helpers.tipLink = function(list) {
		var listStr = _(list).map(EP.Helpers.encodeURIComponentWithQuotes).join('++');
		return 'tip://list?' + listStr; 
	}

	EP.Helpers.today = function() {
		var d = EP.Helpers.formatDate(new Date());
		d = EP.Helpers.dateFromString(d);
		return d;

		// Alternate implementation:
		// var d = new Date();
		// d.setHours(0, 0, 0, 0);
	}

	EP.Helpers.formatDate = function(d, format) {
		format = format || 'FR';
		var isoDate = d.toISOString().slice(0,10);
		if (format === 'ISO') { return isoDate; }

		var parts = isoDate.split('-');
		return parts[2] + '/' + parts[1] + '/' + parts[0];
	}

	EP.Helpers.dateFromString = function(d, format) {
		format = format || 'FR';

		if (format === 'ISO') { return new Date(d); }

		var parts = d.split('/');
		return new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
	}


	EP.Helpers.leafs = function($e) {
		return $e('*').filter( function() {
      		var isLeaf = $(this).children().length === 0;
      		return isLeaf;
   		});
	}

	EP.Helpers.expandVariables = function(string, variables) {
		
		var expandedString = string;
		_.each(variables, function (value, name) {
			var re = new RegExp('\\$' + name, 'gm');
			expandedString = expandedString.replace(re, value);
		});

		return expandedString;
	}

	EP.Helpers.resetDialog = function(dialog) {
		var $e = $(dialog);
		$e.find('.error').css('visibility', 'hidden');
		$e.find('input').val('');
		$e.find("select option").removeAttr('selected');
		$e.find("select option:first-child").attr('selected','selected');
		$e.find("input[type=radio]").prop("checked", false);
	}

	EP.Helpers.filterSelect = function($select, filter) {
		var $current = $select.find('option:selected');
		$select.find('option').hide();
		$select.find('option').filter(filter).show();

		if ($current.filter(filter).length === 0) {
			$current.removeAttr('selected');
			$select.find("option:first-child").attr('selected','selected');
		}
	}

	EP.Helpers.EloRank = {
		k: EP.Settings.kFactor,
		getExpected : function(a, b) {
			return 1 / (1 + Math.pow(10, ((b - a) / 400)));
		},
		updateRating : function(expected, actual, current) {
			return parseInt(current + this.k * (actual - expected), 10);
		}
	}
	// Usage
	//
	// var playerA = 1200;
	// var playerB = 1400;
	//
	// //Gets expected score for first parameter 
	// var expectedScoreA = EloRank.getExpected(playerA,playerB);
	// var expectedScoreB = EloRank.getExpected(playerB,playerA);
	//
	// playerA = EloRank.updateRating(expectedScoreA,1,playerA);
	// playerB = EloRank.updateRating(expectedScoreB,0,playerB);


	EP.Helpers.getQueryStringParam = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	String.prototype.capitalize = function() {
    	return this.replace(/\w\S*/g, function(txt) {
        	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	});
	}

	Date.prototype.daysSince = function(d) {
		return Math.round((this.getTime() - d.getTime()) / (1000 * 3600 * 24));
	}

	Number.prototype.ordinal = function() {
   		var s = ["th","st","nd","rd"];
   		var v = this % 100;
   		return this + ( s[(v - 20) % 10] || s[v] || s[0] );
	}

};

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
/*

EP.Achievements

*/

var EP = EP || {};

EP.Achievements = function() {
	
	var achievements = {

		// Experience

		'First Time': function(p) {
			return p.matches >= 1;
		},
		'Start of a Career': function(p) {
			return p.matches >= 5;
		},
		'House Player': function(p) {
			return p.matches >= 10;
		},
		'Tough Cowboy': function(p) {
			return p.matches >= 20;
		},
		'Wise Fox': function(p) {
			return p.matches >= 50;
		},

		// Games

		'8 Ball': function(p) {
			return _(p.games).contains('8 ball');
		},
		'9 Ball': function(p) {
			return _(p.games).contains('9 ball');
		},
		'1 Pocket': function(p) {
		 	return _(p.games).contains('1 pocket') || _(p.games).contains('one pocket');
		},
		'Rotation': function(p) {
			return _(p.games).contains('rotation');
		},
		'Straight Pool': function(p) {
			return _(p.games).contains('straight pool');
		},
		'Points': function(p) {
			return _(p.games).contains('points');
		},
		'Living Encyclopaedia': function(p) {
			return p.games.length >= 6;
		},

		// Social

		'Good Neighbour': function(p) {
			return p.invitations.length >= 1;
		},
		'Head Hunter': function(p) {
			return p.invitations.length >= 3;
		},
		'Cool Guy': function(p) {
			return p.opponents.length >= 3;
		},
		'Charisma': function(p) {
			return p.opponents.length >= 5;
		},
		'Schoolyard Boss': function(p) {
			return p.opponents.length >= 10;
		},
		'Trend-Setter': function(p) {
			return p.opponents.length >= 15;
		},

		// Belt
		'Kid Wrestler': function(p) {
			return p.hasBelt;
		},
		'Pro Wrestler': function(p) {
			return p.beltPossession >= 1;
		},
		'Heavy-Weight Wrestler': function(p) {
			return p.beltPossession >= 3;
		},
		'Intercontinental Wrestler': function(p) {
			return p.beltPossession >= 5;
		},
		
		// Streaks

		'Hat-Trick': function(p) {
			return p.streak >= 3;
		},
		'Mexican Hat-Trick': function(p) {
			return p.streak >= 5;
		},
		"Santa's Hat-Trick": function(p) {
			return p.streak >= 7;
		},

		// Perfects

		'Perfect': function(p) {
			return p.perfects >= 1;
		},
		'Perfection': function(p) {
			return p.perfects >= 2;
		},
		'Perfectness': function(p) {
			return p.perfects >= 3;
		},
			
		// Rating
		
		'Dragonfly': function(p) {
			return p.weekPoints >= 20;
		},
		'Bird': function(p) {
			return p.weekPoints >= 35;
		},
		'Eagle': function(p) {
			return p.weekPoints >= 50;
		}
	}


	EP.Achievements = {};

	EP.Achievements.percentage = function(player) {
		return Math.floor(player.achievements.length / _(achievements).keys().length * 100);
	}	

	EP.Achievements.evaluate = function(player) {
		
		// Check for new achievements
		_.chain(achievements).keys().difference(player.achievements).each(function (a) {
			if (achievements[a](player)) { player.achievements.push(a) }
		});
		
		// Update level
		var percentageTens = Math.floor(EP.Achievements.percentage(player) / 10);
		switch (percentageTens) {
			case 0:
			case 1:
				player.level = 'Novice';
		    	break;
			case 2:
			case 3:
				player.level = 'Apprentice';
		    	break;
			case 4:
			case 5:
				player.level = 'Expert';
		    	break;
			case 6:
			case 7:
				player.level = 'Master';
		    	break;
			case 8:
			case 9:
				player.level = 'Grand Master';
		    	break;
			case 10:
				player.level = 'Hall of Famer';
		    	break;
			default:
				player.level = 'Novice';
		}

	}	

}



/*

EP.CurrentUser

Information about the logged user

*/

var EP = EP || {};

EP.CurrentUser = function() {

	var username = EP.Dom.$currentUser.attr('data-username');
	var player = EP.Players.get(username);

	EP.CurrentUser = player || { username: username, } ; 
	EP.CurrentUser.isRegistered = player !== undefined;

	if (!EP.CurrentUser.isRegistered) {
		var fullName = EP.Dom.$currentUser.attr('title');
		var nameParts = fullName.match(/(\w+) ([\w ]*)/i) || [fullName, fullName, ''];
		EP.CurrentUser.firstName = nameParts[1];
		EP.CurrentUser.lastName =  nameParts[2];
	}

	EP.CurrentUser.picture = EP.Dom.$currentUser.find('.aui-avatar img').attr('src');

};

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

/*

EP.Match

Defines class EP.Match

Requires: EP.Players

*/


var EP = EP || {};


EP.Match = function() {

	EP.Match = function(matchData) {
		var data = _(matchData).defaults({
			players: ['foo','bar'], 	// Required
			winner: 'foo',				// Only one of winner or looser is required  
			looser: null, 
			perfects: [0,0],
			date: EP.Helpers.today(),
			game: '8 ball',
			bestOf : 1,
			playersUpdates : [null, null]
		});

		_(this).extend(data);

		// Deduce looser from winner or vice versa
		if (this.winner === null) { this.winner = _(this.players).find(function(p) {return p !== this.looser}, this) }
		if (this.looser === null) { this.looser = _(this.players).find(function(p) {return p !== this.winner}, this) }

		// Get players objects from ids
		if (typeof this.players[0] === 'string') { this.players[0] = EP.Players.get(this.players[0]); }
		if (typeof this.players[1] === 'string') { this.players[1] = EP.Players.get(this.players[1]); }
		if (typeof this.winner === 'string') { this.winner = EP.Players.get(this.winner); }
		if (typeof this.looser === 'string') { this.looser = EP.Players.get(this.looser); }

	}

	EP.Match.prototype.getPerfects = function(p) {
		return this.perfects[_(this.players).indexOf(p)];
	}

	EP.Match.prototype.getUpdates = function(p) {
		return this.playersUpdates[_(this.players).indexOf(p)];
	}

	EP.Match.prototype.play = function() {

			// Save players states before match
			var playersBefore = _(this.players).map(function(p) {return p.clone()});
			
			// Update rating
			var winnerRatingBeforeMatch = this.winner.rating;
			var winnerExpectedScore = EP.Helpers.EloRank.getExpected(this.winner.rating, this.looser.rating);
			this.winner.rating = EP.Helpers.EloRank.updateRating(winnerExpectedScore, 1, this.winner.rating);	
			this.looser.rating -= (this.winner.rating - winnerRatingBeforeMatch);

			// Update ranking
			EP.Players.updateRanking();

			// Update belt ownership
			var isBeltChallenge = (this.winner.hasBelt || this.looser.hasBelt) && (this.game === '1 pocket' || this.game === 'one pocket' || this.bestOf > 1);
			if (this.looser.hasBelt && isBeltChallenge) {
				this.looser.hasBelt = false;
				this.winner.hasBelt = true;
			}

			// Update other stats
			_(this.players).each(function(p,i) {
				var points = p.rating - playersBefore[i].rating;
				
				p.matches++;
				p.won += p === this.winner ? 1 : 0;
				p.lost += p === this.looser ? 1 : 0;
				p.perfects += this.perfects[i];
				p.opponents = _.union(p.opponents, [this.players[1-i].username]);
				p.streak = p === this.winner ? p.streak + 1 : 0; 
				if (isBeltChallenge) { p.beltPossession = !p.hasBelt ? null : ( p.beltPossession === null ? 0 : p.beltPossession + 1 );  }
				p.weekPoints = p.weekMatches().length === 0 ? points : p.weekPoints + points;
				// p.inTopSince = p.rank > 5 ? null : ( p.inTopSince ?  p.inTopSince : EP.Helpers.today() );
				p.games = _.union(p.games, [this.game]);

			}, this);

			// Update achievements & level
			_(this.players).each(EP.Achievements.evaluate);

			// Set players updates
			this.playersUpdates = _(this.players).map(function (p, i) { return p.compare(playersBefore[i]); });


	}

}

/*

EP.Matches


Requires: EP.Data, EP.Players, EP.Match

*/

// TODO: move view related stuff to matches-table.js


var EP = EP || {};

EP.Matches = function() {

	EP.Matches = {};
	var matches = [];

	function read($table, encoding) {
		encoding = encoding || 'view';

		return $table.find('tr:has(td)').map(function (i, row) {

			var $cells = $(row).find('td');

			var data = {

				winner : $cells.eq(2).text(),
				looser : $cells.eq(4).text(),
				date: new Date($cells.eq(0).find("time").attr("datetime")),
				game: $cells.eq(1).text().split(' - ')[0],
				bestOf: parseInt($cells.eq(1).text().split(' - ')[1].match(/\d+/)[0]),

			};

			data.players = [data.winner, data.looser];


			data.playersUpdates = _([$cells.eq(3), $cells.eq(5)]).map(function ($e) {
				var html = $e.html();
				var perfectsMatch = html.match(/\+(\d+) perfect/i);
				var ratingMatch = html.match(/([\+\-]\d+) pts/i);
				var rankMatch = html.match(/([\+\-]\d+) place/i);
				var levelMatch = html.match(/\+Level\:? ([\w ]*\w)/i);
				var beltMatch = html.match(/([\+\-])Belt/i);
				return {
					perfects: perfectsMatch ? parseInt(perfectsMatch[1]) : 0,
					rating: ratingMatch ? parseInt(ratingMatch[1]) : 0,
					rank: rankMatch ? parseInt(rankMatch[1]) : 0,
					level: levelMatch ? levelMatch[1] : null,
					belt: beltMatch ? parseInt(beltMatch[1] + '1') : 0,
					achievements: EP.Helpers.getTip($e)
				}
			});

			return new EP.Match(data);
		}).get();
	}

	EP.Matches.readData = function() {

		matches = read(EP.Data.$.find('.matches-table'), 'data');
	}
	
	EP.Matches.readView = function() {

		matches = read(EP.Dom.$matches, 'view');	
	}

	EP.Matches.writeData = function() {
		var $tbody = EP.Data.$.find('.matches-table tbody');
		
		$tbody.find('tr').slice(1).remove();
		
		_(matches).each(function (match) {
			$tbody.append(JST.matchRow(match));
		})
	}

	EP.Matches.writeView = function() {

		// Not needed for the moment because we reload page when a change is made
	}

	EP.Matches.list = function(sortAttribute) {
		return sortAttribute == null ? matches : _(matches).sortBy(sortAttribute);
	}

	EP.Matches.playedThisWeek = function(p) {
		var today = EP.Helpers.today();
		var weekMatches = _(matches).filter(function (m) {
			return	_(m.players).contains(p) && today.daysSince(m.date) < 7 && m.date.getDay() <= today.getDay();
		});
		return weekMatches;
	}

	// Add and persist a match
	// Side effect: update players profiles
	EP.Matches.add = function(matchData) {
		EP.Data.get(function () {

			EP.Players.readData();
			EP.Matches.readData();

			var match = new EP.Match(matchData);
			matches.unshift(match);
			match.play();

			EP.Players.writeData();
			EP.Matches.writeData();
			EP.Data.saveAndReload("Your match has been recorded!");

		});
	}

	EP.Matches.readView();

}
/*

EP.Player

Defines class EP.Player

*/


var EP = EP || {};

EP.Player = function() {

	EP.Player = function(playerData) {

		var data = _(playerData).defaults({
			username: 'foo', 					// Required
			stageName: 'bar',					// Required  
			firstName: '',
			lastName: '',
			hasBelt: false,
			matches: 0,
			won: 0,
			lost: 0,
			perfects: 0,
			rating: EP.Settings.initialRating,
			rank: null,
			achievements: [],
			level: 'novice',
			invitations: [],
			opponents: [],
			streak: 0,
			beltPossession: null,
			weekPoints: 0,
			//inTopSince: null,
			games: []
		});

		_(this).extend(data);

	}

	EP.Player.prototype.fullName = function() {
		return this.firstName + ' ' + this.lastName;
	}

	EP.Player.prototype.clone = function() {
		var clone = _(this).clone();
		clone.achievements = _(this.achievements).map(_.clone);
		clone.invitations = _(this.invitations).map(_.clone);
		clone.opponents = _(this.opponents).map(_.clone);
		clone.games = _(this.games).map(_.clone);
		return clone;
	}

	EP.Player.prototype.compare = function(p) {
		return {
			perfects : this.perfects - p.perfects,
			rating: this.rating - p.rating,
			rank: this.rank !== null && p.rank !== null ? -(this.rank - p.rank) : null,
			achievements: _(this.achievements).difference(p.achievements),
			level: this.level !== p.level ? this.level : null,
			belt: this.hasBelt - p.hasBelt
		}

	}
	
	EP.Player.prototype.weekMatches = function() {
		return EP.Matches.playedThisWeek(this);
	}

	// EP.Player.prototype.weekPoints = function() {
	// 	return _(this.weekMatches()).reduce(function (sum, m) {
	// 		return sum += m.getUpdates(this).rating;
	// 	}, 0, this);
	// }

}
/*

EP.Palyers

- Players data and CRUD operations
- Players table UI

*/

// TODO: move view related stuff to players-table.js


var EP = EP || {};

EP.Players = function() {

	EP.Players = {};
	var players = [];

	function read($table, encoding) {
		encoding = encoding || 'view';

		return $table.find('tr:has(td)').map(function (i, row) {

			var $cells = $(row).find('td');

			var nameMatch = $cells.eq(0).text().match(/(\w+) ([\w ]*) \((.*)\)/i);
			
			var data = {

				username: nameMatch[3],
				stageName: $cells.eq(1).text(),
				firstName: nameMatch[1],
				lastName: nameMatch[2],

				hasBelt: $cells.eq(0).text().search(/belt owner/i) !== -1,

				matches: parseInt($cells.eq(2).text()),
				won: parseInt($cells.eq(3).text()),
				lost: parseInt($cells.eq(4).text()),
				perfects: parseInt($cells.eq(8).text()) || 0,
				rating: parseInt($cells.eq(5).text()),
				rank: parseInt($cells.eq(6).text()),

				achievements: EP.Helpers.getTip($cells.eq(7).find('p').eq(1)),
				level: $cells.eq(7).find('p').eq(0).text(),

				invitations: EP.Helpers.getTip($cells.eq(9)),
				opponents: EP.Helpers.getTip($cells.eq(10)),
				streak: parseInt($cells.eq(11).text()) || 0,
				beltPossession: parseInt($cells.eq(12).text()) || null,
				weekPoints : parseInt($cells.eq(13).text()) || 0,
				// inTopSince: inTopSinceString ? EP.Helpers.dateFromString(inTopSinceString, 'ISO') : null,
				games: EP.Helpers.getTip($cells.eq(14))

			}

			return new EP.Player(data);

		}).get();
	}

	EP.Players.readData = function() {

		players = read(EP.Data.$.find('.players-table', 'data'));
	}

	EP.Players.readView = function() {

		players = read(EP.Dom.$players, 'view');
	}

	EP.Players.writeData = function() {
		var $tbody = EP.Data.$.find('.players-table tbody');

		$tbody.find('tr').slice(1).remove();
		
		_(players).each(function (player) {
			$tbody.append(JST.playerRow(player));
		})
	}

	EP.Players.writeView = function() {

		// Not needed for the moment because we reload page when a change is made
	}

	EP.Players.get = function(username) {

		return _(players).findWhere({'username': username});
	}

	EP.Players.list = function(sortAttribute) {

		return sortAttribute == null ? players : _(players).sortBy(sortAttribute);
	}

	EP.Players.updateRanking = function() {
		_.chain(players).sortBy('rating').reverse().each(function (p, i) { 
			p.rank = i + 1;
		});
	}


	EP.Players.add = function (playerData) {
		EP.Data.get(function () {

			EP.Players.readData();

			var player = new EP.Player(playerData);
			players.unshift(player);
			EP.Players.updateRanking();
			players = _(players).sortBy('stageName');

			EP.Players.writeData();

			var message = EP.CurrentUser.username === player.username ? "You are now registered, welcome onboard!" : "Player has been registered!";
			EP.Data.saveAndReload(message);
		
		})
	}

	EP.Players.readView();

}

/*

EP.Settings

Common settings used by other modules

*/

var EP = EP || {};

EP.Settings = function() {

	EP.Settings = {
		environment: 'test',
		supportEmail: 'rwa@emakina.com',
		supportName: 'Emakina Pool Test',
		pageId: '102662893',
		kFactor: 32,
		initialRating: 1500
	}

};

/*

EP.Dom

Dom accessors for the confluence page

IMPORTANT:
	Modules should always use EP.Dom to access elements in the confluence page. 
	The use of "$(selector)" is not recommended.

*/

var EP = EP || {};

EP.Dom = function() {

	var $navLinks = $('.client-side-toc-macro span.toc-item-body a');
	var $sections = $('.contentLayout2 .columnLayout');

	EP.Dom = {

		$toolbar: $('#page-toolbar'),
		$currentUser: $('#user-menu-link'),
		$players: $('.players-table'),
		$matches: $('.matches-table'),
		$submitMatchButton: $('#add-match-button'),
		$registerButton: $('#subscribe-button'),

		NavLinks: {
			$join: 		$navLinks.eq(0),
			$profile: 	$navLinks.eq(1),
			$players: 	$navLinks.eq(2),
			$matches: 	$navLinks.eq(3),
			$gallery: 	$navLinks.eq(4),
			$faq: 		$navLinks.eq(5)
		},
		Sections: {
			$nav: 			$sections.eq(0),
			$join: 			$sections.eq(1),
			$profile: 		$sections.slice(2,4),
			$players: 		$sections.eq(4),
			$matches: 		$sections.eq(5),
			$gallery: 		$sections.eq(6),
			$faq: 			$sections.eq(7),
			$profileSummary: 		$sections.eq(2),
			$profileAchievements: 	$sections.eq(3)
		},
		Templates: {
			$submitMatch: $('#submit-match-template')	
		}

	};

	EP.Dom.Achievements = {
		$gauge : EP.Dom.Sections.$profileAchievements.find('.aui-lozenge').eq(0)
	};


};

/*

EP.Page

Gloabl page enhancement such as:
  * More sections and buttons
  * Tabs
  * Tooltips

*/

var EP = EP || {};

EP.Page = function() {

	// MESSAGING DIV -----------------------------

	// Add messaging div
	$('#rw_page_toolbar').before('<div id="aui-message-bar"></div>');

	// Display confirmation message if query string parameter set
	var confirmation = EP.Helpers.getQueryStringParam('confirmation');
	if (confirmation !== '') {
		AJS.messages.success({title: confirmation});
		history.replaceState(null, null, location.href.split("?")[0]);
	}


	// ADDITIONAL SECTIONS AND TOOLBAR ------------------------

	EP.Dom.NavLinks.$gallery.show();
	EP.Dom.Sections.$gallery.show();

	if (EP.CurrentUser.isRegistered) {
		$('#page-toolbar').show();
		EP.Dom.NavLinks.$profile.show();
		EP.Dom.Sections.$profile.show();
	}

	if (!EP.CurrentUser.isRegistered) {
		EP.Dom.NavLinks.$join.show();
		EP.Dom.Sections.$join.show();
	}


	// TABS -------------------------------------------------

	function hideTab(tab) {
		EP.Dom.Sections[tab].hide();
		EP.Dom.NavLinks[tab].removeClass('active');	
	}

	function showTab(tab) {
		EP.Dom.NavLinks[tab].addClass('active');
		EP.Dom.Sections[tab].show();
	} 

	// Hide titles
	$('.wiki-content h1').hide();

	// Show first tab hide others
	var visibleTabs = _.filter(_.keys(EP.Dom.NavLinks), function(k) { return EP.Dom.NavLinks[k].is(':visible') });
	showTab(visibleTabs[0]);
	visibleTabs.shift();
	_.each(visibleTabs, function(tab) { hideTab(tab) });

	// Add click behaviour
	_.each(EP.Dom.NavLinks, function($navLink, key) {

		$navLink.click(function() {
			var newTab = key;
			var curTab = _.find(_.keys(EP.Dom.NavLinks), function(k) { return EP.Dom.NavLinks[k].hasClass('active') });
			
			if (curTab) { hideTab(curTab) }
			showTab(newTab);
			
			return false;
		})

	});


	// TOOLTIPS --------------------------------------------------

	var tooltipId = 0;
	
	function createTooltip($a) {
		
		var tooltipContent = EP.Helpers.getTip($a).join('<br> ');

		AJS.InlineDialog(
			$a, 
			'inline-tooltip-' + tooltipId , 
			function(content, trigger, showPopup) { 
				content.css({ padding: '15px' }).html(tooltipContent);
    			showPopup();
    			return false;
			},
			{
				width: 'inherit',
				closeOnTriggerClick: true
			}
		);
		tooltipId++;
	}

	$('a[href*="tip://"]').each(function() {
		createTooltip($(this));
	});


	// STAGE NAMES --------------------------------------------------

	//TODO: implement

};

/*

EP.ProfileSection

Fills the profile section with information about the current user

*/

var EP = EP || {};

EP.ProfileSection = function() {

	// Only available if user is registered
	if (!EP.CurrentUser.isRegistered) {return}
	
	// Variables

	var variables = {
		summary : EP.CurrentUser.level.toUpperCase() + ' &nbsp;-&nbsp; Ranked #' + EP.CurrentUser.rank	
	}
	if (EP.CurrentUser.hasBelt) {
		variables.summary += ' &nbsp;-&nbsp; Belt owner';
	}

	// Inject data in profile section

	var $section = EP.Dom.Sections.$profileSummary;
	$section.find('img').eq(0).attr('src', EP.CurrentUser.picture).attr('');
	
	var html = $section.html();
	html = EP.Helpers.expandVariables(html, EP.CurrentUser);
	html = EP.Helpers.expandVariables(html, variables);
	$section.html(html);

	// Mark completed achievements

	var achievements = _(EP.CurrentUser.achievements).map(function(a) { return a.toUpperCase() });
	var $matches = EP.Dom.Sections.$profileAchievements.find('td p:first-child').filter(function () { 
		return _(achievements).contains($(this).text().trim().toUpperCase());
	});
	$matches.closest('tr').addClass('completed');

	// Set gauge
	var percentage = EP.Achievements.percentage(EP.CurrentUser);
	EP.Dom.Achievements.$gauge.before('<span id="achievements-gauge"> </span>');
	$('#achievements-gauge').css('width', percentage + '%');
	EP.Dom.Achievements.$gauge.text(percentage + '% completed');

	// Mark level related achievements
	var $match = EP.Dom.Sections.$profileAchievements.find('table').last().find('td>p:first-child').filter(function () { 
		return EP.CurrentUser.level.toUpperCase() === $(this).text().trim().toUpperCase();
	});
	$match.closest('tr').addClass('completed').prevAll(':has(td)').addClass('completed');

};

/*


EP.RegisterDialog

Flow:
	1. Reset & Show dialog
	2. Handle user input (validation rules and dynamics)
	3. Submit and save player 

*/

var EP = EP || {};

EP.RegisterDialog = function() {

	// Create dialog from template
	
	var html = JST.registerDialog({number: EP.Players.list().length + 1});
	$('body').append(html);
	var dialog = AJS.dialog2('#register-dialog');
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers

	EP.Dom.$registerButton.click(function() {dialog.show();});

	// Validation rules

	var Validations = {	
	 	mandatoryFields: function() {
	 		Validations.State.mandatoryFields = $('#player-stage-name').val() !== '';
	 	},
		nameNotTaken: function() {
			
			var stageName = $.trim($('#player-stage-name').val()).toUpperCase();
			var playerWithSameName = _(EP.Players.list()).find(function (p) { return p.stageName.toUpperCase() === stageName });
			
			Validations.State.nameNotTaken = playerWithSameName === undefined;

			if (Validations.State.nameNotTaken) {
				$('#player-stage-name-error')
					.css('visibility', 'hidden');
			} else {
				$('#player-stage-name-error')
					.text('"' + playerWithSameName.stageName + '" is already taken! (by ' + playerWithSameName.fullName() + ')')
					.css('visibility', 'visible');
			}
		},


	}

	// Update the save button active state (added to every validation function)
	
	_(Validations).each(function(func, name) {
		Validations[name] = function() {
	     func();
	     var cannotSubmit = _.chain(Validations.State).values().contains(false).value();
			$('#player-save-button').attr('aria-disabled', cannotSubmit ? 'true' : 'false');
		}
	})

	// Wiring
	Validations.State = {};
	$('#player-stage-name').on('input propertychange paste', Validations.mandatoryFields);
	$('#player-stage-name').on('input propertychange paste', Validations.nameNotTaken);
	dialog.on('show', Validations.mandatoryFields);

	// Cancel action
	$('#player-cancel-button').click( function() { dialog.hide() });

	// Save action
	$('#player-save-button').click( function() {

		//TODO: spinner needed?

		EP.Players.add( {
			username: EP.CurrentUser.username,
			firstName: EP.CurrentUser.firstName,
			lastName: EP.CurrentUser.lastName,
			stageName: $.trim($('#player-stage-name').val())
		});
		
		dialog.hide();
	});


};

/*


EP.SubmitMatchDialog

Flow:
	1. Reset & Show dialog
	2. Handle user input (validation rules and dynamics)
	3. Submit and save match 

*/

var EP = EP || {};

EP.SubmitMatchDialog = function() {

	// Create dialog from template
	
	var players = _(EP.Players.list('firstName')).reject(function (p) { return p.username === EP.CurrentUser.username});
	var html = JST.submitMatchDialog({ players: players});
	$('body').append(html);
	var dialog = AJS.dialog2("#add-match-dialog");
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Tooltips
	
	// AJS.$("#tooltip-perfects").tooltip({html: true });
	// AJS.$("#tooltip-games").tooltip({html: true });

	// Triggers

	EP.Dom.$submitMatchButton.click(function() {dialog.show();});

	// Validation rules

	var Validations = {	
	 	mandatoryFields: function() {
	 		Validations.State.mandatoryFields =
	 			$("#match-opponent").val() !== '' &&
	 			$("#match-outcome").val() !== ''
	 	},
	}

	// Update the save button active state (added to every validation function)
	
	_(Validations).each(function(func, name) {
		Validations[name] = function() {
	     func();
	     var cannotSubmit = _.chain(Validations.State).values().contains(false).value();
			$('#match-save-button').attr('aria-disabled', cannotSubmit ? 'true' : 'false');
		}
	})

	// Wiring
	Validations.State = {};
	$("#match-opponent, #match-outcome").change(Validations.mandatoryFields);
	dialog.on('show', Validations.mandatoryFields);


	// Form dynamics

	var Dynamics = {
		filterPerfects: function() {
			// Get som info
			var count = Math.floor(parseInt($("#match-format").val()) / 2) + 1;
			var $perfects = $('#match-perfects-me, #match-perfects-him');
			var numPerfects = $perfects.map(function () {return parseInt($(this).val())});
			
			// Compute maximum allowed value of each drop down
			var maximums1 = [
				$('#match-outcome').val() === '0' ? count - 1 : count,
				$('#match-outcome').val() === '1' ? count - 1 : count
			];
			var maximums = maximums1;
			if ($('#match-outcome').val() === '') {
				if (numPerfects[0] === count) { maximums[1] = count - 1; }
				if (numPerfects[1] === count) { maximums[0] = count - 1; }
			}  

			// Reset both drop-down if combination is invalid
			var isInvalid = _.chain(numPerfects).map(function (num, i) {return num <= maximums[i]}).contains(false).value();
			if (isInvalid) {
				maximums = maximums1;
				$perfects.find('option').removeAttr('selected');
				$perfects.find('option:first-child').attr('selected','selected');
			}

			// Limit drop down values to their maximums
			$perfects.find('option').show();
			_(maximums).each(function(max,i) {
				$perfects.eq(i).find('option').filter(function() {return parseInt($(this).attr('value')) > max}).hide();
			});
		}
	}
	// Wiring
	$("#match-outcome, #match-format, #match-perfects-me, #match-perfects-him").change(Dynamics.filterPerfects);
	dialog.on('show', Dynamics.filterPerfects);


	// Cancel action
	$('#match-cancel-button').click( function() { dialog.hide() });


	// Save action
	$('#match-save-button').click( function() {
		//TODO: spinner needed?
		
		var matchData = {
			players: [
				EP.CurrentUser.username, 
				$('#match-opponent').val()
			],
			perfects: [
				parseInt($('#match-perfects-me').val()),
				parseInt($('#match-perfects-him').val()),
			],
			game: $('#match-game').val(),
			bestOf: parseInt($('#match-format').val())
		};
		matchData.winner = $('#match-outcome').val() === '1' ? matchData.players[0] : matchData.players[1];

		EP.Matches.add(matchData);
		dialog.hide();
	});


};

/*

Entry point

*/

$(function () {
	
	// Global stuff
	EP.Settings();
	EP.Helpers();
	EP.Dom();
	
	// Models
	EP.Data();
	EP.Player();
	EP.Match();
	EP.Achievements();
	EP.Players();
	EP.Matches();
	EP.CurrentUser();

	// Views
	EP.Page();
	EP.ProfileSection();
	//EP.PlayersTable();
	//EP.MatchesTable();

	// Dialogs
	EP.SubmitMatchDialog();
	EP.RegisterDialog();

});
