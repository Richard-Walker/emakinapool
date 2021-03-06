/*! emakinapool - v0.1.0 - 2015-09-28
* Copyright (c) 2015 Richard Walker; Licensed GPL-3.0 */

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


/*

EP.Helpers

Helpers

*/

var EP = EP || {};

EP.Helpers = function() {

	EP.Helpers = {}


	/* 
	---------------------------------------------------------------------------------------------------
	
	Misc

	---------------------------------------------------------------------------------------------------
	*/
	 

	EP.Helpers.upperCase = function(s) { return s.toUpperCase() };

	EP.Helpers.parseName = function(fullName) {
		var nameParts = fullName.match(/([^ ]+) (.*[^ ])/i) || [fullName, fullName, ''];
		return { firstName: nameParts[1], lastName: nameParts[2] }
	}

	EP.Helpers.parseEmail = function(email) {
		var emailParts = email.match(/(.*) <(.*)>/i) || [null, null, email];
		return { name: emailParts[1], email: emailParts[2] }
	}

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
		$e.find('input:not([type=hidden])').val('');
		$e.find('textarea').val('');
		$e.find('select option').removeAttr('selected');
		$e.find('select option:first-child').attr('selected','selected');
		$e.find('input[type=radio]').prop('checked', false);
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

	EP.Helpers.getQueryStringParam = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	/* 
	---------------------------------------------------------------------------------------------------
	
	Date & time

	---------------------------------------------------------------------------------------------------
	*/
	 

	Date.prototype.addHours = function(h) {    
   		this.setTime(this.getTime() + (h*60*60*1000)); 
   		return this;   
	}

	Date.prototype.addMinutes = function(m) {    
   		this.setTime(this.getTime() + (m*60*1000)); 
   		return this;   
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

		var yyyy = d.getFullYear(),
			dd = d.getDate().pad(),
			mm = (d.getMonth() + 1).pad()

		return format === 'ISO'  ?  yyyy + '-' + mm + '-' + dd  :  dd + '/' + mm + '/' + yyyy
	}

	EP.Helpers.dateFromString = function(d, format) {
		format = format || 'FR';

		var parts = [];

		if (format === 'ISO') { 
			parts = _(d.split('-')).map(function(n) {return parseInt(n)});
			return new Date(parts[0], parts[1] - 1, parts[2]);
		} else {
			parts = _(d.split('/')).map(function(n) {return parseInt(n)});
			return new Date(parts[2], parts[1] - 1, parts[0]);
		}
	}

	/* 
	---------------------------------------------------------------------------------------------------
	
	STRING extensions

	---------------------------------------------------------------------------------------------------
	*/
	 

	String.prototype.capitalize = function() {
    	return this.replace(/\w\S*/g, function(txt) {
        	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	});
	}

	String.prototype.lowerFirst = function() {
    	return this.charAt(0).toLowerCase() + this.slice(1);
	}

	// This works only if 1st word is the verb
	String.prototype.pastTense = function(pronoun) {

		var irregularities = {
			'win': 'won',
			'lose': 'lost',
			'get': 'got',
			'keep': 'kept',
			'make': 'made' 
		}

    	return pronoun + ' ' + this.replace(/^\w*/, function(verb) {
    		verb = verb.toLowerCase();
    		return irregularities[verb] || verb.replace(/e$/,'') + 'ed';
    	});

	}

	// This works only if 1st word is the verb
	String.prototype.futureTense = function(pronoun) {
    	return this.replace(/^\w*/g, function(verb) {
        	return pronoun + ' will ' + verb.toLowerCase();
    	});
	}

	Date.prototype.daysSince = function(d) {
		return Math.round((this.getTime() - d.getTime()) / (1000 * 3600 * 24));
	}

	/* 
	---------------------------------------------------------------------------------------------------
	
	NUMBER extensions

	---------------------------------------------------------------------------------------------------
	*/
	 

	Number.prototype.ordinal = function() {
   		var s = ["th","st","nd","rd"];
   		var v = this % 100;
   		return this + ( s[(v - 20) % 10] || s[v] || s[0] );
	}

	Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }

};

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

		var files = _(EP.Mail.files).filter(function(f) { return _(templateData.files).contains(f.cid) });
		if (templateData.banner) {
			files.push(templateData.banner.file);
		}

		var data = {
			from: from.email,
			fromname: from.name,
			to: _(to).pluck('email'),
			toname: _(to).pluck('name'),
			subject: subject,
			html: JST.mailHeader() + message,
			files: files
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
/* 
---------------------------------------------------------------------------------------------------

EP.Rating

---------------------------------------------------------------------------------------------------
*/
 

var EP = EP || {};




EP.Rating = function() {

	EP.Rating = {}

	EP.Rating.Elo = {
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


	Math.combinations = function(n, k) {
		var max = Math.max(k, n - k);
  		var result = 1;
  		for (var i = 1; i <= n - max; i++) {
    		result *= (max + i) / i;
  		}
  		return result;
	}

	/*
	 	p:      chances of winning a single game
	 	n:      number of games required to win the match 
		return: chances of winning a race to n games match
	*/
	EP.Rating.chances = function(p, n) {

		var result = 0;
		var maxGames = 2 * n - 1;
		
		for (var i = n; i <= maxGames; i++) {
			result += Math.pow(p, i) * Math.pow(1 - p, maxGames - i) * Math.combinations(maxGames, i);
		}

		return result;
	}


	/*
		winnerRating:  winner's rating before match
		loserRating:   loser's rating before match
		n:             number of games required to win the match
		return:        new ratings
	*/
	EP.Rating.ratingUpdates = function(winnerRating, loserRating, n) {

		if (EP.Settings.biggerKFactorForLongerMatches) {
			EP.Rating.Elo.k = EP.Settings.kFactor * n;
		}

		var expected = EP.Rating.chances(EP.Rating.Elo.getExpected(winnerRating, loserRating), n);
		
		var newWinnerRating = EP.Rating.Elo.updateRating(expected, 1, winnerRating);
		var newLoserRating = loserRating - (newWinnerRating - winnerRating);

		return {
			winner: newWinnerRating,
			loser: newLoserRating
		}

	}



}
/*

EP.Achievements

*/

var EP = EP || {};

EP.Achievements = function() {
	
	var Evaluators = {

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
			return p.beltPossession === 0 || p.beltPossession > 0;
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
			return p.matches >= 10 && p.weekPoints >= 30;
		},
		'Bird': function(p) {
			return p.matches >= 10 && p.weekPoints >= 60;
		},
		'Eagle': function(p) {
			return p.matches >= 10 && p.weekPoints >= 100;
		}
	}


	EP.Achievements = {};

	var achievements = [];

	EP.Achievements.readView = function() {
		achievements = EP.Dom.Sections.$profileAchievements.find('tr:has(td)').map(function() {
			var $cells = $(this).find('td');
			var a = {
				title:  $cells.eq(1).find('p').eq(0).text(),
				objective: $cells.eq(1).find('p').eq(1).text(),
				gift:   $cells.eq(1).find('p').eq(2).text(),
				imgUrl: $cells.eq(0).find('img').attr('src'),
				isLevel: $(this).closest('div.table-wrap').is(':last-of-type'),
			}
			if (a.gift === '') { a.gift = null }
			if (!a.isLevel) { a.evaluate = Evaluators[a.title] }
			return a;
		})
	}

	EP.Achievements.list = function(sortAttribute) {
		return sortAttribute == null ? achievements : _(achievements).sortBy(sortAttribute);
	}

	EP.Achievements.get = function(title) {
		return _(achievements).findWhere({'title': title});
	}

	EP.Achievements.percentage = function(player) {
		return Math.floor(player.achievements.length / _(achievements).where({isLevel: false}).length * 100);
	}	

	var levels = ['Novice', 'Apprentice', 'Expert', 'Master', 'Grand Master', 'Hall of Famer'];

	function level(percentage) {
		var percentile = Math.floor(percentage / 20);
		return levels[percentile];
	}

	EP.Achievements.evaluate = function(player) {
		
		// Check for new achievements
		var notYetAchieved = _.chain(achievements).where({'isLevel': false}).reject(function(a) { return _(player.achievements).contains(a.title) });
		notYetAchieved.each(function (a) {
			if (a.evaluate(player)) {
				player.achievements.push(a.title);
				player.notifications.push({type: 'achievement', value: a.title});
			}
		});
		
		// Update level
		var levelBefore = player.level;
		player.level = level(EP.Achievements.percentage(player));
		if (player.level !== levelBefore) {
			player.notifications.push({type: 'achievement', value: player.level});			
		} 
	}

	EP.Achievements.nextLevel = function(player) {
		var percentage = EP.Achievements.percentage(player);
		var nextPercentile = Math.floor(percentage / 20) + 1;
		
		if (nextPercentile >= levels.length) { 
			return null;
		} else {
			return {
				title: levels[nextPercentile],
				remaining: Math.ceil((_(achievements).where({isLevel: false}).length * nextPercentile * 20 / 100)) - player.achievements.length
			}
		}   
	}


	EP.Achievements.readView();

}



/* 
---------------------------------------------------------------------------------------------------

EP.Banners

---------------------------------------------------------------------------------------------------
*/

EP = EP || {}

var EP = EP || {};

EP.Banners = function() {

	EP.Banners = {};

	var banners = [
		{
			image: 'barak.jpg',
			players: [{
				name: 'Barak',
				quotes: ["If you're walking down the right path and you're willing to keep walking, eventually you'll make progress."],
				quoteName: 'Barak Obama'
			}]
		}, 
		{
			image: 'brad.jpg',
			players: [{
				name: 'Brad',
				quotes: ["If you want to look cool <%=recipient.firstName%>, remember to play it cool."],
				quoteName: 'Brad Pitt'
			}]
		}, {
			image: 'cat.jpg',
			players: [{
				name: 'The cat',
				quotes: ["Sometimes the predator has to hide from its pray."],
				quoteName: 'A clever cat'
			}]
		}, {
			image: 'clint.jpg',
			players: [{
				name: 'Clint',
				quotes: ["You see, in this world there's two kinds of people, my friend: Those with loaded guns and those who dig. On which side of the gun are you <%=recipient.stageName%>?"],
				quoteName: 'Clint Eastwood as Blondie'
			}]
		}, {
			image: 'elvis-marilyn-james.jpg',
			players: [{
				name: 'Elvis',
				quotes: ["Well it's one for the money, two for the show, three to get ready, now go cat go!"],
				quoteName: 'Elvis Presley'
			}, {
				name: 'Marilyn',
				quotes: ["Fear is stupid. So are regrets. Don't be stupid <%=recipient.firstName%>."],
				quoteName: 'Marilyn Monroe'
			}, {
				name: 'James Dean',
				quotes: ["The gratification comes in playing, not in winning."],
				quoteName: 'James Dean'
			}]
		}, {
			image: 'god.jpg',
			players: [{
				name: 'God',
				quotes: ["May the pool gods be on your side <%=recipient.stageName%>..."],
				quoteName: '',
			}]
		}, {
			image: 'jack.jpg',
			players: [{
				name: 'Jack',
				quotes: ["When I play pool I like a drink, a Martini."],
				quoteName: 'James Bond'
			}]
		}, {
			image: 'jackie.jpg',
			players: [{
				name: 'Jackie',
				quotes: ["Anyone can be a Superman, but nobody can be <%=recipient.stageName%>."],
				quoteName: 'Jackie Chan'
			}]
		}, {
			image: 'john.jpg',
			players: [{
				name: 'Don Draper'
			}]
		}, {
			image: 'johnny-dep.jpg',
			players: [{
				name: 'Johnny',
				quotes: ["I slept on the pool table and made a dream. You were winning in my dream <%=recipient.firstName%>."],
				quoteName: 'Johnny Depp'
			}]
		}, {
			image: 'johnny-halliday.jpg',
			players: [{
				name: 'Johnny',
				quotes: ["Ce match, <%=recipient.firstName%>, c'est l'occasion de remettre les pendules à leur place."],
				quoteName: 'Johnny Halliday'
			}]
		}, {
			image: 'justin.jpg',
			players: [{
				name: 'Justin',
				quotes: ["<%=recipient.firstName%>, I want your game to be fun."],
				quoteName: 'Justin Bieber'
			}]
		}, {
			image: 'marlon.jpg',
			players: [{
				name: 'Marlon Brando',
			}]
		}, {
			image: 'michael-jackson.jpg',
			players: [{
				name: 'Michael',
				quotes: ["Pool is easier than the moonwalk."],
				quoteName: 'Michael Jackson'
			}]
		}, {
			image: 'michael-jordan.jpg',
			players: [{
				name: 'Michael Jordan',
				quotes: ["Be confident <%=recipient.stageName%>, kill this <%=opponent.stageName%> son of a ****!"],
				quoteName: 'Michael Jordan'
			}]
		}, {
			image: 'spok-kirk.jpg',
			players: [{
				name: 'Spock',
				quotes: ["<%=recipient.stageName%>, I see no reason to stand here and be insulted."],
				quoteName: "Spock"
			},{
				name: 'Captain Kirk',
				quotes: ["Conquest is easy. Control of the white ball is not."],
				quoteName: "Capitain Kirk"
			}]
		}, {
			image: 'batman-robin.jpg',
			players: [{
				name: 'Batman',
				quotes: ["I'm Batman, he's Robin, you're <%=recipient.stageName%>, we are super heros. <%=opponent.stageName%> is the super villain."],
				quoteName: 'Bruce Wayne'
			}, {
				name: 'Robin',
				quotes: ["He's Batman, I'm Robin, you're <%=recipient.stageName%>, we are super heros. <%=opponent.stageName%> is the super villain."],
				quoteName: 'Robin'
			}]
		}, {
			image: 'tom-paul.jpg',
			players: [{
				name: 'Tom Cruise'
			}, {
				name: 'Paul Newman',
				quotes: ["You gotta have two things to win. You gotta have brains and you gotta have balls. Now <%=recipient.firstName%>, you got too much of one and not enough of the other."],
				quoteName: 'Paul Newman as Eddie Felson'
			}]
		}, {
			image: 'troopers.jpg',
			players: [{
				name: 'The troopers',
				quotes: ["It's fun on the dark side, come and join the party!"],
				quoteName: 'A starship trooper'
			}]
		}
	]

	var meta = {
		females: ['Marilyn'],
		plurals: ['The troopers']
	}

	EP.Banners.get = function() {
		var banner = _(banners).sample();
		var player = _(banner.players).sample();
		
		return {
			file: {
				path: './img/' + banner.image,
				cid: banner.image.split('.')[0]
			},
			player: {
				name: player.name,
				female: _(meta.females).contains(player.name),
				plural: _(meta.plurals).contains(player.name)
			}
		}
	}

	EP.Banners.getWithQuote = function(templateData) {
		
		var banner = _(banners).sample();
		var player = _(banner.players).sample();
		while (!player.quotes || player.quotes.length === 0) {
			banner = _(banners).sample();
			player = _(banner.players).sample();
		}

		var quote = _.template(_(player.quotes).sample());

		return {
			file: {
				path: './img/' + banner.image,
				cid: banner.image.split('.')[0]
			},
			quote: quote(templateData),
			quoteName: player.quoteName
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
		var name = EP.Helpers.parseName(EP.Dom.$currentUser.attr('title'));
		EP.CurrentUser.firstName = name.firstName;
		EP.CurrentUser.lastName =  name.lastName;
	}

	EP.CurrentUser.picture = EP.Dom.$currentUser.find('.aui-avatar img').attr('src');

};

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
			success: function() { EP.Data.isLocked = false; if (callback) { callback(); } }
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
				"number": version + 1,
				"message": 'Updated from app'
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
			location.href = AJS.Confluence.getBaseUrl() + EP.Settings.pagePath + '?confirmation=' + encodeURIComponent(JSON.stringify(message));
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
			winner: 'foo',				// Only one of winner or loser is required  
			loser: null, 
			perfects: [0,0],
			date: EP.Helpers.today(),
			game: '8 ball',
			bestOf : 1,
			playersUpdates : [null, null]
		});

		_(this).extend(data);

		// Deduce loser from winner or vice versa
		if (this.winner === null) { this.winner = _(this.players).find(function(p) {return p !== this.loser}, this) }
		if (this.loser === null) { this.loser = _(this.players).find(function(p) {return p !== this.winner}, this) }

		// Get players objects from ids
		if (typeof this.players[0] === 'string') { this.players[0] = EP.Players.get(this.players[0]); }
		if (typeof this.players[1] === 'string') { this.players[1] = EP.Players.get(this.players[1]); }
		if (typeof this.winner === 'string') { this.winner = EP.Players.get(this.winner); }
		if (typeof this.loser === 'string') { this.loser = EP.Players.get(this.loser); }

	}

	EP.Match.prototype.getPerfects = function(p) {
		return this.perfects[_(this.players).indexOf(p)];
	}

	EP.Match.prototype.getUpdates = function(p) {
		return this.playersUpdates[_(this.players).indexOf(p)];
	}

	EP.Match.prototype.play = function() {

			var raceTo = Math.ceil(this.bestOf / 2);
			// 1 game of 1 pocket is equivalent to a race to 2 of another game
			if (this.game === '1 pocket' || this.game === 'one pocket') { raceTo += 1; }

			// Save players states before match
			var playersBefore = _(this.players).map(function(p) {return p.clone()});
			
			// Update ratings

			var newRatings = EP.Rating.ratingUpdates(this.winner.rating, this.loser.rating, raceTo);
			this.winner.rating = newRatings.winner;
			this.loser.rating = newRatings.loser;

			// Update belt ownership
			var isBeltChallenge = (this.winner.hasBelt || this.loser.hasBelt || _(EP.Players.list()).findWhere({'hasBelt': true}) === undefined) && raceTo > 1;
			if (isBeltChallenge) {
				this.loser.hasBelt = false;
				this.winner.hasBelt = true;
			}

			// Update other stats
			_(this.players).each(function(p,i) {
				var points = p.rating - playersBefore[i].rating;
				
				p.matches++;
				p.won += p === this.winner ? 1 : 0;
				p.lost += p === this.loser ? 1 : 0;
				p.perfects += this.perfects[i];
				p.opponents = _.union(p.opponents, [this.players[1-i].username]);
				p.streak = p === this.winner ? p.streak + 1 : 0; 
				
				if (isBeltChallenge) { p.beltPossession = p.hasBelt ? ( p.beltPossession === null ? 0 : p.beltPossession + 1 ) : null;  }
				
				var numMatchesInWeek = p.weekMatches().length;
				if (p.matches - numMatchesInWeek >= 10) {
					p.weekPoints = numMatchesInWeek === 1 ? points : p.weekPoints + points;
				} else {
					p.weekPoints = 0;
				}
				
				p.games = _.union(p.games, [this.game]);

			}, this);

			// Update ranking
			EP.Players.updateRanking();

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

				row: row,

				winner : $cells.eq(2).text(),
				loser : $cells.eq(4).text(),
				date: new Date($cells.eq(0).find("time").attr("datetime")),
				game: $cells.eq(1).text().split(' - ')[0],
				bestOf: parseInt($cells.eq(1).text().split(' - ')[1].match(/\d+/)[0])

			};

			data.players = [data.winner, data.loser];

			data.playersUpdates = _([$cells.eq(3), $cells.eq(5)]).map(function ($e) {
				var text = $e.text();
				var perfectsMatch = text.match(/\+(\d+)\sperfect/i);
				var ratingMatch = text.match(/([\+\-]\d+)\spts/i);
				var rankMatch = text.match(/([\+\-]\d+)\splace/i);
				var levelMatch = text.match(/\+Level\:?\s([\w ]*\w)/i);
				var beltMatch = text.match(/([\+\-])belt/i);
				return {
					perfects: perfectsMatch ? parseInt(perfectsMatch[1]) : 0,
					rating: ratingMatch ? parseInt(ratingMatch[1]) : 0,
					rank: rankMatch ? parseInt(rankMatch[1]) : null,
					level: levelMatch ? levelMatch[1] : null,
					belt: beltMatch ? parseInt(beltMatch[1] + '1') : 0,
					achievements: EP.Helpers.getTip($e)
				}
			});

			data.perfects = [data.playersUpdates[0].perfects, data.playersUpdates[1].perfects];

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

	EP.Matches.set = function(newList) {
		matches = newList;
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
		EP.Data.update(function () {

			EP.Players.readData();
			EP.Matches.readData();

			var match = new EP.Match(matchData);
			matches.unshift(match);
			match.play();

			EP.Players.writeData();
			EP.Matches.writeData();
			EP.Data.saveAndReload({title: "Your match has been recorded!"});

		});
	}

	EP.Matches.playAll = function() {
		matches.reverse();
		_(matches).each(function (m) { m.play(); });
		matches.reverse();		
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
			row: null,
			username: 'foo', 					// Required
			stageName: 'bar',					// Required  
			email: 'no-reply@emakina.com',
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
			level: 'Novice',
			invitations: [],
			opponents: [],
			streak: 0,
			beltPossession: null,
			weekPoints: 0,
			//inTopSince: null,
			games: [],
			notifications: []
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
			rank: this.rank !== null && p.rank !== null ? -(this.rank - p.rank) || null : null,
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

			var regexMatch = $cells.eq(0).text().match(/(.*) \((.*)\)/i);
			var nameParts = EP.Helpers.parseName(regexMatch[1]);
			var username = regexMatch[2];

			var data = {

				row: row,

				username: username,
				stageName: $cells.eq(1).text(),
				firstName: nameParts.firstName,
				lastName: nameParts.lastName,

				hasBelt: $cells.eq(0).text().search(/belt\sowner/i) !== -1,

				matches: parseInt($cells.eq(2).text()),
				won: parseInt($cells.eq(3).text()),
				lost: parseInt($cells.eq(4).text()),
				perfects: parseInt($cells.eq(8).text()) || 0,
				rating: parseInt($cells.eq(5).text()),
				rank: parseInt($cells.eq(6).text()) || null,

				achievements: EP.Helpers.getTip($cells.eq(7).find('p').eq(1)),
				level: $cells.eq(7).find('p').eq(0).text(),

				invitations: EP.Helpers.getTip($cells.eq(9)),
				opponents: EP.Helpers.getTip($cells.eq(10)),
				streak: parseInt($cells.eq(11).text()) || 0,
				beltPossession: parseInt($cells.eq(12).text()),
				weekPoints : parseInt($cells.eq(13).text()) || 0,
				// inTopSince: inTopSinceString ? EP.Helpers.dateFromString(inTopSinceString, 'ISO') : null,
				games: EP.Helpers.getTip($cells.eq(14)),

				notifications: _(EP.Helpers.getTip($cells.eq(15))).map(function (n) {
					n = n.split(':');
					return { type: n[0], value: n[1] }
				})
			}

			if (isNaN(data.beltPossession)) { data.beltPossession = null; }

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

	EP.Players.set = function(newList) {
		players = newList;
	}

	EP.Players.list = function(sortAttribute) {

		return sortAttribute == null ? players : _(players).sortBy(sortAttribute);
	}

	EP.Players.updateRanking = function() {
		_(players).each(function(p) {p.rank = null});
		_.chain(players)
			.filter(function(p) {return p.matches >= EP.Settings.matchesRequired})
			.sortBy('rating')
			.reverse()
			.each(function(p, i) { p.rank = i + 1; });
	}

	EP.Players.add = function (playerData) {
		EP.Data.update(function () {

			EP.Players.readData();

			var player = new EP.Player(playerData);
			players.unshift(player);
			EP.Players.updateRanking();
			players = _(players).sortBy('firstName');

			EP.Players.writeData();

			var message = EP.CurrentUser.username === player.username ? "You are now registered, welcome onboard!" : "Player has been registered!";
			EP.Data.saveAndReload(message);
		
		})
	}

	EP.Players.removeNotifications = function (username, callback) {
		EP.Data.update(function () {

			var backup = players;
			
			EP.Players.readData();
			var player = EP.Players.get(username);
			player.notifications = [];
			EP.Players.writeData();
			EP.Data.save(callback);

			players = backup;
		
		})
	}

	EP.Players.verify = function() {
		console.log('Starting data verification...');

		var result = true;

		// Backup players and matches
		var playersNow = EP.Players.list();
		var matchesNow = EP.Matches.list();

		// Reset players
		var resetPlayers = _(playersNow).map(function(p) {
			return new EP.Player({
				username: p.username,
				stageName: p.stageName
			})
		});
		EP.Players.set(resetPlayers);

		// Reset matches
		var resetMatches = _(matchesNow).map(function(m) {
			return new EP.Match({
				players: [m.players[0].username, m.players[1].username],
				winner: m.winner.username, 
				loser: m.loser.username,
				perfects: [m.perfects[0], m.perfects[1]],
				date: m.date,
				game: m.game,
				bestOf : m.bestOf
			});
		});
		EP.Matches.set(resetMatches);

		// Replay all matches
		EP.Matches.playAll();


		// Compare matches
		var matchPropertiesToOmit = ['level'];

		matchesNow.reverse();
		_(matchesNow).each(function(mNow, i) {

			var mCheck = (EP.Matches.list())[matchesNow.length - i - 1];

			var mUpdtNow =   _(mNow.playersUpdates  ).map(function (m) { return _(m).omit(matchPropertiesToOmit) });
			var mUpdtCheck = _(mCheck.playersUpdates).map(function (m) { return _(m).omit(matchPropertiesToOmit) });

			if (_(mUpdtNow).isEqual(mUpdtCheck)) {
			
				console.log('Match ' + i + ' is ok.');
			
			} else {

				result = false;
				console.warn('Match ' + i + ' (' + mNow.date.toDateString() +  ') is corrupted!');
				console.warn('Is:      ', mUpdtNow);
				console.warn('Expected: ', mUpdtCheck);
			
			}
		});
		matchesNow.reverse();


		// Compare players
		var propertiesToOmit = [
			'clone', 'compare', 'invitations', 'fullName', 'weekMatches',
			'row', 'isRegistered', 'weekPoints',
			'email', 'firstName', 'lastName', 'notifications', 'picture', 'avatarUrl',
			'achievements', 'level'
		];

		_(playersNow).each(function(p) {
			
			var pNow = _(p).omit(propertiesToOmit);
			var pCheck = _(EP.Players.get(p.username)).omit(propertiesToOmit);

			if (_(pNow).isEqual(pCheck)) {

				console.log('Player ' + p.username + ' is ok.');

			} else {

				result = false;
				console.warn('Player ' + p.username + ' is corrupted!');
				console.warn('Is:      ', pNow);
				console.warn('Expected: ', pCheck);

			}
		})

		// Restore
		EP.Players.set(playersNow);
		EP.Matches.set(matchesNow);

		console.log('Data verification finished.');

		return result;
	}

	EP.Players.readView();

	// Load players data from REST service, then fire the onready event.

	EP.Players.onready = $.Callbacks('memory');

	var count = 0;

	_(players).each(function (p) {

		EP.Confluence.getUser(p.username, function(data) {

			p.avatarUrl = data.avatarUrl;
			p.email = data.displayableEmail || null;

			count++;
			if (count === players.length) { EP.Players.onready.fire(); }

		});
	})


}

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
		$registerButton: $('#register-button'),
		$playButton: $('#play-button'),
		$cancelPlayButton: $('#cancel-play-button'),
		$inviteButton: $('#invite-button'),

		$joinButton: $('#subscribe-button'),

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


