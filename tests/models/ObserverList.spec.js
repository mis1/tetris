import ObserverList from '../../app/models/ObserverList';

describe('ObserverList', () => {
	let obj, cb, cb2;
	const data='dample', data2={id:34, d:[1,23]};
	beforeEach(() => {
		cb=jest.fn();
		cb2 = jest.fn();
		obj = new ObserverList;
	});

	it('should subscribe', () => {
		obj.subscribe(cb, data);
		expect(cb).toHaveBeenCalledTimes(1);
		expect(cb).toBeCalledWith(data);

		obj.subscribe(cb2, data);
		expect(cb2).toHaveBeenCalledTimes(1);
		expect(cb2).toBeCalledWith(data);

		obj.notify(data2);
		expect(cb).lastCalledWith(data2);
		expect(cb2).lastCalledWith(data2);
	});

	it('should unsubscribe', () => {
		const unsubscribeFn = obj.subscribe(cb, data);
		expect(unsubscribeFn).toEqual(expect.any(Function));
		const cb2 = jest.fn();
		obj.subscribe(cb2, data);
		cb.mockClear();
		unsubscribeFn();

		obj.notify(data2);
		expect(cb2).lastCalledWith(data2);
		expect(cb).not.toBeCalled();
	});
});