/**
 * Exports ObserverList class.
 *
 * @module ObserverList
 */

/**
 * Helper class to implement observer pattern. 
 * This class is used by the Subject to manage subscription of and notification to observers.
 */
class ObserverList{
	constructor(){
		this._subscribers = [];
	}

	/**
	 * Subscribes an observer and notifies it.
	 * @param  {module:ObserverList~observerCallback} cb - callback function to invoke to notify the observer.
	 * @param  {Any} data - data to pass to observer's cb on subscription.
	 * @return {Function} Observers can use this returned funtion to unsubscribe.
	 */
	subscribe(cb, data){
		this._subscribers.push(cb);
		cb(data);
		const index = this._subscribers.length - 1;
		return ()=>{
			this._subscribers.splice(index,1);
		};
	}
	
	/**
	 * Notifies the observers
	 * @param  {Any} data - data to pass to each observer.
	 */
	notify(data){
		this._subscribers.forEach((cb) => cb(data));
	}
	/**
	* @callback observerCallback
	* @param {any} data
	*/
}
/**
 * @callback module:ObserverList~observerCallback
 * @param {any} data
 */
export default ObserverList;