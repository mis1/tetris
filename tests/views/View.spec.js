jest.enableAutomock();
jest.unmock('../../app/views/View');
jest.unmock('../../app/libs/jquery');
import View from '../../app/views/View';
import ActionListView from '../../app/views/ActionListView';
import BoardView from '../../app/views/BoardView';
import ScoreView from '../../app/views/ScoreView';
import Model from '../../app/models/Model';
import Controller from '../../app/controllers/Controller';

describe('View', () => {
	let obj, model, controller;
	beforeEach(() => {
		ActionListView.mockClear();
		model = new Model();
		controller = new Controller(model);
		obj = new View(controller, model)
	});
	it('should be initialized', () => {
		expect(ScoreView.mock.calls).toEqual([[]]);
		expect(BoardView.mock.calls).toEqual([[]]);
		expect(ActionListView.mock.calls).toEqual([[controller]]);
		
		expect(model.subscribe4Board).toBeCalledWith(expect.any(Function));
		expect(model.subscribe4Score).toBeCalledWith(expect.any(Function));

	});

	it('should enable action', () => {
		obj.enableAction('start', true);
		const calls = ActionListView.mock.instances[0].enableAction.mock.calls;
		expect(calls).toEqual([['start', true]]);

	});

	it('should toggle label of action', () => {
		let mockFn = ActionListView.mock.instances[0].toggleActionLabel;
		obj.toggleActionLabel('start');
		expect(mockFn).toHaveBeenCalledTimes(1);
	});
});