EP.InviteDialog


*/

var EP = EP || {};

// $('body').append(JST.inviteDialog({}));
// EP.inviteDialog = AJS.dialog2('#invite-dialog');

EP.InviteDialog = function() {

	EP.InviteDialog = {};

	// Create dialog from template
	
	var html = JST.inviteDialog({});
	$('body').append(html);
	Confluence.Binder.autocompleteUserOrGroup('#invite-dialog'); 
	var dialog = AJS.dialog2('#invite-dialog');
	EP.InviteDialog.dialog = dialog;
		
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers

	EP.Dom.$inviteButton.click(function() {dialog.show();});

	// Validation rules

	function setSubmitState() {
	    var cannotSubmit = _.chain(Validations.State).values().contains(false).value();
		$('#invite-send-button').prop('disabled', cannotSubmit);		
	}

	var Validations = {	
	 	mandatoryFields: function() {
	 		Validations.State.mandatoryFields = $('#invite-selected-player').val() !== '';
	 	},
		notAlreadyRegistered: function() {
			
			var player = EP.Players.get($('#invite-selected-player').val());

			Validations.State.notAlreadyRegistered = player === undefined;

			if (Validations.State.notAlreadyRegistered) {
				$('#invite-player-error')
					.css('visibility', 'hidden');
			} else {
				$('#invite-player-error')
					.text('User already registered! (as "' + player.stageName + '")')
					.css('visibility', 'visible');
			}
		},
		emailAvailable: function() {

			Validations.State.emailAvailable = false; // Set to false until proven otherwise

			if (Validations.State.notAlreadyRegistered === false || $('#invite-selected-player').val() === '') { return }

			EP.Confluence.getUser($('#invite-selected-player').val(), function(userData) {

				Validations.State.emailAvailable = userData.displayableEmail !== undefined;

				if (Validations.State.emailAvailable) {
					$('#invite-email').val(userData.displayableEmail);
					$('#invite-player-error').css('visibility', 'hidden');
				} else {
					$('#invite-player-error')
						.text('This user\'s email is not public, we can\'t send an invitation, sorry.')
						.css('visibility', 'visible');
				}
				setSubmitState(); // We have to do it manually because it is an async call

			});
		}
	}

	// Update the submit button state on every validation function
	_(Validations).each(function(func, name) {
		Validations[name] = function() {
	    	func();
	    	setSubmitState();
		}
	})

	Validations.State = {};
	$('#invite-selected-player').on('change', Validations.mandatoryFields);
	$('#invite-selected-player').on('change', Validations.notAlreadyRegistered);
	$('#invite-selected-player').on('change', Validations.emailAvailable);
	dialog.on('show', Validations.mandatoryFields);


	// Dynamics

	var Dynamics = {
		selectUser: function (context, user) {
			$('#invite-player').val(user.content.title);
			$('#invite-selected-player').val(user.content.username).change();
		},
		unselectUser: function() {
			if ($('#invite-selected-player').val() !== '') {
				$('#invite-selected-player').val('').change();
			}
		}



	}

	$('#invite-player').on('selected.autocomplete-user', Dynamics.selectUser);
	$('#invite-player').on('input propertychange paste', Dynamics.unselectUser);


	// Cancel
	
	$('#invite-cancel-button').click( function() { dialog.hide() });


	// Submit

	$('#invite-send-button').click( function() {

		EP.Confluence.freezeDialog();

		var invitee = $('#invite-player').val();
		var inviteeEmail = $('#invite-email').val();
		var inviteeUsername = $('#invite-selected-player').val();
		var to = invitee + ' <' + inviteeEmail + '>';

		var data = {
			invitee: EP.Helpers.parseName(invitee).firstName,
			referer: EP.CurrentUser,
			message: $('#invite-message').val(),
			url: AJS.Confluence.getBaseUrl() + EP.Settings.pagePath,
			banner: EP.Banners.get()
		}

		EP.Mail.send(to, 'invitation', data, function() {
			
			// Update player profile upon success
			EP.Data.update(function () {			
				EP.Players.readData();
				var currentUser = EP.Players.get(EP.CurrentUser.username);
				currentUser.invitations = _(currentUser.invitations).union([inviteeUsername]);
				EP.Achievements.evaluate(currentUser);
				EP.Players.writeData();
				EP.Data.saveAndReload({title: 'Invitation sent!', body:'Thanks for spreading the word :)'});
			});

		})
		
	});

};

