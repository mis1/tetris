/**
 * Exports constants.
 * 
 * @module constants
 */

/**
 * Enum class from enumify - A JavaScript library for enums.
 * @external Enum
 * @see https://github.com/rauschma/enumify
 */
import {Enum} from 'enumify';

/**
 * An enum for directions. 
 * @extends {external:Enum}
 * @property {} LEFT
 * @property {} RIGHT
 * @property {} DOWN
 * @property {} UP
 */
class Direction extends Enum {}
Direction.initEnum(['LEFT', 'RIGHT', 'DOWN', 'UP']);

/**
 * An enum for game states. 
 * @extends {external:Enum}
 * @property {} READY
 * @property {} STARTED
 * @property {} PAUSED
 * @property {} STOPPED
 * @property {} FINISHED
 */
class GameStatus extends Enum {}
GameStatus.initEnum(['READY', 'STARTED', 'PAUSED', 'STOPPED', 'FINISHED']);

/**
 * An enum for input keys.
 * @extends {external:Enum}
 * @property {} LEFT
 * @property {} RIGHT
 * @property {} DOWN
 * @property {} UP
 */
class InputKey extends Enum {}
InputKey.initEnum(['LEFT', 'RIGHT', 'UP', 'DOWN']);

/**
 * An enum for shape movement outcomes.
 * @extends {external:Enum}
 * @property {} YES
 * @property {} NO
 * @property {} FREEZE
 */
class MoveResult extends Enum {}
MoveResult.initEnum(['YES', 'NO', 'FREEZE']);

/**
 * Maps input keys to directions.
 * @type {Object}
 * @see  module:constants~InputKey
 * @see  module:constants~Direction
 */
const inputkey2Direction = {
	[InputKey.UP]:Direction.UP,
	[InputKey.LEFT]:Direction.LEFT,
	[InputKey.RIGHT]:Direction.RIGHT,
	[InputKey.DOWN]:Direction.DOWN,
};

/**
 * Board's cells are initialized with clearSymbol. When a shape moves into a cell, clearSymbol is overwritten by shape's symbol. 
 * @type {String}
 */
const clearSymbol = '0';

export {Direction, GameStatus, InputKey, inputkey2Direction, clearSymbol, MoveResult};
