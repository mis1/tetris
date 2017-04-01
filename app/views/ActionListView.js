import ActionView from './ActionView';

export default class ActionListView{
	constructor(controller){
		const actionsConfig=[
			{
				id: 'start', selector:'#action-start', onClick: ()=> controller.startGame()
			},
			{
				id: 'pause', selector:'#action-pause', onClick: ()=>controller.pauseGame(), labels:['Pause', 'Resume']
			},
			{
				id: 'stop',selector:'#action-stop', onClick: ()=> controller.stopGame()
			},
		];
		this._actions={};
		for(let i=0; i<actionsConfig.length;i++){
			const config = actionsConfig[i];
			this._actions[config.id]=new ActionView(config.selector, config.onClick, config.labels);
		}
	}
	enableAction(id, enableFlag){
		this._actions[id].enable(enableFlag);
	}
	toggleActionLabel(id){
		this._actions[id].toggleLabel();
	}
	resetActionLabel(id){
		this._actions[id].resetLabel();
	}
}