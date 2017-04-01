import $ from './libs/jquery';
import Controller from './controllers/Controller';
import Model from './models/Model';


$(()=>{
	const model = new Model();
	new Controller(model);
});