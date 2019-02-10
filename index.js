$(document).ready(function(){
	class Sokoban {
		constructor() {
			this.levels = [];
			this.currentLvl = -1;
			//Load levels
			for(let i = 0; i < levels.levels.length; i++) {
				this.levels.push(new Level(levels.levels[i], this));
			}
			//Key
			let self = this;
			window.addEventListener('keydown', function(event) {
				if(self.currentLvl != -1) {
					switch (event.keyCode) {
						case 90: //HAUT
							self.levels[self.currentLvl-1].move('z');
							break;
						case 83: //BAS
							self.levels[self.currentLvl-1].move('s');
							break;
						case 81: //GAUCHE
							self.levels[self.currentLvl-1].move('q');
							break;
						case 68: //DROITE
							self.levels[self.currentLvl-1].move('d');
							break;
					}
				}
			}, false);
		}
	}
	class Level {
		constructor(level, sokoban) {
			this.sokoban = sokoban;

			this.id = level.id;
			this.height = level.height;
			this.width = level.width;
			this.nbCrate = level.total_balls;
			this.nbCompletedCrate;
			this.px = 0;
			this.py = 0;

			this.struct = [];
			for(let i = 0; i < level.cells.length; i++) {
				this.struct.push([]);
				for(let j = 0; j < level.cells[i].length; j++) {
					this.struct[i].push({'cell' : level.cells[i][j], 'obj' : '', 'end' : false});
				}
			}

			let self = this;
	  		let btn = $("<input type='button' value=" + this.id + ">").click(function () {self.show(); self.sokoban.currentLvl = self.id; console.log(self.id)});
	  		btn.appendTo('#boutons');
	  	}
		show() {
			this.nbCompletedCrate = 0;
			let tab = $("<div />");
			for (let i = 0; i < this.struct.length; i++) {
				let ligne = $('<div />');
				for (let j = 0; j < this.struct[i].length; j++) {
					let cell = this.struct[i][j]['cell'];
					let css = {};
					switch (cell) {
						case ' ':
							css = {'background-color' : 'white'};
							break;
						case '$':
							css = {'background-image' : 'url(img/crate.png)'};
							break;
						case '*':
							css = {'background-image' : 'url(img/crate_red.png)'};
							this.nbCompletedCrate++;
							this.struct[i][j]['end'] = true;
							break;
						case '#':
							css = {'background-image' : 'url(img/mur.png)'};
							break;
						case '.':
							css = {'background-image' : 'url(img/end.png)'};
							this.struct[i][j]['end'] = true;
							break;
						case '@':
							css = {'background-image' : 'url(img/player_bottom.png)'};
							this.px = i;
							this.py = j;
							break;
						case '>':
							css = {'background-image' : 'url(img/player_right.png)'};
							this.px = i;
							this.py = j;
							break;
						case '<':
							css = {'background-image' : 'url(img/player_left.png)'};
							this.px = i;
							this.py = j;
							break;
						case '^':
							css = {'background-image' : 'url(img/player_top.png)'};
							this.px = i;
							this.py = j;
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
					this.struct[i][j]['obj'] = col;
				}
				ligne.appendTo(tab);
			}
			$('#level').empty();
			$('#level').append(tab);
			if(this.nbCrate <= this.nbCompletedCrate)
				alert("GG!");
		}
		move(direction)
		{
			let newPlayer;
			let newpx; let newpy; let newpxx; let newpyy;
			switch(direction) {
				case 'z':
					newpx = this.px-1;
					newpy = this.py;
					newpxx = this.px-2;
					newpyy = this.py;
					newPlayer = '^';
					break;
				case 's':
					newpx = this.px+1;
					newpy = this.py;
					newpxx = this.px+2;
					newpyy = this.py;
					newPlayer = '@';
					break;
				case 'q':
					newpx = this.px;
					newpy = this.py-1;
					newpxx = this.px;
					newpyy = this.py-2;
					newPlayer = '<';
					break;
				case 'd':
					newpx = this.px;
					newpy = this.py+1;
					newpxx = this.px;
					newpyy = this.py+2;
					newPlayer = '>';
					break;
			}
			let canGo = true;
			switch(this.struct[newpx][newpy]['cell']) { //Desired cell
				case ' ': //Nothing
					break;
				case '$': //Crate
					if(this.struct[newpxx][newpyy]['cell'] == '#' || this.struct[newpxx][newpyy]['cell'] == '$' || this.struct[newpxx][newpyy]['cell'] == '*')
						canGo = false;
					else
						if(this.struct[newpxx][newpyy]['end'])
							this.struct[newpxx][newpyy]['cell'] = '*';
						else
							this.struct[newpxx][newpyy]['cell'] = '$';
					break;
				case '*': //Red crate
					if(this.struct[newpxx][newpyy]['cell'] == '#' || this.struct[newpxx][newpyy]['cell'] == '$' || this.struct[newpxx][newpyy]['cell'] == '*')
						canGo = false;
					else
						if(this.struct[newpxx][newpyy]['end'])
							this.struct[newpxx][newpyy]['cell'] = '*';
						else
							this.struct[newpxx][newpyy]['cell'] = '$';
					break;
				case '#': //Wall
					canGo = false;
					break;
				case '.': //End point
					break;
			}
			if(canGo)
			{
				this.struct[newpx][newpy]['cell'] = newPlayer;
				if(this.struct[this.px][this.py]['end']) //Si on était sur un end point.
					this.struct[this.px][this.py]['cell'] = '.';
				else
					this.struct[this.px][this.py]['cell'] = ' ';
			}
			else
			{
				this.struct[this.px][this.py]['cell'] = newPlayer;
			}
			
			this.show();
		}
	};

	let sokoban = new Sokoban();
});