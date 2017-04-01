import {Direction, MoveResult} from '../common/constants.js';
import Board from './Board';

export default class Shape{
	constructor(id, symbols, config, board){
		this._id = id;
		this._config = config;
		this._board = board;
		this._symbols = symbols;
		//this._calcNextCells = [];
		const entryCell = board.entryCell;
		this._pos = {
			x: entryCell[0],
			y: entryCell[1]
		};
		this._cellIndexes = [];
		for(let i=0; i<this._config.cells.length; i++)
			this._cellIndexes.push(i);
	}
	move(direction){
		if (this._canMove(direction)){
			const cells = this._calcNextCells(direction);
			this._board.markCells(cells, this._symbols);
			if (!this._canMove(Direction.DOWN)){
				this._board.markCells(cells, this._symbols, true);
				return MoveResult.FREEZE;
			}
			return MoveResult.YES;
		}
		return MoveResult.NO;
	}
	get position(){
		return Object.assign({},this._pos);
	}
	set position(pos){
		Object.assign(this._pos, pos);	
	}
	get id(){
		return this._id;
	}
	_canMove(direction){
		const cells = this._calcNextSideCells(direction);
		return this._board.areCellsEmpty(cells);
	}
	_calcCells(x, y){
		const retCells=[];
		const cells = this._config.cells;
		for(let i=0;i<cells.length; i++){
			retCells.push([cells[i][0]+x, cells[i][1]+y]);
		}
		return retCells;
	}
	_calcNextSideCells(direction){
		const sideCells=[];
		let side, x=0, y=0;
		switch(direction){
			case Direction.DOWN:
				side = this._config.bottom;
				x=1;
				break;
			case Direction.LEFT:
				side = this._config.left;
				y=-1;
				break;
			case Direction.RIGHT:
				side = this._config.right;
				y=1
				break;
			case Direction.UP: //special case to check whehter rototation is possible
				side = this._cellIndexes;
				break;	
			default:
				throw(new Error('Shape::_calcNextSideCells - invalid direction'))			
		}
		const pos = this._pos;
		const cells = this._config.cells;
		for(let i=0; i<side.length; i++){
			const index = side[i];
			const cell = cells[index];
			sideCells.push([cell[0]+x+pos.x, cell[1]+y+pos.y]);
		}
		return sideCells;
	}
	_calcNextCells(direction){
		const pos = this._pos;
		switch(direction){
			case Direction.DOWN:
				pos.x++;
				break;
			case Direction.LEFT:
				pos.y--;
				break;
			case Direction.RIGHT:
				pos.y++;
				break;
			case Direction.UP:
				break;		
			default:
				throw(new Error('Shape::_calcNextCells - invalid direction'))			
		}
		const nextCells = this._calcCells(pos.x, pos.y);
		return nextCells;
	}
}