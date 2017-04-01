import MetaShape from './MetaShape';
import ShapeFactory from './ShapeFactory';

export default class RandomMetaShapeFactory{
	constructor(metaShapeDefs, shapeFactory){
		this._metaShapeDefs = metaShapeDefs;
		this._shapeFactory = shapeFactory;
		this._keys = Object.keys(metaShapeDefs);	
	}
	createMetaShape(){
		const index = Math.floor(Math.random() * this._keys.length);
		const id = this._keys[index];
		const shapes = this._createShapes(id);
		return new MetaShape(id, shapes);
	}
	_createShapes(id){
		const shapes = [];
		const metaShapeDef = this._metaShapeDefs[id];
		const shapeDefs = metaShapeDef.shapes;
		for(let i=0; i<shapeDefs.length; i++){
			shapes.push(
				this._shapeFactory.createShape(`${id}_${i}`, metaShapeDef.symbols, shapeDefs[i]));
		}
		return shapes;
	}
}
