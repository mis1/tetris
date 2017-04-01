import ActionView from '../../app/views/ActionView';
import $ from '../../app/libs/jquery';

describe('ActionView', () => {
	let obj, $elem, cb;
	const selector='#action', disabledClassName="action--disabled", labels = ['abc','xyz'];
	
	beforeEach(()=>{
		$('body').html(`
			<div>
				<a href="#" id="action">Action</a>
			</div>
		`);
		cb = jest.fn();
		obj = new ActionView(selector, cb, labels);
		$elem = $(selector);
	});
	
	const assertClick = (n)=>{
		cb.mockClear();
		$elem.click();
		expect(cb).toHaveBeenCalledTimes(n);
	};

	it('should call onClick handler when clicked', () => {
		assertClick(1);
	});

	it('should dis/en-able view', () => {
		obj.enable(true);
		expect($elem.hasClass(disabledClassName)).toBeFalsy();;
		assertClick(1);

		obj.enable(false);
		expect($elem.hasClass(disabledClassName)).toBeTruthy();
		assertClick(0);
	});
	it('should toggle label', () => {
		obj.toggleLabel();
		expect($elem.text()).toBe(labels[1]);
		obj.toggleLabel();
		expect($elem.text()).toBe(labels[0]);
	});
});