import View from '../views/View';
import {GameStatus, InputKey} from '../common/constants';

export default class Controller{
	constructor(model){
		this._model = model;
		this._view = new View(this, model);
		this._model.subscribe4Status((status)=>{
			if (GameStatus.FINISHED === status){
				this._finishGame();
			}
		});
		this._enableActions(true, false, false);
	}
	startGame(){
		this._model.start();
		this._enableActions(false, true, true);
		this._view.resetBoard();
	}
	pauseGame(){
		this._model.pause();
		this._view.toggleActionLabel('pause');
		this._enableActions(false, true, true);	
	}
	stopGame(){
		this._model.stop();
		this._enableActions(true, false, false);
		this._view.resetActionLabel('pause');
	}
	handleInputKey(key){
		this._model.handleInputKey(key);
	}
	_finishGame(){
		this._enableActions(true, false, false);	
	}
	_enableActions(start, pause, stop){
		if (start!==undefined)
			this._view.enableAction('start', start);
		if (pause!==undefined)
			this._view.enableAction('pause', pause);
		if (stop!==undefined)
			this._view.enableAction('stop', stop);
	}
};