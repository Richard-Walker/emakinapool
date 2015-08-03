/*

EP.Helpers

Helpers

*/

var EP = EP || {};

EP.Helpers = function() {

	EP.Helpers = {};

	EP.Helpers.TooltipFormater = {
		decodeToHtml: function(url) {
			var match = url.match(/tooltip\(([^)]*)\)/);
			var html = match[1];
			html = html.replace(/\+/g, ' ');
			html = html.replace(/\;/g, '<br> ');
			return html;
		},
		decodeToArray: function(url) {
			var match = url.match(/tooltip\(([^)]*)\)/);
			var content = match[1];
			content = content.replace(/\+/g, ' ');
			return content.split(';');
		},
	};

	EP.Helpers.leafs = function($e) {
		return $e('*').filter( function() {
      		var isLeaf = $(this).children().length === 0;
      		return isLeaf;
   		});
	};

	EP.Helpers.expandVariables = function(string, variables) {
		
		var expandedString = string;
		_.each(variables, function (value, name) {
			var re = new RegExp('\\$' + name, 'gm');
			expandedString = expandedString.replace(re, value);
		});

		return expandedString;
	
	};

	EP.Helpers.resetDialog = function(dialog) {
		var $e = $(dialog);
		$e.find("select option").removeAttr('selected');
		$e.find("select option:first-child").attr('selected','selected');
		$e.find("input[type=radio]").prop("checked", false);
	};

	EP.Helpers.filterSelect = function($select, filter) {
		var $current = $select.find('option:selected');
		$select.find('option').hide();
		$select.find('option').filter(filter).show();

		if ($current.filter(filter).length === 0) {
			$current.removeAttr('selected');
			$select.find("option:first-child").attr('selected','selected');
		}
	};

};
