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


