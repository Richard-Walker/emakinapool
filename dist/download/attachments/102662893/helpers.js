/*

Helpers

*/

var EP = EP || {};

EP.Helpers = {

	TooltipFormater : {
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
	},

	leafs: function($e) {
		return $e('*').filter( function(index) {
      		var isLeaf = $(this).children().length === 0;
      		return isLeaf;
   		});
	},

	expandVariables: function(string, variables) {
		
		var expandedString = string;
		_.each(variables, function (value, name) {
			var re = new RegExp('\\$' + name, 'gm');
			expandedString = expandedString.replace(re, value);
		});

		return expandedString;
	
	},

	resetForm: function($form) {
		$form.find("select option").removeAttr('selected');
		$form.find("select option:first-child").attr('selected','selected');
		$form.find("input[type=radio]").prop("checked", false);
	}


}