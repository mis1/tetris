/** 
 * Exports metashapes. 
 * Metashape definition is used to render, rotate and color shapes.
 * Metashape name format is 'NameRxC' where RXC tells the size of metaspahe. R, C are the placeholders for the number of rows and cols (of the board) the metashpae spans. 
 * Each metashape define one shape. 
 * Each shape defines its rotations and symbols.

 * @module metaShapeDefs
 */

import {deepFreeze} from '../common/utility';

/**
 * Defines symbols.
 * Each symbol is mapped to a color value. 
 * View layer defines [colors]{@link module:viewConfig~colors} and decides which symbol to map to which color. 
 * Currently, setting 26 symbols. From 'a' to 'z'.
 * @type {Array}
 *
 * @see module:viewConfig~colors 
 */
const symbols = []; //a-z
for(let i=97; i<=122; i++){ 
	symbols.push(String.fromCharCode(i));
}

/**
 * Defines metashapes. 
 * Each metashape represents one shape and defines symbols, rotations for its shape.
 * Each rotoation defines what cells it is made of, its left, right and bottom sides.
 * Each cell is defined with reference to metashape's origin (normally, [0,0]).
 * Each side is defined by the indexes of the cells array.
 *
 * Some of the currently defined metashapes are:
 * - ms1x2  - spans 1 row and 2 cols. rotates 180 degree
 * - ms2x2  - spans 2 rows and 2 cols. doesn't rotate
 * - msL2x2 - spans 2 rows and 2 cols. looks like english alphabet L. rotates 90 degree
 * - msT3x3 - spans 3 rows and 3 cols. looks like english alphabet T. rotates 90 degree
 *    
 * @type {Object}
 */
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
		]
	},
	msL2x2:{
		symbols:[symbols[17],symbols[18],symbols[19]],
		shapes:[
			{
				cells:[
					[0,0], [0,1], [-1, 0]
				],
				left:[0,2],
				right:[1,2],
				bottom:[0,1],

			},
			{
				cells:[
					[0,1], [-1,1], [0,0]
				],
				left:[1,2],
				right:[0,1],
				bottom:[0,2],
			},
			{
				cells:[
					[-1,1],[-1,0],[0,1]
				],
				left:[1,2],
				right:[0,2],
				bottom:[1,2],
			},
			{
				cells:[
					[-1,0],[0,0], [-1,1]
				],
				left:[0,1],
				right:[1,2],
				bottom:[1,2],
			},
		]
	},
	msT3x3:{
		symbols:[symbols[19]],
		shapes:[
			{
				cells:[
					[0,-1], [0,0], [0,1],[-1,0]
				],
				left:[0,3],
				right:[2,3],
				bottom:[0,1,2]
			},
			{
				cells:[
					[0,0], [-1,0], [-2, 0], [-1,-1]
				],
				left:[0,2, 3],
				right:[0,1,2],
				bottom:[0,3],
			},
			{
				cells:[
					[-1,1],[-1,0],[-1,-1], [0,0]
				],
				left:[2,3],
				right:[0,3],
				bottom:[0,2,3],
			},
			{
				cells:[
					[-2,0],[-1,0], [0,0],[-1,1]
				],
				left:[0,1,2],
				right:[0,2,3],
				bottom:[2,3],
			},
		]
	},
};

deepFreeze(metaShapeDefs);
export default metaShapeDefs;