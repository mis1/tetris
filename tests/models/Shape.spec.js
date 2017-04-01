jest.mock('../../app/models/Board');

import Shape from '../../app/models/Shape';
import Board from '../../app/models/Board';
import {Direction, MoveResult} from '../../app/common/constants.js';
import metaShapeDefs from '../../app/models/metaShapeDefs';

describe('Shape', () => {
	const rows = 3, cols = 3, pos={x:-1, y:cols/2}, symbol='a';
	const createShapes=()=>{
		Board.mockClear();
		const shapes=[];
		for(let p in metaShapeDefs){
			const msDef = metaShapeDefs[p];
			for(let i=0; i<msDef.shapes.length; i++){
				const board = new Board(rows, cols);
				Board.mock.instances[shapes.length].entryCell = [pos.x,pos.y];
				const symbols = new Array(msDef.shapes[i].cells.length);
				symbols.fill(symbol);
				
				shapes.push({
					obj: new Shape(`${p}_${i}`, symbols, msDef.shapes[i], board),
					def: msDef.shapes[i],
					symbols
				});	
			}
		}
		return shapes;
	};
	
	const getSide = (direction, shapeDef)=>{
		switch(direction){
			case Direction.DOWN:
				return shapeDef.bottom;
			case Direction.LEFT:
				return shapeDef.left;
			case Direction.RIGHT:
				return shapeDef.right;
			case Direction.UP:
				const cellIndexes = [];
				for(let i=0; i<shapeDef.cells.length; i++)
					cellIndexes.push(i);
				return cellIndexes;
			default:
				throw(0);			
		}
	};
	const calcNextCell=(k, cell, direction, pos)=>{
		switch(direction){
			case Direction.DOWN:
				return [cell[0]+k+pos.x, cell[1]+pos.y];
			case Direction.LEFT:
				return [cell[0]+pos.x, cell[1]-k+pos.y];
			case Direction.RIGHT:
				return [cell[0]+pos.x, cell[1]+k+pos.y];
			case Direction.UP:
				return [cell[0]+pos.x,cell[1]+pos.y];
			default:
				throw(new Error(0));			
		}
	}
	const getNewPos = (k, direction)=>{
		const newPos = Object.assign({}, pos);
		switch(direction){
			case Direction.DOWN:
				newPos.x+=k;
				break;
			case Direction.LEFT:
				newPos.y-=k;
				break;
			case Direction.RIGHT:
				newPos.y+=k;
				break;
			case Direction.UP:
				break;
			default:
				throw(new Error(0));			
		}
		return newPos;
	};
	const calcAreCellsEmptyCBArgs = (i, direction, shapeDef, twice=false)=>{
		const areCellsEmptyCBArgs=[];
		for(let k=0; k<=i; k++){
			const sideCells=[];
			getSide(direction, shapeDef).forEach(index=>sideCells.push(
				calcNextCell(k+1, shapeDef.cells[index], direction, pos)
			));
			areCellsEmptyCBArgs.push([sideCells]); //[a[b[c[d]]]]=>d is one cell, c is [] of cells, b is arg for one call, a is list of calls
			if (twice){
				const newPos = getNewPos(k+1, direction);
				const nextDownMoveCells = []
				getSide(Direction.DOWN, shapeDef).forEach(index=>nextDownMoveCells.push(
					calcNextCell(1, shapeDef.cells[index], Direction.DOWN, newPos)
				));
				areCellsEmptyCBArgs.push([nextDownMoveCells]); //[a[b[c[d]]]]=>d is one cell, c is [] of cells, b is arg for one call, a is list of calls
			}
							
		}
		return areCellsEmptyCBArgs;
	};
	const calcMarkCellsCBArgs = (i, shapeDef, direction, shape)=>{
		const markCellsCBArgs=[];
		for(let k=0; k<=i; k++){
			const cells=[];
			shapeDef.cells.forEach(cell=>cells.push(calcNextCell(k+1, cell, direction, pos)));
			markCellsCBArgs.push([cells.slice(), shape.symbols]); 
		}
		return markCellsCBArgs;
	};

	it('should not move if next cells are occupied for left, right, down direction or shape\'s cells are occupied for up direction', () => {
		const shapes = createShapes();
		const shape = shapes[0];
		const mock = Board.mock.instances[0];
		const directions = [Direction.DOWN, Direction.LEFT, Direction.RIGHT, Direction.UP];

		for(let a=0; a<directions.length; a++){
			mock.areCellsEmpty.mockClear();
			mock.areCellsEmpty.mockReturnValue(false);	
			const direction = directions[a];
			const areCellsEmptyCBArgs = calcAreCellsEmptyCBArgs(0, direction, shape.def);

			const ret = shape.obj.move(direction);
			
			expect(ret).toBe(MoveResult.NO);
			expect(mock.areCellsEmpty.mock.calls).toEqual(areCellsEmptyCBArgs);
		}
	});

	it('should move n times and then freeze', () => {
		const n=rows+2;
		const directions = [Direction.DOWN, Direction.LEFT, Direction.RIGHT, Direction.UP];

		for(let a=0; a<directions.length; a++){
			const direction = directions[a];
			for(let i=0; i<n; i++){//how many times to move each shape. 0-n-1
				const areCellsEmptyReturns = [];
				const moveRets = [];
				//return i-1 times true and last time false
				for(let j=0; j<i; j++){ 
					areCellsEmptyReturns.push(true);
					areCellsEmptyReturns.push(true);
					moveRets.push(MoveResult.YES);
				}
				areCellsEmptyReturns.push(true);
				areCellsEmptyReturns.push(false);
				moveRets.push(MoveResult.FREEZE);

				const shapes = createShapes(); //also clearing board mock

				for(let j=0; j<shapes.length; j++){
					const shape = shapes[j];
				
					//calc side cells i times
					const areCellsEmptyCBArgs = calcAreCellsEmptyCBArgs(i,direction, shape.def, true);
					
					//calc next cells to mark i times
					let	markCellsCBArgs = calcMarkCellsCBArgs(i, shape.def, direction, shape);
					const last = markCellsCBArgs[markCellsCBArgs.length-1].slice(); //this is when shape is freezed
					last.push(true);
					markCellsCBArgs.push(last);
			
					const mock = Board.mock.instances[j];

					for(let k=0, m=0;k<=i; k++, m+=2){
						mock.areCellsEmpty.mockReturnValueOnce(areCellsEmptyReturns[m]);
						mock.areCellsEmpty.mockReturnValueOnce(areCellsEmptyReturns[m+1]);
						const ret = shape.obj.move(direction);
						expect(ret).toBe(moveRets[k]);
					}

					expect(mock.areCellsEmpty.mock.calls).toEqual(areCellsEmptyCBArgs);	
					expect(mock.markCells.mock.calls).toEqual(markCellsCBArgs);			
				}
			}
		}				
	});
});