import metaShapeDefs from '../../app/models/metaShapeDefs';

describe('metaShapeDefs', () => {
	const assertArray=(obj,elemType="number")=>{
		expect(Array.isArray(obj)).toBe(true);
		if (elemType){
			obj.forEach(elem=>{
				expect(typeof elem).toBe(elemType);
			});
		}
	};
	const assertSybmols = (symbols)=>{
		assertArray(symbols, "string");
	};
	const assertBounds=(arr, lower, upper)=>{
		arr.forEach(elem=>{
			expect(elem).toBeGreaterThanOrEqual(lower);
			expect(elem).toBeLessThan(upper);	
		})
		
	};

	it('should be frozen', () => {
		expect(Object.isFrozen(metaShapeDefs)).toBe(true);
		var propNames = Object.getOwnPropertyNames(metaShapeDefs);
		propNames.forEach(function(name) {
    		var prop = metaShapeDefs[name];
		   expect(Object.isFrozen(prop)).toBe(true);
	  	});
	});

	it('should have valid data', () => {
		for(let p in metaShapeDefs){
			const msDef = metaShapeDefs[p];
			
			expect(msDef.symbols).toBeDefined();
			assertSybmols(msDef.symbols);

			msDef.shapes.forEach((def)=>{
				assertArray(def.cells, "object");
				assertArray(def.left);
				assertArray(def.right);
				assertArray(def.bottom);
				assertBounds(def.left,0,def.cells.length);
				assertBounds(def.right,0,def.cells.length);
				assertBounds(def.bottom,0,def.cells.length);
				if (def.symbols){
					assertSybmols(def.symbols);
				}
				def.cells.forEach((elem)=>{
					assertArray(elem);
					expect(elem).toHaveLength(2);
				});
			});
		}
			
	});
});