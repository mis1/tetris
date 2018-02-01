import ObserverList from './ObserverList';

export default class Board{
	constructor(rows, cols, clearSymbol){
		this._observerList = new ObserverList();
		this._observerList4Clean = new ObserverList();
		this._rows = rows;
		this._cols = cols;
		this._clearSymbol = clearSymbol;
		this.resize(rows,cols);
		this._entryCell=[-1, cols/2-1];
		
	}
	resize(rows, cols){
		this._rows = rows;
		this._cols = cols;
		this._data = new Array(rows);
		for(let i=0; i<rows; i++){
			this._data[i]=new Array(cols);
		}
		this.reset();
		this._entryCell=[-1, Math.floor(cols/2)-1];
	}
	reset(startRow=0, endRow=this._rows){
		for(let i=startRow; i<endRow; i++){
			for(let j=0; j<this._cols;j++){
				this._data[i][j]=this._clearSymbol;
			}
		}
		this._notify(this._data);
	}
	areCellsEmpty(cells){
		for(let i=0; i<cells.length;i++){
			const [x,y]=cells[i];
			if (x <0 || x >=this._rows || 
				this._data[x][y] != this._clearSymbol)
				return false;
		}
		return true;
	}
	markCells(cells, symbols, permanent=false){
		if (!permanent){
			const data = this._getDataCopy();
			this._copyCellSymbols(cells, symbols, data);
			this._notify(data);
		}
		else{
			this._copyCellSymbols(cells, symbols, this._data);
			this._clean();
		}
	}
	subscribe(cb){
		const data = this._getDataCopy();
		return this._observerList.subscribe(cb, data);
	}
	subscribe4Cleaning(cb){
		return this._observerList4Clean.subscribe(cb, 0);
	}
	get size(){
		return {
			rows: this._rows,
			cols: this._cols
		};
	}
	get entryCell(){
		return this._entryCell.slice();
	}
	_copyCellSymbols(cells, symbols, data){
		for(let i=0;i<cells.length;i++){
			const [x,y]=cells[i];
			if (x>-1 && x<this._rows && y>-1 && y<this._cols)
				data[x][y] = symbols[i];
		}
	}
	_notify(data){
		Object.freeze(data);
		this._observerList.notify(data);
	}
	_getDataCopy(){
		const data=[];
		const len=this._data.length;		
		for(let i=0;i<len;i++){
			data.push(this._data[i].slice());
		}
		return data;
	}
	_clean(){
		const newData = new Array(this._rows);
		let k = this._rows-1;
		for(let i=this._rows-1; i>=0;i--){
			let isCompleted = true;
			for(let j=0; j<this._cols;j++){
				isCompleted &= this._data[i][j] !== this._clearSymbol;
			}
			if (!isCompleted){
				newData[k--] = this._data[i];
			}
		}
		if (k < this._rows-1 && k > -1){//at least one row copied
			for(let i=k; i>=0;i--){
				newData[i] = new Array(this._cols);
			}
			this._data= newData;	
			this.reset(0,k+1);
		}
		if (k>-1){
			this._observerList4Clean.notify(k+1);
		}		
	}
}