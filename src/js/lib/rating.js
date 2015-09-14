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