/*

EP.MatchesTable

*/

var EP = EP || {};

EP.MatchesTable = function() {

	EP.MatchesTable = {}

	// Disable sorting

	$(window).load(function () {
		EP.Dom.$matches.removeClass('tablesorter');
		EP.Dom.$matches.find('th').unbind();
	});

	// Filters

	var expandCollapseLabels = {
		collapse: function() {return 'Show less';}, 
		expand: function(n) {return 'Show all (' + n + ')';}
	}
	
	function applyFilters() {

		var $allRows = EP.Dom.$matches.find('tr:has(td)');
		var rows = $allRows.toArray(); // Rows to be displayed at the end

		// Player filter

		var selectedUser = $('#matches-filter').val();
		if (selectedUser && selectedUser !== '') {

			rows = _.chain(EP.Matches.list())
				.filter(function(m) {
					return m.winner.username === selectedUser || m.loser.username === selectedUser
				})
				.pluck('row')
				.value();

		}

		// Expand collapse
		
		if (rows.length < EP.Settings.matchesRows) { 
			$('#matches-more-button').hide(); 
		} else {
			$('#matches-more-button').show();			
		}
		
		if ( EP.Dom.$matches.hasClass('expanded') ) {
			$('#matches-more-button').text(expandCollapseLabels.collapse());
		} else {
			$('#matches-more-button').text(expandCollapseLabels.expand(rows.length));
			rows = rows.slice(0, EP.Settings.matchesRows);
		}

		// Show/hide rows

		$allRows.hide();
		_(rows).each(function(r) {$(r).show()});

	}

	EP.Dom.$matches.after('<p><a href="#" id="matches-more-button"></a></p>');

	var htmlSelect = JST.playersSelect({
		players: EP.Players.list(),
		firstOption: 'All matches',
		id: 'matches-filter',
		size: 'xxl'
	});
	EP.Dom.$matches.before('<p>' + htmlSelect + '</p>');
	if (EP.CurrentUser.isRegistered) {
		$('#matches-filter').find('option').eq(0).after('<option value="' + EP.CurrentUser.username + '">My matches</option>');
	}

	$('#matches-filter').change(function() {
		EP.Dom.$matches.removeClass('expanded');
		applyFilters();
		return false;
	});

	$('#matches-more-button').click(function() {
		EP.Dom.$matches.toggleClass('expanded');
		applyFilters();
		return false;
	});

	applyFilters();


	EP.Players.onready.add(function() {

		// Display avatars and names

		_(EP.Matches.list()).each(function (m) {

			var avatars = [JST.playerAvatar(m.winner), JST.playerAvatar(m.loser)];
			var stageNames = [m.winner.stageName, m.loser.stageName];
			var $cells = $(m.row).find('td');

			_([$cells.eq(2), $cells.eq(4)]).each(function ($cell, i) {
				$cell.html(avatars[i] + stageNames[i]);
			})

		})

		// Enable tooltips
		$('.matches-table span[title]').tooltip();

	});




}
/*

EP.Notifications

*/

