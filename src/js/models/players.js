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

				row: row,

				username: nameMatch[3],
				stageName: $cells.eq(1).text(),
				firstName: nameMatch[1],
				lastName: nameMatch[2],

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
		EP.Players.get(EP.Settings.initialBeltOwner).hasBelt = true;

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
