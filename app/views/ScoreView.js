import $ from '../libs/jquery';

export default class ScoreView{
	constructor(){
		this._$elem = $('#score');
	}
	render(score){
		this._$elem.text(score);
	}
};
