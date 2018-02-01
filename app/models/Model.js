import Board from './Board';
import Timer from './Timer';
import MetaShape from './MetaShape';
import metaShapeDefs from './metaShapeDefs';
import ShapeFactory from './ShapeFactory';
import RandomMetaShapeFactory from './RandomMetaShapeFactory';
import ObserverList from './ObserverList';
import {GameStatus, Direction, InputKey, inputkey2Direction, clearSymbol, MoveResult} from '../common/constants';

const fps = 3;
const rows = 15;
const cols = 10;
const scorePerTick = 1;
const scorePerCompletion = 100;

export {fps, rows, cols, scorePerTick, scorePerCompletion};

export default class Model{
	constructor(){
		this._observerListScore = new ObserverList();
		this._observerListStatus = new ObserverList();
		this._score = 0;
		this._status = GameStatus.READY;
		this._timer = new Timer(1000/fps, ()=>this._run(Direction.DOWN, true));
		this._board = new Board(rows, cols, clearSymbol);
		const shapeFactory = new ShapeFactory(this._board);
		this._metaShapeFactory = new RandomMetaShapeFactory(metaShapeDefs, shapeFactory);
		this._metaShape = this._createMetaShape();
		this._allowedInputKeys = [InputKey.UP, InputKey.LEFT, InputKey.RIGHT, InputKey.DOWN	];
		this._board.subscribe4Cleaning((nRows)=>this._addScore(nRows * scorePerCompletion));
	}

	subscribe4Board(cb){
		return this._board.subscribe(cb)	;
	}

	subscribe4Score(cb){
		return this._observerListScore.subscribe(cb, this._score);
	}

	subscribe4Status(cb){
		return this._observerListStatus.subscribe(cb, this._status);
	}

	start(){
		if (GameStatus.STARTED === this._status) return false;
		if (GameStatus.PAUSED !== this._status){
			this._board.reset();
			this._setScore(0);
			this._metaShape = this._createMetaShape();
		}
		this._timer.start();		
		this._setStatus(GameStatus.STARTED);
	}

	pause(){
		if (GameStatus.PAUSED === this._status) return this.start();
		if (GameStatus.STARTED !== this._status) return false;
		this._timer.stop();
		this._setStatus(GameStatus.PAUSED);
	}

	stop(){
		if (GameStatus.STARTED !== this._status && GameStatus.PAUSED !== this._status) return false;
		this._timer.stop();
		this._setStatus(GameStatus.STOPPED);
		
	}
	handleInputKey(inputKey){
		let found = false;
		for(let i=0; i<this._allowedInputKeys.length; i++){
			found |= this._allowedInputKeys[i] === inputKey;
		}
		if (!found) return false;
		const direction = inputkey2Direction[inputKey];
		return this._run(direction);
	}
	resizeBoard(rows, cols){
		this._board.resize(rows,cols);
	}
	_finish(){
		if (GameStatus.STARTED !== this._status) return false;
		this._timer.stop();
		this._setStatus(GameStatus.FINISHED);
	}

	_setStatus(status){
		this._status = status;
		this._notifyStatus();
	}
	_addScore(score){
		this._score += score;
		this._notifyScore();	
	}
	_setScore(score){
		this._score = score;
		this._notifyScore();	
	}
	_notifyScore(){
		this._observerListScore.notify(this._score);
	}

	_notifyStatus(){
		this._observerListStatus.notify(this._status);
	}
	_createMetaShape(){
		return this._metaShapeFactory.createMetaShape();
	}
	_run(direction, addScore = false){
		if (GameStatus.STARTED !== this._status) return;
		if (addScore)
			this._addScore(scorePerTick);

		let ret = this._metaShape.move(direction);
		while(MoveResult.FREEZE === ret){
			direction = Direction.DOWN;
			this._metaShape = this._createMetaShape();
			ret = this._metaShape.move(direction);
		}
		if (MoveResult.NO === ret && Direction.DOWN === direction){
			this._finish();
		}
		return ret;
	}
}