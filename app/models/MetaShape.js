import Shape from './Shape';
import {Direction, MoveResult} from '../common/constants.js';

export default class MetaShape{
	constructor(id, shapes){
		this._id = id;
		this._shapes = shapes;
		this._selShapeIndex = Math.floor(Math.random() * shapes.length);
	}
	get id(){
		return this._shapes[this._selShapeIndex].id;
	}
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