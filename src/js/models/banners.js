/* 
---------------------------------------------------------------------------------------------------

EP.Banners

---------------------------------------------------------------------------------------------------
*/

EP = EP || {}

var EP = EP || {};

EP.Banners = function() {

	EP.Banners = {};

	var banners = [
		{
			image: 'barak.jpg',
			players: [{
				name: 'Barak',
				quotes: ["If you're walking down the right path and you're willing to keep walking, eventually you'll make progress."],
				quoteName: 'Barak Obama'
			}]
		}, 
		{
			image: 'brad.jpg',
			players: [{
				name: 'Brad',
				quotes: ["If you want to look cool <%=recipient.firstName%>, remember to play it cool."],
				quoteName: 'Brad Pitt'
			}]
		}, {
			image: 'cat.jpg',
			players: [{
				name: 'The cat',
				quotes: ["Sometimes the predator has to hide from its pray."],
				quoteName: 'A clever cat'
			}]
		}, {
			image: 'clint.jpg',
			players: [{
				name: 'Clint',
				quotes: ["You see, in this world there's two kinds of people, my friend: Those with loaded guns and those who dig. On which side of the gun are you <%=recipient.stageName%>?"],
				quoteName: 'Clint Eastwood as Blondie'
			}]
		}, {
			image: 'elvis-marilyn-james.jpg',
			players: [{
				name: 'Elvis',
				quotes: ["Well it's one for the money, two for the show, three to get ready, now go cat go!"],
				quoteName: 'Elvis Presley'
			}, {
				name: 'Marilyn',
				quotes: ["Fear is stupid. So are regrets. Don't be stupid <%=recipient.firstName%>."],
				quoteName: 'Marilyn Monroe'
			}, {
				name: 'James Dean',
				quotes: ["The gratification comes in playing, not in winning."],
				quoteName: 'James Dean'
			}]
		}, {
			image: 'god.jpg',
			players: [{
				name: 'God',
				quotes: ["May the pool gods be on your side <%=recipient.stageName%>..."],
				quoteName: '',
			}]
		}, {
			image: 'jack.jpg',
			players: [{
				name: 'Jack',
				quotes: ["When I play pool I like a drink, a Martini."],
				quoteName: 'James Bond'
			}]
		}, {
			image: 'jackie.jpg',
			players: [{
				name: 'Jackie',
				quotes: ["Anyone can be a Superman, but nobody can be <%=recipient.stageName%>."],
				quoteName: 'Jackie Chan'
			}]
		}, {
			image: 'john.jpg',
			players: [{
				name: 'Don Draper'
			}]
		}, {
			image: 'johnny-dep.jpg',
			players: [{
				name: 'Johnny',
				quotes: ["I slept on the pool table and made a dream. You were winning in my dream <%=recipient.firstName%>."],
				quoteName: 'Johnny Depp'
			}]
		}, {
			image: 'johnny-halliday.jpg',
			players: [{
				name: 'Johnny',
				quotes: ["Ce match, <%=recipient.firstName%>, c'est l'occasion de remettre les pendules à leur place."],
				quoteName: 'Johnny Halliday'
			}]
		}, {
			image: 'justin.jpg',
			players: [{
				name: 'Justin',
				quotes: ["<%=recipient.firstName%>, I want your game to be fun."],
				quoteName: 'Justin Bieber'
			}]
		}, {
			image: 'marlon.jpg',
			players: [{
				name: 'Marlon Brando',
			}]
		}, {
			image: 'michael-jackson.jpg',
			players: [{
				name: 'Michael',
				quotes: ["Pool is easier than the moonwalk."],
				quoteName: 'Michael Jackson'
			}]
		}, {
			image: 'michael-jordan.jpg',
			players: [{
				name: 'Michael Jordan',
				quotes: ["Be confident <%=recipient.stageName%>, kill this <%=opponent.stageName%> son of a ****!"],
				quoteName: 'Michael Jordan'
			}]
		}, {
			image: 'spok-kirk.jpg',
			players: [{
				name: 'Spock',
				quotes: ["<%=recipient.stageName%>, I see no reason to stand here and be insulted."],
				quoteName: "Spock"
			},{
				name: 'Captain Kirk',
				quotes: ["Conquest is easy. Control of the white ball is not."],
				quoteName: "Capitain Kirk"
			}]
		}, {
			image: 'batman-robin.jpg',
			players: [{
				name: 'Batman',
				quotes: ["I'm Batman, he's Robin, you're <%=recipient.stageName%>, we are super heros. <%=opponent.stageName%> is the super villain."],
				quoteName: 'Bruce Wayne'
			}, {
				name: 'Robin',
				quotes: ["He's Batman, I'm Robin, you're <%=recipient.stageName%>, we are super heros. <%=opponent.stageName%> is the super villain."],
				quoteName: 'Robin'
			}]
		}, {
			image: 'tom-paul.jpg',
			players: [{
				name: 'Tom Cruise'
			}, {
				name: 'Paul Newman',
				quotes: ["You gotta have two things to win. You gotta have brains and you gotta have balls. Now <%=recipient.firstName%>, you got too much of one and not enough of the other."],
				quoteName: 'Paul Newman as Eddie Felson'
			}]
		}, {
			image: 'troopers.jpg',
			players: [{
				name: 'The troopers',
				quotes: ["It's fun on the dark side, come and join the party!"],
				quoteName: 'A starship trooper'
			}]
		}
	]

	var meta = {
		females: ['Marilyn'],
		plurals: ['The troopers']
	}

	EP.Banners.get = function() {
		var banner = _(banners).sample();
		var player = _(banner.players).sample();
		
		return {
			file: {
				path: './img/' + banner.image,
				cid: banner.image.split('.')[0]
			},
			player: {
				name: player.name,
				female: _(meta.females).contains(player.name),
				plural: _(meta.plurals).contains(player.name)
			}
		}
	}

	EP.Banners.getWithQuote = function(templateData) {
		
		var banner = _(banners).sample();
		var player = _(banner.players).sample();
		while (!player.quotes || player.quotes.length === 0) {
			banner = _(banners).sample();
			player = _(banner.players).sample();
		}

		var quote = _.template(_(player.quotes).sample());

		return {
			file: {
				path: './img/' + banner.image,
				cid: banner.image.split('.')[0]
			},
			quote: quote(templateData),
			quoteName: player.quoteName
		}
	}

}