/**
 * Exports Shape class.
 *
 * @module Shape
 */

import {Direction, MoveResult} from '../common/constants.js';
import Board from './Board';

class Shape{
	/**
	 * Creates a shape. Shape is one orientation of metashape. One metashape has at least one shape.
	 * @param  {String} id - uniquie identification of the shape.
	 * @param  {Array} symbols - each shape shares the symbols of its metashape.
	 * @param {object} config - shape's definition. It is defined as an element of metashape's shape collection.
	 * @param {object} board - instance of [Board]{@link module:Board~Board} class. Shape wrapped in metashape moves on board. 
	 * 
	 * id param format is "METASHAPEID_INDEX" where METASHAPEID is the key of metashape in [metaShapeDefs]{@link module:metaShapeDefs~metaShapeDefs} object and INDEX is the shape's ordinal position in Metashape's shapes collection.
	 * Shape's position is set to [board's entryCell]{@link module:Board~entryCell}
	 */
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

	/**
	 * Moves the shape on board. 
	 * @param  {module:constants~Direction} direction - in which direction to move shape.
	 * @return {module:constants~MoveResult} - whether shape moved, didn't move, freezed.
	 */
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

	/**
	 * Gets the shape's current position on board. Position of shape change after every move.
	 * @return {Object}
	 */
	get position(){
		return Object.assign({},this._pos);
	}

	/**
	 * Sets the postion of the shape.
	 * @param  {[type]} pos [description]
	 * @return {[type]}     [description]
	 */
	set position(pos){
		Object.assign(this._pos, pos);	
	}

	/**
	 * Gets the id of the shape.
	 * @return {String}
	 *
	 */
	get id(){
		return this._id;
	}

	/**
	 * Checks whether shape can move in the input direction
	 * @param  {[type]} direction [description]
	 * @return {Boolean}           [description]
	 */
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
			if (cell[0]+x+pos.x>-1)
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

export default Shape;