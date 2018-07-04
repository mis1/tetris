/**
 * Export MetaShape class
 *
 * @module MetaShape
 */
import Shape from './Shape';
import {Direction, MoveResult} from '../common/constants.js';

/**
 * MetaShape class.
 *  
 */
class MetaShape{
	/**
	 * Creates a metashape. Randomly chooses one shape and set it as selected shape.
	 * @param  {String} id - key of metashape in [metaShapeDefs]{@link module:metaShapeDefs~metaShapeDefs} object.
	 * @param  {Array} shapes - List of shapes. Each shape represents one rotation as defined in [metaShapeDefs]{@link module:metaShapeDefs~metaShapeDefs}.
	 *
	 */
	constructor(id, shapes){
		this._id = id;
		this._shapes = shapes;
		this._selShapeIndex = Math.floor(Math.random() * shapes.length);
	}

	/*
	 * Gets the id of currently selected shape.
	 * @return {String}
	 */
	get id(){
		return this._shapes[this._selShapeIndex].id;
	}

	/**
	 * Moves the currently selected shape if direction is let, right or down.
	 * If direction is up, select next shape (i.e rotate the shape)
	 * @param  {String} direction [description]
	 * @return {Boolean}           [description]
	 */
	move(direction){
		if (Direction.UP === direction){
			const index = (this._selShapeIndex + 1) % this._shapes.length;
			const pos = this._shapes[this._selShapeIndex].position;
			this._shapes[index].position = pos;
			const ret = this._shapes[index].move(direction);
			if (MoveResult.YES === ret){
				this._selShapeIndex = index;
			}
			return ret;
		}
		return this._shapes[this._selShapeIndex].move(direction);
	}
}

export default MetaShape;