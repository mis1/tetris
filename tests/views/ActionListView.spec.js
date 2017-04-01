jest.mock('../../app/views/ActionView', );
jest.mock('../../app/controllers/Controller');

import ActionListView from '../../app/views/ActionListView';
import ActionView from '../../app/views/ActionView';
import Controller from '../../app/controllers/Controller';

describe('ActionListView', () => {
	let obj;
	beforeEach(()=>{
		/*$('body').html(
			`<button id="action-start">click</button>
			<button id="action-pause">click</button>
			<button id="action">click</button>`
		);*/
		ActionView.mockClear();
		obj = new ActionListView(new Controller);
	});

	it('should be initialized', () => {
		expect(ActionView).toBeCalledWith('#action-start', expect.any(Function), undefined);
		expect(ActionView).toBeCalledWith('#action-pause', expect.any(Function), expect.any(Array));
		expect(ActionView).toBeCalledWith('#action-stop', expect.any(Function), undefined);
		expect(ActionView.mock.instances.length).toBe(3);
	});

	it('should en/dis-able action', () => {
		let mockFn = ActionView.mock.instances[0].enable;
		obj.enableAction('start', true);
		expect(mockFn.mock.calls).toEqual([[true]]);

		let mockFn2 = ActionView.mock.instances[2].enable;
		obj.enableAction('stop', false);
		expect(mockFn2.mock.calls).toEqual([[false]]);
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	it('should toggle label of action', () => {
		let mockFn = ActionView.mock.instances[0].toggleLabel;
		obj.toggleActionLabel('start');
		expect(mockFn).toHaveBeenCalledTimes(1);
		
	});
});