var EP = EP || {};

EP.Notifications = function() {

	EP.Notifications = {};

	var achievements = _(EP.CurrentUser.notifications).where({type: 'achievement'});
	
	if (achievements.length > 0) {

		var data = {
			achievements: _.chain(achievements).pluck('value').map(EP.Achievements.get).value(),
			currentLevel: EP.CurrentUser.level,
			nextLevel: EP.Achievements.nextLevel(EP.CurrentUser)
		}

		$('body').append(JST.achievementNotification(data));

		var dialog = AJS.dialog2('#achievement-notification');

		$('#achievement-close-button').click(function() {
			dialog.hide();
			EP.Players.removeNotifications(EP.CurrentUser.username);
		});

		// Let's delay the notification for a better user experience
		window.setTimeout(function() { dialog.show(); }, 2000);

	}

}
/*

EP.Page

Gloabl page enhancement such as:
  * More sections and buttons
  * Tabs
  * Tooltips

*/

var EP = EP || {};

EP.Page = function() {


	// DISABLE EDITION -------------------------------

	$('#editPageLink').show();

	if (!_.chain(EP.Settings.admins).pluck('username').contains(EP.CurrentUser.username).value()) {

		// disable keyboard shortcut ("e")
		window.document.onkeydown = function (e) { return e.which !== 69 };
		
		// add warning dialog when edit button is clicked
		$('body').append(JST.editInfoDialog(EP.Settings.admins[0]));
		
		var editInfoDialog = AJS.dialog2('#edit-info-dialog');
		$('#editPageLink').click(function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			editInfoDialog.show();
		});

		$('#edit-info-ok-button').click(function() { editInfoDialog.hide()})

		// Remove admin sub-pages
		$('#rw_pagetree_item_' + EP.Settings.badgesPageId).remove();
		$('#rw_pagetree_item_' + EP.Settings.scriptsPageId).remove();

	}

	// MESSAGING DIV -----------------------------

	// Add messaging div
	$('#rw_page_toolbar').before('<div id="aui-message-bar"></div>');

	// Display confirmation message if query string parameter set
	var confirmation = EP.Helpers.getQueryStringParam('confirmation');
	if (confirmation) {
		AJS.messages.success(JSON.parse(confirmation));
		history.replaceState(null, null, location.href.split("?")[0]);
	}


	// ADDITIONAL SECTIONS AND TOOLBAR ------------------------

	EP.Dom.NavLinks.$gallery.show();
	EP.Dom.Sections.$gallery.show();
	EP.Dom.$toolbar.show();

	if (EP.CurrentUser.isRegistered) {
		EP.Dom.$registerButton.hide();
		EP.Dom.NavLinks.$profile.show();
		EP.Dom.Sections.$profile.show();
	} else {
		EP.Dom.$submitMatchButton.hide();
		EP.Dom.$playButton.hide();
		EP.Dom.$cancelPlayButton.hide();
		EP.Dom.$inviteButton.hide();
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


	var visibleTabs = _.chain(EP.Dom.NavLinks)
		.keys()
		.filter(function(k) { 
			return EP.Dom.NavLinks[k].css('display') !== 'none' }
		)
		.value();
	
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

EP.PlayDialog

*/


var EP = EP || {};

EP.PlayDialogs = function() {

	// Only available to registered players
	if (EP.CurrentUser.isRegistered === false) { return; }

	/* 
	---------------------------------------------------------------------------------------------------
	Toolbar 
	---------------------------------------------------------------------------------------------------
	*/

	function setToolbar(isAvailable, hasJustBeenHookedUp) {
		if (isAvailable) {
			EP.Dom.$submitMatchButton.hide();
			EP.Dom.$playButton.hide();
			EP.Dom.$cancelPlayButton.show();
		} else {
			EP.Dom.$submitMatchButton.show();
			EP.Dom.$playButton.show();
			EP.Dom.$cancelPlayButton.hide();
		}
		if(hasJustBeenHookedUp) {
			EP.Dom.$playButton.hide();
		}
	}

	setToolbar(false);


	/* 
	---------------------------------------------------------------------------------------------------
	Manage properties
	---------------------------------------------------------------------------------------------------
	*/

	// availablePlayer
	EP.Properties.get('availablePlayer', {
		found: function(property) {
			var propertyDate = new Date(property.version.when);
			if (EP.Helpers.today() > propertyDate) {
				// We remove the property if it is expired (not from today)
				EP.Properties.delete('availablePlayer');
				setToolbar(false);
				checkResponse();
			} else {
				// The user has a pending request!
				if (property.value.username === EP.CurrentUser.username) {
					setToolbar(true);
					waitForResponse();
				} else {
					setToolbar(false);					
					checkResponse();
				}
			}
		},
		notFound: function () {
			setToolbar(false);
			checkResponse();
		}
	});

	// gameResponseFor_<username>
	function checkResponse(successCallback) {
		EP.Properties.get('gameResponseFor_' + EP.CurrentUser.username, {
			found: function(property) {
				if (new Date() <= new Date(property.version.when).addMinutes(30)) {
					// The user has a match!
					showHookedUpPopup(property.value);
					setToolbar(false, true);
				}
				EP.Properties.delete('gameResponseFor_' + EP.CurrentUser.username);
				setToolbar(false, true);
				if (successCallback) { successCallback(); }
			},
			notFound: function() {}
		});
	}

	function waitForResponse() {
		var timer = window.setInterval(function() {
			checkResponse(function() {
				window.clearInterval(timer)
			});
		}, 5000);
	}


	function propertyData(player) {
		return {
			username:  player.username,
			firstName: player.firstName,
			lastName:  player.lastName,
			stageName: player.stageName,
			email:     player.email
		}
	}

	/* 
	---------------------------------------------------------------------------------------------------
	Hooked-up popup	
	---------------------------------------------------------------------------------------------------
	*/
	 
	function showHookedUpPopup(data) {
		$('#hooked-up-popup').remove();
		$('body').append(JST.hookedUpPopup(data));
		AJS.dialog2("#hooked-up-popup").show();
	}

	// AJS.messages.success({
	// 	title: data.value.stageName + ' is available',
	// 	body: '<p>Have a nice game! (Details have been sent by email)</p>',
	// 	delay: 15000,
	// 	closeable: true
	// })



	/* 
	---------------------------------------------------------------------------------------------------
	Game request dialog
	---------------------------------------------------------------------------------------------------
	*/
 
	// Create dialog from template
	
	$('body').append(JST.playDialog({}));
	var dialog = AJS.dialog2("#play-dialog");
	dialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers

	EP.Dom.$playButton.click(function() {dialog.show();});

	// Cancel action
	$('#play-cancel-button').click( function() { dialog.hide() });

	// Submit action
	$('#play-submit-button').click( function() {

		EP.Confluence.freezeDialog();

		EP.Data.getLock(function() {

			EP.Properties.get('availablePlayer', {
				
				found: function(propAvailPlayer) {
					
					// We've got someone, no need to wait!

					var bannerUser = EP.Banners.getWithQuote({
						recipient: EP.CurrentUser,
						opponent: propAvailPlayer.value
					});
					var bannerOpponent = EP.Banners.getWithQuote({
						recipient: propAvailPlayer.value,
						opponent: EP.CurrentUser
					});

					var templateDataUser = _(propertyData(EP.CurrentUser)).extend({banner: bannerUser});
					var templateDataOpponent = _(propAvailPlayer.value).extend({banner: bannerOpponent});

					EP.Mail.send(EP.CurrentUser, 'hookedup', templateDataOpponent, function() {
						EP.Mail.send(new EP.Player(propAvailPlayer.value), 'hookedup', templateDataUser, function() {
							EP.Properties.delete('availablePlayer', function() {
								EP.Data.releaseLock(function() {
									EP.Properties.set('gameResponseFor_' + propAvailPlayer.value.username, propertyData(EP.CurrentUser));
									dialog.hide();
									setToolbar(true);
									window.setTimeout(function() {
										showHookedUpPopup(templateDataOpponent);
										setToolbar(false, true);
									}, 1000)
								})
							})
						})
					});
				},
				
				notFound: function() {

					// Nobody's available, but let's poll to notify in real time shall somone becomes available

					EP.Properties.set('availablePlayer', propertyData(EP.CurrentUser), function() {
						EP.Data.releaseLock(function() {
							AJS.messages.success({
								title: 'Game request submitted',
								body: '<p>Don\'t forget to cancel shall you become unavailable...</p>'
							});
							setToolbar(true);
							waitForResponse();
						})
					});					
				}
			}) 
		});
	});


	/* 
	---------------------------------------------------------------------------------------------------
	Cancel request dialog
	---------------------------------------------------------------------------------------------------
	*/
 
	// Create dialog from template
	$('body').append(JST.cancelPlayDialog());
	var cancelDialog = AJS.dialog2("#cancel-play-dialog");
	cancelDialog.on('show', function (e) {EP.Helpers.resetDialog(e.target);});

	// Triggers
	EP.Dom.$cancelPlayButton.click(function() {cancelDialog.show();});

	// Cancel action
	$('#cancel-play-cancel-button').click( function() { cancelDialog.hide() });

	// Submit action
	$('#cancel-play-ok-button').click( function() {

		EP.Confluence.freezeDialog();

		EP.Properties.get('availablePlayer', {
			found: function (data) {
				if (data.value.username === EP.CurrentUser.username) {
					EP.Properties.delete('availablePlayer', function() {
						AJS.messages.success({title: 'Game request cancelled', body: 'Thanks for letting us know.'});
						setToolbar(false);
					});
				} else {
					AJS.messages.generic({title: 'You don\'t have any pending request'});
					setToolbar(false);
				}
			},
			notFound: function () {
				AJS.messages.generic({title: 'You don\'t have any pending request'});
				setToolbar(false);
			}
		});
	});

};

/*

EP.PlayersTable

*/

var EP = EP || {};

EP.PlayersTable = function() {

	EP.PlayersTable = {}

	// Remove usernames

	EP.Dom.$players.find('td:first-child').each(function () {
		var newHtml = $(this).html().replace(/ \(.*\)/,'');
		$(this).html(newHtml);
	})

	EP.Players.onready.add(function() {
	
		// Display players avatars
		_(EP.Players.list()).each(function (p) {
			var htmlAvatar = JST.playerAvatar(p);
			$(p.row).find('td').eq(0).prepend(htmlAvatar);
		})
	
		// Enable tooltips
		$('.players-table span[title]').tooltip();

	});

}
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
		summary : EP.CurrentUser.level.toUpperCase() + ' &nbsp;-&nbsp; ' + (EP.CurrentUser.rank ? 'Ranked #' + EP.CurrentUser.rank : 'Not ranked')
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

	EP.Dom.$joinButton.click(function() {dialog.show();});
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
			$('#player-save-button').prop('disabled', cannotSubmit);
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

		EP.Confluence.freezeDialog();

		EP.Players.add( {
			username: EP.CurrentUser.username,
			firstName: EP.CurrentUser.firstName,
			lastName: EP.CurrentUser.lastName,
			stageName: $.trim($('#player-stage-name').val())
		});
		
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
			$('#match-save-button').prop('disabled', cannotSubmit);
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

			// Reset options
			_(maximums).each(function(max, i) {
				var selected = parseInt($perfects.eq(i).find('option:selected').attr('value'));
				var html = _(_.range(max + 1)).map(function(j) {return '<option value="' + j + '">' + j + '</option>'}).join();
				$perfects.eq(i).html(html);
				$perfects.eq(i).find('option').eq(selected).attr('selected','selected');
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

		EP.Confluence.freezeDialog();

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

	});

	// Glossary link
	$('#match-glossary-link').click( function() {
		dialog.hide();
		EP.Dom.NavLinks.$faq.click();
		return false;
	});

	// Invite link
	// $('#match-invite-link').click( function() {
	// 	dialog.hide();
	// 	EP.InviteDialog.dialog.show();
	// 	return false;
	// });

};

