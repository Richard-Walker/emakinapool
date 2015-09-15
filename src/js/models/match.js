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
			var isBeltChallenge = (this.winner.hasBelt || this.loser.hasBelt) && raceTo > 1;
			if (this.loser.hasBelt && isBeltChallenge) {
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
				if (isBeltChallenge) { p.beltPossession = !p.hasBelt ? null : ( p.beltPossession === null ? 0 : p.beltPossession + 1 );  }
				p.weekPoints = p.weekMatches().length === 0 ? points : p.weekPoints + points;
				// p.inTopSince = p.rank > 5 ? null : ( p.inTopSince ?  p.inTopSince : EP.Helpers.today() );
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
