export default class Timer{
	constructor(interval, callback){
		this._interval = interval;
		this._callback = callback;
		this._isRunning = false;
	}
	start(){
		if (this._isRunning) return;
		this._isRunning = true;
		const fn = () => {
			this._timerId = setTimeout(()=>{
				if (!this._isRunning) return;
				this._callback();
				fn();	
			}, this._interval);
		};
		fn();
	}
	stop(){
		this._isRunning = false;
		clearTimeout(this._timerId);
	}
}