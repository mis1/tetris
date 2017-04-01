jest.mock('../../app/models/Shape');
import ShapeFactory from '../../app/models/ShapeFactory';
import Shape from '../../app/models/Shape';

describe('ShapeFactory', () => {
	let obj;
	const id = 'tempid', board="board";

	beforeEach(() => {
		Shape.mockClear();
		obj = new ShapeFactory(board);

	});
	
	const assertShapeCreation = (expectedSymbols, shapeDef)=>{
		const calls = Shape.mock.calls;
		expect(calls).toEqual([[id, expectedSymbols, shapeDef, board]]);
		expect(Object.isFrozen(calls[0][1])).toBe(true);
	};

	it('should create shape by using and filling passed symbols', () => {
		const symbols = ['a'];
		const shapeDef = {
			cells:[1,2,3]
		};
		
		obj.createShape(id, symbols, shapeDef);

		const expectedSymbols = ['a','a','a'];
		assertShapeCreation(expectedSymbols, shapeDef);
	});

	it('should create shape by using and without filling passed symbols', () => {
		const symbols = ['a','a','a'];
		const shapeDef = {
			cells:[1,2,3]
		};
		Object.freeze(symbols);
		
		obj.createShape(id, symbols, shapeDef);
	
		assertShapeCreation(symbols, shapeDef);
	});

	it('should create shape by using and filling symbols in shapeDef', () => {
		const symbols = ['a','a','a'];
		const shapeDef = {
			cells:[1,2,3],
			symbols:['a','b']
		};
		
		obj.createShape(id, symbols, shapeDef);
		const expectedSymbols = ['a','b','b'];
		assertShapeCreation(expectedSymbols, shapeDef);
	});

	it('should create shape by using and without filling symbols in shapeDef', () => {
		const symbols = ['a'];
		const shapeDef = {
			cells:[1,2,3],
			symbols:['a','b','c']
		};
		Object.freeze(shapeDef.symbols);
		
		obj.createShape(id, symbols, shapeDef);
		
		assertShapeCreation(shapeDef.symbols, shapeDef);
	});
	
});