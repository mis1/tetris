import $ from '../libs/jquery';
import ActionListView from './ActionListView';
import BoardView from './BoardView';
import ScoreView from './ScoreView';
import {InputKey} from '../common/constants';
import Controller from '../controllers/Controller';

export default class View{
	constructor(controller, model){
		this._actionListView = new ActionListView(controller);
		this._boardView = new BoardView();
		this._scoreView = new ScoreView();
		model.subscribe4Board((board) => this._boardView.render(board));
		model.subscribe4Score((score) => this._scoreView.render(score));
		this._bindKeyDownHandler(controller);
	}
	enableAction(id, enableFlag){
		this._actionListView.enableAction(id, enableFlag);
	}

	toggleActionLabel(id){
		this._actionListView.toggleActionLabel(id);	
	}
	resetActionLabel(id){
		this._actionListView.resetActionLabel(id);	
	}
	resetBoard(){
		this._boardView.reset();
	}
	_bindKeyDownHandler(controller){
		$(document).keydown(e=>{
			switch(e.which) {
		        case 37: // left
		        	controller.handleInputKey(InputKey.LEFT);
		        	break;
		        case 38: // up
		        	controller.handleInputKey(InputKey.UP);
			        break;
		        case 39: // right
		        	controller.handleInputKey(InputKey.RIGHT);
			        break;
		        case 40: // down
			        controller.handleInputKey(InputKey.DOWN);
			        break;
		        default: return; // exit this handler for other keys
		    }
		    e.preventDefault(); // prevent the default action (scroll / move caret)
		});
	}
}