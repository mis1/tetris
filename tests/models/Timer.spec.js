import Timer from '../../app/models/Timer';

describe('Timer', () => {
	let obj, cb;
	const interval = 100;

	beforeEach(() => {
		jest.useFakeTimers();
		cb = jest.fn();
		obj = new Timer(interval, cb);
	});

	it('should start timer', () => {
		obj.start();
		expect(cb).not.toBeCalled();
		expect(setTimeout.mock.calls).toEqual([[expect.any(Function), interval]]);

		jest.runTimersToTime(interval);
		
		expect(setTimeout.mock.calls.length).toBe(2);
    	expect(cb.mock.calls.length).toBe(1);

    	jest.runTimersToTime(interval*5);
    	expect(setTimeout.mock.calls.length).toBe(7);
    	expect(cb.mock.calls.length).toBe(6);
		
	});

	it('should stop timer', () => {
		obj.start();
		obj.stop();
		jest.runTimersToTime(interval);
		expect(clearTimeout.mock.calls.length).toBe(1);
		expect(cb).not.toBeCalled();

		obj.start();
		jest.runTimersToTime(interval);
		obj.stop();
		jest.runTimersToTime(interval+100);
		expect(cb.mock.calls.length).toBe(1);
	});

	it('should start do nothing if timer is already started', () => {
		obj.start();
		obj.start();
		expect(setTimeout.mock.calls.length).toBe(1);
		jest.runTimersToTime(interval);
		expect(cb.mock.calls.length).toBe(1);
	});
});