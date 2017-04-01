import Board from '../../app/models/Board';
import {boards} from '../data/boards';

describe('Board', () => {
	let obj, cb, cb2;
	const clearSymbol = '0', rows = 10, cols = 10, markSymbol = 'a';
	
	beforeEach(() => {
		createBoard(rows, cols);
	});
	
	const createBoard = (rows, cols)=>{
		obj = new Board(rows, cols, clearSymbol);
		cb = jest.fn();
		obj.subscribe(cb);
		cb2 = jest.fn();
		obj.subscribe4Cleaning(cb2);
		
	}
	const assertSize = (rows, cols)=>{
		expect(obj.size).toEqual({
			rows,
			cols
		});
	};
	const areCellsReset= (data)=>{
		for(let i=0; i<data.length; i++){
			for(let j=0; j<data[i].length; j++){
				if (data[i][j] !== clearSymbol)
					return false;
			}
		}
		return true;
	};
	const assertReset=(callIndex=1)=>{
		expect(cb).toBeCalled();
		areCellsReset(cb.mock.calls[callIndex][0]);
	};
	const getCells=(r1=0, c1=0, r2=r1, c2=c2)=>{
		let cells=[];
		for(let i=r1; i<r2; i++){
			for(let j=c1; j<c2; j++)
				cells.push([i,j]);
		}
		return cells;
	}
	const areCellsMarked = (cells, callIndex)=>{
		const data = cb.mock.calls[callIndex][0];
		for(let i=0; i<cells.length; i++){
			const [x,y]=cells[i];
			if (data[x][y] !== markSymbol)
				return false;
		}
		return true;	
	}

	it('should be initialized', () => {
		assertSize(rows,cols);
		assertReset(0);
	});
	
	it('should resize board', () => {
		const rows = 20, cols=30;
		obj.resize(rows, cols);
		assertSize(rows, cols);
		assertReset();
	});

	it('should reset board', () => {
		obj.reset();
		assertReset();
	});
	
	it('should return board\'s size', () => {
		assertSize(rows, cols);
	});
	
	it('should areCellsEmpty return true only if all queried cells are empty', () => {
		const cells = getCells(0, 0, rows, cols);
		expect(obj.areCellsEmpty(cells)).toBe(true);
		
		obj.markCells(cells.slice(cells.length-1), [markSymbol],true); //only 1 cell nonempty
		expect(obj.areCellsEmpty(cells)).toBe(false);

		const cells2 = cells.slice(1, cols).concat(cells.slice(rows/2*cols, cols-4));
		const symbols=new Array(cells2.length).fill(markSymbol); //multiple cells nonempty
		obj.markCells(cells2, symbols,true);
		expect(obj.areCellsEmpty(cells2)).toBe(false);
	});

	it('should areCellsEmpty return false if queried cells are out of board\'s bound', () => {
		const cells=[
			[-1,0], [rows,4], [3,-1], [0,cols], [-1,-1], [rows, cols], [rows+4, -3], [-2, cols+3]
		];
		for(let i=0; i<cells.length; i++){
			expect(obj.areCellsEmpty([cells[i]])).toBe(false);
		}
	});

	it('should markCells mark cells transiently', () => {
		const cells=getCells(0,0,1,cols-1); //if complete row is marked, it will be cleaned
		const symbols=new Array(cols).fill(markSymbol);
		obj.markCells(cells, symbols);
		expect(areCellsMarked(cells, 1)).toBe(true);

		const cells2=getCells(rows/2,cols/2,rows,cols/2+1);
		obj.markCells(cells2, symbols);
		expect(areCellsMarked(cells2, 2)).toBe(true);
		expect(areCellsMarked(cells, 2)).toBe(false);

	});

	it('should markCells mark cells permanently', () => {
		const cells=getCells(0,0,2,cols-1);
		const symbols=new Array((cols-1)*2).fill(markSymbol);
		obj.markCells(cells, symbols, true);
		obj.subscribe(cb); //no cb on permanent marking unless there is a completed row. so, manually getting cb.
		expect(areCellsMarked(cells, 1)).toBe(true);

		const cells2=getCells(rows/2,cols/2,rows,cols/2+1);
		obj.markCells(cells2, symbols);
		obj.subscribe(cb); //no cb on permanent marking unless there is a completed row. so, manually getting cb.
		expect(areCellsMarked(cells2, 2)).toBe(true);
		expect(areCellsMarked(cells, 2)).toBe(true);
	});

	it('should return entry cell', () => {
		expect(obj.entryCell).toEqual([-1, cols/2-1]);
	});

	const setupBoard = (str, size)=>{
		const cells = getCells(0,0,size[0], size[1]);
		const symbols = str.split('');
		createBoard(size[0], size[1]);
		cb.mockClear();
		cb2.mockClear();
		obj.markCells(cells, symbols, true);
	};
	const isBoardSame = (data, key)=>{
		const str=boards[key].af;
		for(let i=0; i<obj.size.rows;i++){
			for(let j=0; j<obj.size.cols;j++){
				if (data[i][j] !== str[i*obj.size.cols+j])
					return false;
			}
		}
		return true
	};
	const cleanHelper = (key)=>{
		const board = boards[key];
		setupBoard(board.b4, board.size);
	};

	it('should markCells not change board if no row is completed', () => {
		cb.mockClear();
		cb2.mockClear();
		obj.markCells([],[]);
		assertReset(0);
		expect(cb2).not.toBeCalled();

		const key='noCompletedRow';
		cleanHelper(key); //clearing the cb mock				
		expect(cb).toHaveBeenCalledTimes(0); //no cb because there is no completed row 
		obj.subscribe(cb);
		const data = cb.mock.calls[0][0];
		expect(isBoardSame(data, key)).toBe(true);
		expect(cb2).not.toBeCalled();
	});

	it('should clean remove completed rows', () => {
		for(let p in boards){
			if ('noCompletedRow' !== p){
				//console.log(p);
				cleanHelper(p);
				expect(cb).toHaveBeenCalledTimes(1); //1 for clean. no cb for markcell because marking is permanent
				const data = cb.mock.calls[0][0];
				expect(isBoardSame(data, p)).toBe(true);
				expect(cb2).lastCalledWith(boards[p].cleaned);		
			}
		}
	});

	it('should subscribe', () => {
		const cb1=jest.fn();
		const cb2=jest.fn();

		obj.subscribe(cb1);
		obj.subscribe(cb2);
		obj.reset();

		expect(cb1).toHaveBeenCalledTimes(2);
		expect(cb2).toHaveBeenCalledTimes(2);
		const arr = [cb1.mock.calls[1][0], cb2.mock.calls[1][0]];
		expect(cb1).toBeCalledWith(expect.any(Array));
		expect(arr[0]).toBe(arr[1]);
		expect(arr[0].length).toBe(rows);
		expect(arr[0][0].length).toBe(cols);
		expect(Object.isFrozen(arr[0])).toBe(true);
		
	});

	it('should unsubscribe', () => {
		const cb1=jest.fn();
		const unsubscribeFn = obj.subscribe(cb1);
		expect(unsubscribeFn).toEqual(expect.any(Function));
		
		unsubscribeFn();
		obj.reset();
		//subscribe called 1 time, no callback after unsubscribe
		expect(cb1).toHaveBeenCalledTimes(1);
	});

});