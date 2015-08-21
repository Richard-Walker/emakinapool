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
					return m.winner.username === selectedUser || m.looser.username === selectedUser
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

			var avatars = [JST.playerAvatar(m.winner), JST.playerAvatar(m.looser)];
			var stageNames = [m.winner.stageName, m.looser.stageName];
			var $cells = $(m.row).find('td');

			_([$cells.eq(2), $cells.eq(4)]).each(function ($cell, i) {
				$cell.html(avatars[i] + stageNames[i]);
			})

		})

		// Enable tooltips
		$('.matches-table span[title]').tooltip();

	});




}