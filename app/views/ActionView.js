import $ from '../libs/jquery';

export default class ActionView{
	constructor(selector, onClick, labels){
		this._$elem = $(selector);
		this._enabled = true;
		this._disabledClassName = 'action--disabled';
		this._$elem.click(()=>{
			if (this._enabled){
				onClick();
			}
			return false;
		});
		this._labels = labels;
		this._selLabelIndex = 0;
	}
	enable(enableFlag){
		this._enabled = enableFlag;
		if (enableFlag){
			this._$elem.removeClass(this._disabledClassName);
		}
		else{
			this._$elem.addClass(this._disabledClassName);
		}
	}
	toggleLabel(){
		if (!this._labels) return;
		this._setLabel((this._selLabelIndex + 1) % this._labels.length);
	}
	resetLabel(){
		if (!this._labels) return;
		this._setLabel(0);
	}
	_setLabel(index){
		this._selLabelIndex= index;
		this._$elem.text(this._labels[index]);
	}
}