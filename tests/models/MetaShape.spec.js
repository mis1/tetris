import MetaShape from '../../app/models/MetaShape';
import {Direction, MoveResult} from '../../app/common/constants.js';

describe('MetaShape', () => {
	let obj, shapes, ids=[];
	const msId = 'tempid', nShapes = 3;

	beforeEach(() => {
		shapes=[];
		for(let i=0; i<nShapes; i++){
			const id = msId + '_' + i;
			shapes.push({
				id: id,
				move: jest.fn(()=>MoveResult.YES),
			});
			ids.push(id);
		}
		Math.random = jest.fn(()=>0);
		obj = new MetaShape(msId, shapes);	
	});
	
	it('should return id', () => {
		for(let i=0; i<nShapes; i++){
			expect(obj.id).toBe(ids[i]);
			obj.move(Direction.UP);
		}
	});

	it('should move in down, left, right directions', () => {
		const directions = [Direction.DOWN, Direction.LEFT, Direction.RIGHT];
		const expectedArgs = [];
		for(let i=0; i<directions.length; i++){
			const ret = obj.move(directions[i]);
			expect(ret).toBe(MoveResult.YES);
			expectedArgs.push([directions[i]]);
		}
		const calls=shapes[0].move.mock.calls;
		expect(calls).toEqual(expectedArgs);
	});

	it('should move select next shape on up direction if next shape is possible', () => {
		for(let i=0; i<10; i++){
			const ret = obj.move(Direction.UP);
			obj.move(Direction.DOWN);

			const j = (i+1)%shapes.length;
			const calls=shapes[j].move.mock.calls;
			expect(ret).toBe(MoveResult.YES);
			expect(calls).toEqual([[Direction.UP],[Direction.DOWN]]);
			shapes[j].move.mockClear();
		}
	});
	it('should move not select next shape on up direction if next shape is not possible', () => {
		shapes[1].move = jest.fn(()=>MoveResult.NO);
		for(let i=0; i<2; i++){
			const ret = obj.move(Direction.UP);
			obj.move(Direction.DOWN);
			const calls0=shapes[0].move.mock.calls;
			const calls1=shapes[1].move.mock.calls;
			expect(calls0).toEqual([[Direction.DOWN]]);
			expect(calls1).toEqual([[Direction.UP]]);
			shapes[0].move.mockClear();
			shapes[1].move = jest.fn(()=>MoveResult.FREEZE);
		}	
	});
});