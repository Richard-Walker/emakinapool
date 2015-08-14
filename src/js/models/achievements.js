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


