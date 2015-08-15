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
