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
				looser : $cells.eq(4).text(),
				date: new Date($cells.eq(0).find("time").attr("datetime")),
				game: $cells.eq(1).text().split(' - ')[0],
				bestOf: parseInt($cells.eq(1).text().split(' - ')[1].match(/\d+/)[0])

			};

			data.players = [data.winner, data.looser];


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
		EP.Data.update(function () {

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