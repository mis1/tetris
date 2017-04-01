import {deepFreeze} from '../../app/common/utility';
import {clearSymbol} from '../../app/common/constants';

const boards={
	noCompletedRow:{
		size: [3,3],
		b4: `
			010
			120
			034
		`,
		cleaned: 0,
	},
	oneCompletedRowAtBottom:{
		size: [3,3],
		b4: `
			010
			120
			534
		`,
		af: `
			000
			010
			120
		`,
		cleaned: 1,
	},
	oneCompletedRowAtCenter:{
		size: [3,3],
		b4: `
			010
			534
			120
		`,
		af: `
			000
			010
			120
		`,
		cleaned: 1,

	},
	oneCompletedRowAtTop:{
		size: [3,3],
		b4: `
			534
			010
			120
		`,
		af: `
			000
			010
			120
		`,
		cleaned: 1,
	},
	oneCompletedRowAtBottomCenterTop:{
		size: [5,3],
		b4: `
			123
			040
			567
			010
			899
		`,
		af: `
			000
			000
			000
			040
			010
		`,
		cleaned: 3,
	},
	twoAdjacentCompletedRowAtBottom:{
		size: [4,3],
		b4: `
			009
			010
			123
			534
		`,
		af: `
			000
			000
			009
			010
		`,
		cleaned: 2,
	},
	twoAdjacentCompletedRowAtCenter:{
		size: [4,3],
		b4: `
			009
			213
			123
			000
		`,
		af: `
			000
			000
			009
			000
		`,
		cleaned: 2,
	},
	twoAdjacentCompletedRowAtBottomCenterTop:{
		size: [9,3],
		b4: `
			129
			213
			070
			800
			123
			456
			009
			324
			324
		`,
		af: `
			000
			000
			000
			000
			000
			000
			070
			800
			009
		`,
		cleaned: 6,
	},

};

boards.noCompletedRow.af=boards.noCompletedRow.b4;

for(let p in boards){
	const board = boards[p];
	board.b4=board.b4.trim().replace(/\t|\n/g,'').replace(/0/g,clearSymbol);
	board.af=board.af.trim().replace(/\t|\n/g,'').replace(/0/g,clearSymbol);
}

deepFreeze(boards);

export {boards};