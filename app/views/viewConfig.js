/**
 * Exports configuration used by the views.
 * 
 * @module viewConfig
 */

/**
 * Defines colors.
 * Each {@link module:metaShapeDefs~symbols|symbol} is mapped to a color. 
 * @type {Array}
 *
 * @see module:metaShapeDefs~symbols 
 */
const colors = ['#5F9EA0', '#FF69B4', '#0f0', '#0ff', '#f0f', '#7FFF00', '#20B2AA', '#6B8E23', '#DA70D6', '#DB7093', '#DDA0DD', '#800080'];

/** 
 * color to render empty cell in. 
 * @type {String} 
 */
const clearColor = '#f3f3f3';

/** 
 * how big a cell is. each cell is a square.
 * @type {Number} 
 */
const cellSize = 33;


const maxBoardBorderWidth = 10;

/**
 * actual board width is the smaller of the maxBoardWith and canvas widths.
 * @type {Number}
 */
const maxBoardWidth = 480;

/**
 * actual board height is the smaller of the maxBoardHeight and canvas heights.
 * @type {Number}
 */
const maxBoardHeight = 640;

export {colors, clearColor, cellSize, maxBoardBorderWidth, maxBoardWidth, maxBoardHeight};

/**
 * @function
 * @alias module:viewConfig~bar
 * @see  module:viewConfig~MyClass
 */
function bar() {}

/**
 * this is class
 * @class module:viewConfig~MyClass
 */
function MyClass(){
	this.foo=function(){}
}
/**
 * See [hello]{@link module:viewConfig~MyClass} and [MyClass's foo property]{@link MyClass#foo}. bar
 * Also, check out {@link http://www.google.com|Google} and
 * {@link https://github.com GitHub}.
 * @see module:viewConfig~MyClass
 * @see  module:viewConfig~bar
 */
function myFunction() {}