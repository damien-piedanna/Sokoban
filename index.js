$(document).ready(function(){

	class Level {
		constructor(design, nom) {
			this.design = design;
			this.nom = nom;
			this.level = [];
	  	}
		create() {
			let tab = $("<div />");
			let px = 0;
			let py = 0;
			for (let i = 0; i<this.design.length; i++) {
				let ligne = $('<div />');
				this.level.push([]);
				for (let j = 0; j<this.design[i].length; j++) {

					let cell = this.design[i][j];
					let css = {};
					switch (cell) {
						case ' ':
							css = {'background-color' : 'white'};
							break;
						case '$':
							css = {'background-image' : 'url(img/ball.png)'};
							break;
						case '*':
							css = {'background-image' : 'url(img/ball_red.png)'};
							break;
						case '@':
							css = {'background-image' : 'url(img/player.png)'};
							px = i;
							py = j;
							break;
						case '#':
							css = {'background-image' : 'url(img/mur.png)'};
							break;
						case '.':
							css = {'background-image' : 'url(img/end.png)'};
							break;
					}
					cell = '&nbsp;';
					let col = $('<div />').css({
						'display'	: 'inline-block',
						'padding'	: '0',
						'margin'	: '0',
						'width'		: '40px',
						'height'	: '40px',
						'text-align': 'center'
					}).append(cell).css(css);
					ligne.append(col);
					this.level[i].push({'ct' : this.design[i][j], 'obj' : col});
				}
				ligne.appendTo(tab);
			}
			console.log(this.level);
			$('#currentTab').empty();
			$('#currentTab').append(tab);
		}
		createBouton() {
			let self = this;	
	  		let btn = $("<input type='button' value=" + this.nom + ">").click(function () {self.create()});
	  		btn.appendTo('#boutons');
	  	}
	};

	for(l in levels.levels) {
		let mytab = new Level(levels.levels[l].cells, levels.levels[l].id)
		mytab.createBouton();
	}

});