export default class ObserverList{
	constructor(){
		this._subscribers = [];
	}
	subscribe(cb, data){
		this._subscribers.push(cb);
		cb(data);
		const index = this._subscribers.length - 1;
		return ()=>{
			this._subscribers.splice(index,1);
		};
	}
	notify(data){
		this._subscribers.forEach((cb) => cb(data));
	}
}