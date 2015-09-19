/*

EP.Helpers

Helpers

*/

var EP = EP || {};

EP.Helpers = function() {

	EP.Helpers = {}


	/* 
	---------------------------------------------------------------------------------------------------
	
	Misc

	---------------------------------------------------------------------------------------------------
	*/
	 

	EP.Helpers.upperCase = function(s) { return s.toUpperCase() };

	EP.Helpers.parseName = function(fullName) {
		var nameParts = fullName.match(/([^ ]+) (.*[^ ])/i) || [fullName, fullName, ''];
		return { firstName: nameParts[1], lastName: nameParts[2] }
	}

	EP.Helpers.parseEmail = function(email) {
		var emailParts = email.match(/(.*) <(.*)>/i) || [null, null, email];
		return { name: emailParts[1], email: emailParts[2] }
	}

	EP.Helpers.getTip = function($e) {
		var $a = $e.is('a') ? $e : $e.find('a');
		var href = $a.attr('href') || 'tip://list';
		if (href === 'tip://list') { return [] }
		var listStr = href.match(/tip\:\/\/list\?(.*)/i)[1];
		return listStr === '' ? [] : _(listStr.split('++')).map(decodeURIComponent);
	}

	EP.Helpers.encodeURIComponentWithQuotes = function (str) {
		return encodeURIComponent(str).replace(/'/g, "%27");
	}

	EP.Helpers.tipLink = function(list) {
		var listStr = _(list).map(EP.Helpers.encodeURIComponentWithQuotes).join('++');
		return 'tip://list?' + listStr; 
	}

	EP.Helpers.leafs = function($e) {
		return $e('*').filter( function() {
      		var isLeaf = $(this).children().length === 0;
      		return isLeaf;
   		});
	}

	EP.Helpers.expandVariables = function(string, variables) {
		
		var expandedString = string;
		_.each(variables, function (value, name) {
			var re = new RegExp('\\$' + name, 'gm');
			expandedString = expandedString.replace(re, value);
		});

		return expandedString;
	}

	EP.Helpers.resetDialog = function(dialog) {
		var $e = $(dialog);
		$e.find('.error').css('visibility', 'hidden');
		$e.find('input:not([type=hidden])').val('');
		$e.find('textarea').val('');
		$e.find('select option').removeAttr('selected');
		$e.find('select option:first-child').attr('selected','selected');
		$e.find('input[type=radio]').prop('checked', false);
	}

	EP.Helpers.filterSelect = function($select, filter) {
		var $current = $select.find('option:selected');
		$select.find('option').hide();
		$select.find('option').filter(filter).show();

		if ($current.filter(filter).length === 0) {
			$current.removeAttr('selected');
			$select.find("option:first-child").attr('selected','selected');
		}
	}

	EP.Helpers.getQueryStringParam = function(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	/* 
	---------------------------------------------------------------------------------------------------
	
	Date & time

	---------------------------------------------------------------------------------------------------
	*/
	 

	Date.prototype.addHours = function(h) {    
   		this.setTime(this.getTime() + (h*60*60*1000)); 
   		return this;   
	}

	Date.prototype.addMinutes = function(m) {    
   		this.setTime(this.getTime() + (m*60*1000)); 
   		return this;   
	}


	EP.Helpers.today = function() {
		var d = EP.Helpers.formatDate(new Date());
		d = EP.Helpers.dateFromString(d);
		return d;

		// Alternate implementation:
		// var d = new Date();
		// d.setHours(0, 0, 0, 0);
	}

	EP.Helpers.formatDate = function(d, format) {
		format = format || 'FR';

		var yyyy = d.getFullYear(),
			dd = d.getDate().pad(),
			mm = (d.getMonth() + 1).pad()

		return format === 'ISO'  ?  yyyy + '-' + mm + '-' + dd  :  dd + '/' + mm + '/' + yyyy
	}

	EP.Helpers.dateFromString = function(d, format) {
		format = format || 'FR';

		var parts = [];

		if (format === 'ISO') { 
			parts = _(d.split('-')).map(function(n) {return parseInt(n)});
			return new Date(parts[0], parts[1] - 1, parts[2]);
		} else {
			parts = _(d.split('/')).map(function(n) {return parseInt(n)});
			return new Date(parts[2], parts[1] - 1, parts[0]);
		}
	}

	/* 
	---------------------------------------------------------------------------------------------------
	
	STRING extensions

	---------------------------------------------------------------------------------------------------
	*/
	 

	String.prototype.capitalize = function() {
    	return this.replace(/\w\S*/g, function(txt) {
        	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	});
	}

	String.prototype.lowerFirst = function() {
    	return this.charAt(0).toLowerCase() + this.slice(1);
	}

	// This works only if 1st word is the verb
	String.prototype.pastTense = function(pronoun) {

		var irregularities = {
			'win': 'won',
			'lose': 'lost',
			'get': 'got',
			'keep': 'kept',
			'make': 'made' 
		}

    	return pronoun + ' ' + this.replace(/^\w*/, function(verb) {
    		verb = verb.toLowerCase();
    		return irregularities[verb] || verb.replace(/e$/,'') + 'ed';
    	});

	}

	// This works only if 1st word is the verb
	String.prototype.futureTense = function(pronoun) {
    	return this.replace(/^\w*/g, function(verb) {
        	return pronoun + ' will ' + verb.toLowerCase();
    	});
	}

	Date.prototype.daysSince = function(d) {
		return Math.round((this.getTime() - d.getTime()) / (1000 * 3600 * 24));
	}

	/* 
	---------------------------------------------------------------------------------------------------
	
	NUMBER extensions

	---------------------------------------------------------------------------------------------------
	*/
	 

	Number.prototype.ordinal = function() {
   		var s = ["th","st","nd","rd"];
   		var v = this % 100;
   		return this + ( s[(v - 20) % 10] || s[v] || s[0] );
	}

	Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }

};
