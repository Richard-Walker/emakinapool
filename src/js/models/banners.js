/* 
---------------------------------------------------------------------------------------------------

EP.Banners

---------------------------------------------------------------------------------------------------
*/

EP = EP || {}

var EP = EP || {};

EP.Banners = function() {

	EP.Banners = {};

	var banners = [{
			image: 'barak.jpg',
			players: ['Barak']
		}, {
			image: 'brad.jpg',
			players: ['Brad']
		}, {
			image: 'cat.jpg',
			players: ['The cat']
		}, {
			image: 'clint.jpg',
			players: ['Clint']
		}, {
			image: 'elvis-marilyn-james.jpg',
			players: ['Elvis', 'Marilyn', 'James Dean']
		}, {
			image: 'god.jpg',
			players: ['God']
		}, {
			image: 'jack.jpg',
			players: ['Jack']
		}, {
			image: 'jackie.jpg',
			players: ['Jackie']
		}, {
			image: 'john.jpg',
			players: ['John']
		}, {
			image: 'johnny-dep.jpg',
			players: ['Johnny']
		}, {
			image: 'johnny-halliday.jpg',
			players: ['Johnny']
		}, {
			image: 'justin.jpg',
			players: ['Justin']
		}, {
			image: 'marlon.jpg',
			players: ['Marlon']
		}, {
			image: 'michael-jackson.jpg',
			players: ['Michael']
		}, {
			image: 'michael-jordan.jpg',
			players: ['Michael Jordan']
		}, {
			image: 'nicolas-sean.jpg',
			players: ['Nicolas', 'Sean']
		}, {
			image: 'spok-kirk.jpg',
			players: ['Spok', 'Capitain Kirk']
		}, {
			image: 'tom-paul.jpg',
			players: ['Tom Cruise', 'Paul Newman']
		}, {
			image: 'troopers.jpg',
			players: ['The troopers']
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
				name: player,
				female: _(meta.females).contains(player),
				plural: _(meta.plurals).contains(player)
			}
		}
	}


}