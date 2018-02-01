import $ from '../libs/jquery';
import {clearSymbol} from '../common/constants';
import {colors, clearColor, cellSize, maxBoardBorderWidth, maxBoardWidth, maxBoardHeight} from './viewConfig';

export default class BoardView{
	constructor(controller){
		//this.$elem=$('#board');
		this._symbol2Color = {};
		this.reset();
		
		const $canvas = $("#canvas");
		this._ctx = $canvas[0].getContext("2d");
		this._calculateSize();
		this._setSize($canvas);
		controller.resizeBoard(this._rows, this._cols);
	}
	render(board){        
		//let str='';
		const ctx = this._ctx;
		const width = this._width;
		const height = this._height;
		const size = cellSize;

		ctx.fillStyle=clearColor;
		ctx.fillRect(0, 0, width, height);

		for(var i=0; i<board.length; i++){
			for(var j=0; j<board[0].length; j++){
				if (board[i][j] !== clearSymbol){
					//str += board[i][j];
					
					ctx.fillStyle=this._getColor(board[i][j]);
					ctx.fillRect(j*size, i*size, size, size);
					ctx.strokeStyle="#000";
					ctx.strokeRect(j*size , i*size, size, size);
                	
				}
				else{
				//	str+= '_';
				}
				//str +='<br>';
			}
		}
		//this.$elem.html(str);
	}
	reset(){
		this._colorIndex = Math.floor(Math.random() * colors.length);
	}
	_getColor(symbol){
		if (this._symbol2Color[symbol])
			return this._symbol2Color[symbol];
		this._colorIndex = (this._colorIndex + 1) % colors.length;
		return this._symbol2Color[symbol] = colors[this._colorIndex];
	}
	_calculateSize(){
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		const width = windowWidth < maxBoardWidth? windowWidth: maxBoardWidth;
		const height = (windowHeight < maxBoardHeight? windowHeight: maxBoardHeight) - $('header')[0].offsetHeight;

		this._cols = Math.floor(width/cellSize);
		this._rows = Math.floor(height/cellSize);

		this._width = this._cols * cellSize;
		this._height = this._rows * cellSize;

		const xBorderWidth = width - this._width;
		const yBorderWidth = height - this._height;
		this._xBorderWidth = xBorderWidth < maxBoardBorderWidth ? xBorderWidth : maxBoardBorderWidth;
		this._yBorderWidth = yBorderWidth < maxBoardBorderWidth ? yBorderWidth : maxBoardBorderWidth;
	}
	_setSize($canvas){
		$canvas.attr('width', this._width);
		$canvas.attr('height', this._height);
		const $board = $('#board');
		$board[0].style.width = this._width + 'px';
		$board[0].style.height = this._height + 'px';
		$board[0].style.borderWidth = `${Math.floor(this._yBorderWidth/2)}px ${Math.floor(this._xBorderWidth/2)}px`;  
		const $header = $('header');
		$header[0].style.width = this._width + this._xBorderWidth + 'px';
	}
};
