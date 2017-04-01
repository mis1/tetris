import {deepFreeze} from '../common/utility';

const symbols = []; //a-z
for(let i=97; i<=122; i++){ 
	symbols.push(String.fromCharCode(i));
}

const metaShapeDefs={
	ms1x2:{
		symbols:[symbols[0],symbols[1]],
		shapes:[
			{
				cells:[
					[0,0], [0,1]
				],
				left:[0],
				right:[1],
				bottom:[0,1],

			},
			{
				cells:[
					[0,0], [-1,0]
				],
				left:[0,1],
				right:[0,1],
				bottom:[0],
				symbols:[symbols[2]]
			},
			{
				cells:[
					[0,0], [0,-1]
				],
				left:[1],
				right:[0],
				bottom:[0,1],
				symbols:[symbols[3], symbols[4]]
			},
		]
	},
	ms1x3:{
		symbols:[],
		shapes:[
			{
				cells:[
					[0,0], [0,1], [0,-1]
				],
				left:[2],
				right:[1],
				bottom:[0,1,2],
				symbols:[symbols[7],symbols[6],symbols[6]],
			},
			{
				cells:[
					[0,0], [-1,0], [-2, 0]
				],
				left:[0,1,2],
				right:[0,1,2],
				bottom:[0],
				symbols:[symbols[8],symbols[9],symbols[8]],
			},
		]
	},
	ms2x2:{
		symbols:[symbols[9]],
		shapes:[
			{
				cells:[
					[0,0], [0,1], [-1,0], [-1, 1]
				],
				left:[0, 2],
				right:[1, 3],
				bottom:[0,1],
			},
			{
				cells:[
					[0,0], [0,-1], [-1,0], [-1, -1]
				],
				left:[1,3],
				right:[0,2],
				bottom:[0, 1],
				symbols:[symbols[10],symbols[11],symbols[12], symbols[13]],
			},
		]
	},
};

deepFreeze(metaShapeDefs);
export default metaShapeDefs;