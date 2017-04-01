import ScoreView from '../../app/views/ScoreView';
import $ from '../../app/libs/jquery';

describe('ScoreView', () => {
	let obj;
	beforeEach(()=>{
		$('body').html('<div id="score"/>');
		obj = new ScoreView();
	});

	it('should render score', () => {
		obj.render(20);
		expect($('#score').text()).toBe('20');		
	});	
});