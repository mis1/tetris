jest.enableAutomock();
jest.unmock('../../app/controllers/Controller');
jest.unmock('../../app/common/constants');
import Controller from '../../app/controllers/Controller';
import View from '../../app/views/View';
import Model from '../../app/models/Model';
import {GameStatus} from '../../app/common/constants';

describe('Controller', () => {
	let obj, model, cbStatus;
	beforeEach(() => {
		View.mockClear();
		model = new Model();
		obj = new Controller(model);
		View.mock.instances[0].enableAction.mockClear();
		cbStatus = model.subscribe4Status.mock.calls[0][0];
	});
	const assertEnableActionCalls = (start, pause, stop) => {
		const calls = View.mock.instances[0].enableAction.mock.calls;
		expect(calls).toEqual([['start', start], ['pause', pause], ['stop', stop]]);
	};
	const assertToggleActionLabelCall = (id) => {
		const calls = View.mock.instances[0].toggleActionLabel.mock.calls;
		expect(calls).toEqual([[id]]);
	};
	const assertResetActionLabelCall = (id) => {
		const calls = View.mock.instances[0].resetActionLabel.mock.calls;
		expect(calls).toEqual([[id]]);
	};
	const assertResetBoardCall = (id) => {
		const calls = View.mock.instances[0].resetBoard.mock.calls;
		expect(calls).toEqual([[]]);
	};

	it('should be initialized', () => {
		View.mockClear();
		obj = new Controller(model);
		expect(View.mock.calls).toEqual([[obj, model]]);
		expect(model.subscribe4Status).toBeCalledWith(expect.any(Function));
		assertEnableActionCalls(true, false, false);
	});
	
	it('should start game', () => {
		obj.startGame();
		assertEnableActionCalls(false, true, true);
		expect(model.start.mock.calls).toEqual([[]]);
		assertResetBoardCall();
	});

	it('should stop game', () => {
		obj.stopGame();
		assertEnableActionCalls(true, false, false);
		expect(model.stop.mock.calls).toEqual([[]]);
		assertResetActionLabelCall('pause');
	});

	it('should pause game', () => {
		obj.pauseGame();
		assertEnableActionCalls(false, true, true);
		expect(model.pause.mock.calls).toEqual([[]]);
		assertToggleActionLabelCall('pause');
	});

	it('should finish game', () => {
		cbStatus(GameStatus.FINISHED);
		assertEnableActionCalls(true, false, false);
	});
	it('should handle key', () => {
		const key = 'abc';
		obj.handleInputKey(key);
		expect(model.handleInputKey.mock.calls).toEqual([[key]]);	
	});
});