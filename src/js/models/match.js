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