/* 
---------------------------------------------------------------------------------------------------

EP.VerifyDataResults

---------------------------------------------------------------------------------------------------
*/
 

var EP = EP || {};

EP.VerifyDataResults = function() {

	$('#verify-data-button').hide();

	// Only for admins
	if (_.chain(EP.Settings.admins).pluck('username').contains(EP.CurrentUser.username).value()) {
		
		$('#verify-data-button').show();

		$('#verify-data-button').click(function() {

			if (EP.Players.verify()) {
				window.alert('Verification succesful. Everything is correct.');
			} else {
				window.alert('Verification failed. Check console for details...');
			}

		});

	}

}
/*

EP.Settings

Common settings used by other modules

Important:

	There should be 1 file per environment.
	This is the settings for the TEST environment.
	This file must not be committed because it contains sentistive information.

*/

var EP = EP || {};

EP.Settings = {

	// Environement ('dev', 'test' or 'prod'), influence the publication
	environment: 'test',

	// Openshift server credentials.
	serverAuthUsername: 'emakinapoolapp',
	serverAuthPassword: 'no1shallbeTrusted',

	// Value of 'from' field when sending emails
	emailFrom: 'Emakina Pool Test <info@league.emakinapool.xyz>',

	// Force email recipient. If set, all emails are sent to this address. A must have in test environement!
	forceEmailTo: 'Tester <rwa@emakina.com>',

	// To use incombination with forceEmailTo. If set, only emails using the specified templates are forced.
	// forceEmailTemplates: ['invitation'],

	// Confluence Page that holds all the league data.
	// ATTENTION: DO NOT USE THE PRODUCTION PAGE IN TEST or your tests will mess up the official players ratings.  
	pageId: '102662893',
	pagePath: '/display/activities/Pool+League',

	// Resource pages
	badgesPageId: '102665363',
	scriptsPageId: '104693790',

	// Elo config
	kFactor: 32,
	initialRating: 1500,

	// If set to true, the k factor is multiplied when matches involve multiple games
	biggerKFactorForLongerMatches: true,

	// Number of matches required before being officially ranked
	matchesRequired: 10,

	// Number of row initially shown in matches table
	matchesRows: 10,

	// Wether to allow loser to encode a match
	allowLoserToEncode: false,

	// List of admin users with advanced priviledges
	// * can edit the page
	// * recieve errors by email
	// * the first admin is the contact for edit request
	admins: [{
		username: 'rwa',
		email: 'r.p.walker@gmail.com',
		name: 'Richard Walker'
	}],

	// Send error notifications by email to the admins.
	sendErrors : true,

}

try {
	module.exports = EP.Settings;
}
catch(e) {
	console.log('Module loaded ouside nodejs');
}

/*

Entry point

*/


var EP = EP || {};

$(function () {
	
	// Global stuff
	EP.Helpers();
	EP.Rating();
	EP.Confluence();
	EP.Dom();
	EP.Mail();
	
	// Models
	EP.Data();
	EP.Properties();
	EP.Banners();
	EP.Player();
	EP.Match();
	EP.Achievements();
	EP.Players();
	EP.Matches();
	EP.CurrentUser();

	// Views
	EP.Page();
	EP.ProfileSection();
	EP.PlayersTable();
	EP.MatchesTable();
	EP.VerifyDataResults();

	// Dialogs
	EP.RegisterDialog();
	EP.SubmitMatchDialog();
	EP.PlayDialogs();
	EP.InviteDialog();

	// Notifs
	EP.Notifications();

});
