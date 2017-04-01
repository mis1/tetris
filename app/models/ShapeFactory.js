import Shape from './Shape';

export default class ShapeFactory{
	constructor(board){
		this._board = board;
	}
	createShape(id, symbols, shapeDef){
		let symbs = shapeDef.symbols || symbols;
		if (symbs.length !== shapeDef.cells.length){
			const lastSymbol = symbs[symbs.length-1];
			symbs = symbs.slice();
			for(let j=symbs.length; j<shapeDef.cells.length; j++)
				symbs.push(lastSymbol);
			Object.freeze(symbs);		
		}
		return new Shape(id, symbs, shapeDef, this._board);
	}
}