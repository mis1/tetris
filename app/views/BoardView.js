import $ from '../libs/jquery';
import {clearSymbol} from '../common/constants';
import {colors, clearColor, cellSize, boardBorderWidth} from './viewConfig';

export default class BoardView{
	constructor(){
		this.$elem=$('#board');
		this._symbol2Color = {};
		this.reset();
	}
	render(board){
		var myCanvas = document.getElementById("myCanvas");
        var ctx = myCanvas.getContext("2d");
		//let str='';
		const rows = board.length;
		const cols = board[0].length;
		const width = cols * cellSize + 2 * boardBorderWidth;
		const height = rows * cellSize;
		const size = cellSize;
			
		ctx.fillStyle=clearColor;
		ctx.fillRect(0, 0, width, height);
		ctx.strokeStyle="#000";
		ctx.strokeRect(0, 0, width, height);

		for(var i=0; i<board.length; i++){
			for(var j=0; j<board[0].length; j++){
				if (board[i][j] !== clearSymbol){
					//str += board[i][j];
					
					ctx.fillStyle=this._getColor(board[i][j]);
					ctx.fillRect(j*size + boardBorderWidth, i*size, size, size);
					ctx.strokeStyle="#000";
					ctx.strokeRect(j*size + boardBorderWidth, i*size, size, size);
                	
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
};
