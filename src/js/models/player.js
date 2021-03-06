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