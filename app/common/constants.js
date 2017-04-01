import {Enum} from 'enumify';

class Direction extends Enum {}
Direction.initEnum(['LEFT', 'RIGHT', 'DOWN', 'UP']);

class GameStatus extends Enum {}
GameStatus.initEnum(['READY', 'STARTED', 'PAUSED', 'STOPPED', 'FINISHED']);

class InputKey extends Enum {}
InputKey.initEnum(['LEFT', 'RIGHT', 'UP', 'DOWN']);

class MoveResult extends Enum {}
MoveResult.initEnum(['YES', 'NO', 'FREEZE']);

const inputkey2Direction = {
	[InputKey.UP]:Direction.UP,
	[InputKey.LEFT]:Direction.LEFT,
	[InputKey.RIGHT]:Direction.RIGHT,
	[InputKey.DOWN]:Direction.DOWN,
};

const clearSymbol = '0';

export {Direction, GameStatus, InputKey, inputkey2Direction, clearSymbol, MoveResult};
