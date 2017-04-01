jest.mock('../../app/models/MetaShape');

import RandomMetaShapeFactory from '../../app/models/RandomMetaShapeFactory';
import MetaShape from '../../app/models/MetaShape';
import metaShapeDefs from '../../app/models/metaShapeDefs';


describe('RandomMetaShapeFactory', () => {
	let obj, shapeFactory, keys;
	const createShapeRet = "createShapeRet";

	beforeEach(() => {
		keys = Object.keys(metaShapeDefs);
		shapeFactory = { createShape: jest.fn(()=>createShapeRet)};
		obj = new RandomMetaShapeFactory(metaShapeDefs, shapeFactory);
	});
	
	it('should create metaShape', () => {
		Math.random = ()=>0.9;
		const key = keys[keys.length-1];
		const metaShapeDef = metaShapeDefs[key];
		const shapeDefs = metaShapeDef.shapes;

		const metaShape = obj.createMetaShape();
		
		const createShapeArgs = [], shapes=[];
		for(let i=0; i<shapeDefs.length; i++){
			createShapeArgs.push([key+'_'+i, metaShapeDef.symbols, shapeDefs[i]]);
			shapes.push(createShapeRet);
		}
		expect(metaShape).toBe(MetaShape.mock.instances[0]);
		const calls = MetaShape.mock.calls;
		expect(calls).toEqual([[key, shapes]]);

		const calls2 = shapeFactory.createShape.mock.calls;
		expect(calls2).toEqual(createShapeArgs);
	});

});