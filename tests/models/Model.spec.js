jest.mock('../../app/models/Board');
jest.mock('../../app/models/Timer');
jest.mock('../../app/models/MetaShape');
jest.mock('../../app/models/ShapeFactory');
jest.mock('../../app/models/RandomMetaShapeFactory');

import Model, {fps, rows, cols, scorePerTick, scorePerCompletion} from '../../app/models/Model';
import {GameStatus, Direction, InputKey, clearSymbol, MoveResult} from '../../app/common/constants';

import Board from '../../app/models/Board';
import Timer from '../../app/models/Timer';
import MetaShape from '../../app/models/MetaShape';
import RandomMetaShapeFactory from '../../app/models/RandomMetaShapeFactory';
import metaShapeDefs from '../../app/models/metaShapeDefs';
import ShapeFactory from '../../app/models/ShapeFactory';
import ObserverList from '../../app/models/ObserverList';

RandomMetaShapeFactory.prototype.createMetaShape = ()=>(new MetaShape());

describe('Model', () => {
	let obj, cbStatus, cbScore, cbBoard, timer, board, runFunc, metaShape;
	beforeEach(() => {
		cbStatus = jest.fn();
		cbScore = jest.fn();
		cbBoard = jest.fn();
		clearMocks([Timer, Board, MetaShape, RandomMetaShapeFactory]);
		obj = new Model();
		obj.subscribe4Status(cbStatus);
		obj.subscribe4Score(cbScore);
		obj.subscribe4Board(cbBoard);
		timer = Timer.mock.instances[0];
		board = Board.mock.instances[0];
		runFunc = Timer.mock.calls[0][1];
		metaShape = MetaShape.mock.instances[0];
	});
	const assertCalls = (cbs, expectedArgs)=>{
		if (!Array.isArray(cbs)){
			cbs = [cbs];
		}
		cbs.forEach(cb=>{
			const calls = cb.mock.calls;
			expect(calls).toEqual(expectedArgs);
		});	
	};
	const clearMocks = cbs=>-cbs.forEach(cb=>cb.mockClear());
	const assertGameStarted = (n1=1, n2=1, status=GameStatus.STARTED, score=[0])=>{
		expect(timer.start).toHaveBeenCalledTimes(n1);
		expect(board.reset).toHaveBeenCalledTimes(n2);
		if (status){
			assertCalls(cbStatus,[[status]]);
		}
		else{
			expect(cbStatus).toHaveBeenCalledTimes(0);
		}
		if (score){
			assertCalls(cbScore, [score]);
		}
		else{
			expect(cbScore).toHaveBeenCalledTimes(0);
		}
	};
	const assertStatusChange = (n1=1, status=GameStatus.PAUSED)=>{
		expect(timer.stop).toHaveBeenCalledTimes(n1);
		if (status){
			assertCalls(cbStatus,[[status]]);
		}
		else{
			expect(cbStatus).toHaveBeenCalledTimes(0);
		}
	};
	const setMoveRetVal = retVal => {
		const msIndex = MetaShape.mock.instances.length-1;
		metaShape = MetaShape.mock.instances[msIndex];
		metaShape.move.mockClear();
		metaShape.move.mockReturnValue(retVal);
	};
	const assertGameRun = (times, n1=times)=>{
		clearMocks([cbScore]);
		setMoveRetVal(MoveResult.YES);
		const args = new Array(times).fill([Direction.DOWN]);
		for(let i=0; i<times; i++){
			runFunc();
		}
		expect(cbScore).toHaveBeenCalledTimes(n1);
		expect(metaShape.move.mock.calls).toEqual(args);
	};
	const assertGameFinished = ()=>{
		clearMocks([cbStatus, timer.stop]);
		setMoveRetVal(MoveResult.NO);
		runFunc();
		expect(timer.stop).toHaveBeenCalledTimes(1);
		assertCalls(cbStatus,[[GameStatus.FINISHED]]);
	};

	it('should create member objects', () => {
		expect(Timer.mock.calls).toEqual([
			[1000/fps, expect.any(Function)]
		]);
		expect(Board.mock.calls).toEqual([
			[rows, cols, clearSymbol]
		]);
		expect(RandomMetaShapeFactory.mock.calls).toEqual([
			[metaShapeDefs, ShapeFactory.mock.instances[0]]
		]);
		expect(RandomMetaShapeFactory.mock.instances[0].createMetaShape).toHaveBeenCalledTimes(1);

		expect(ShapeFactory.mock.calls).toEqual([[board]]);
		expect(board.subscribe4Cleaning.mock.calls).toEqual([
			[expect.any(Function)]
		]);
	});

	it('should subscribe4Score', () => {
		assertCalls(cbScore, [[0]]);
		obj.start();
		for(let i=1; i<10; i++){
			assertGameRun(1);
			expect(cbScore.mock.calls).toEqual([[i*scorePerTick]]);
		}	
	});

	it('should unsubscribe from score subscription', () => {
		const cb2=jest.fn();
		const unsubscribeFn = obj.subscribe4Score(cb2);
		expect(unsubscribeFn).toEqual(expect.any(Function));
		clearMocks([cb2]);
		unsubscribeFn();
		obj.start();
		assertGameRun(1); //asserting cbScore called 1 time
		expect(cb2).toHaveBeenCalledTimes(0);
	});

	
	it('should subscribe4Status', () => {
		assertCalls(cbStatus, [[GameStatus.READY]]);	
		const cb2=jest.fn();
		obj.subscribe4Status(cb2);
		clearMocks([cbStatus, cb2]);
		obj.start();
		assertCalls([cbStatus, cb2], [[GameStatus.STARTED]]);
	});

	it('should unsubscribe from status subscription', () => {
		const cb2=jest.fn();
		const unsubscribeFn = obj.subscribe4Status(cb2);
		expect(unsubscribeFn).toEqual(expect.any(Function));
		clearMocks([cbStatus,cb2]);
		unsubscribeFn();
		obj.start();
		expect(cb2).toHaveBeenCalledTimes(0);
		assertCalls(cbStatus, [[GameStatus.STARTED]]);
	});

	it('should subscribe4Board', () => {
		const mock = Board.mock.instances[0].subscribe;
		assertCalls(mock,[[cbBoard]]);
	});

	it('should start ready, stopped, finsihed game and reset board', () => {
		//ready game
		clearMocks([cbStatus, cbScore, board.reset]);
		obj.start();
		assertGameStarted();
		assertGameRun(10);
		
		//stop game
		obj.stop();
		clearMocks([cbStatus, timer.start, board.reset, cbScore]);
		obj.start();
		assertGameStarted();
		
		//finish game
		assertGameFinished();
		clearMocks([cbStatus, timer.start, board.reset, cbScore]);
		obj.start();
		assertGameStarted();
	});

	it('should start paused game without resetting board, score and metashpae', () => {
		clearMocks([cbStatus]);
		obj.start();
		obj.pause();
		clearMocks([cbStatus, timer.start, board.reset, cbScore]);
		const nInstances = MetaShape.mock.instances.length;
		obj.start();
		assertGameStarted(1,0, GameStatus.STARTED, false);
		expect(nInstances).toBe(MetaShape.mock.instances.length);
	});

	it('should not start already started game', () => {
		clearMocks([cbStatus]);
		obj.start();
		clearMocks([cbStatus, timer.start, board.reset, cbScore]);
		const ret = obj.start();
		expect(ret).toBeFalsy();
		assertGameStarted(0,0, false, false);
	});

	it('should pause started game', () => {
		obj.start();
		clearMocks([cbStatus]);
		obj.pause();
		assertStatusChange(1);
	});
	
	it('should restart paused game', () => {
		obj.start();
		obj.pause();//pause started game
		clearMocks([cbStatus, timer.start, board.reset,cbScore]);		
		obj.pause();//restart paused game
		assertGameStarted(1,0, GameStatus.STARTED, false);
	});

	it('should not pause already stopped, finished game', () => {
		const assertNotPaused = ()=>{
			clearMocks([cbStatus, timer.stop, cbScore]);
			let ret = obj.pause();
			expect(ret).toBeFalsy();
			assertStatusChange(0, false);
		}; 
		//stopped game
		obj.stop();
		assertNotPaused();

		//finished game
		obj.start();
		assertGameFinished();
		assertNotPaused();
	});

	it('should stop started, paused game', () => {
		obj.start();
		clearMocks([cbStatus, timer.stop]);
		obj.stop();
		assertStatusChange(1,GameStatus.STOPPED);

		obj.start();
		obj.pause();
		clearMocks([cbStatus, timer.stop]);
		obj.stop();
		assertStatusChange(1,GameStatus.STOPPED);
	});

	it('should not stop already stopped, finished game', () => {
		obj.start();
		obj.stop();
		clearMocks([cbStatus, timer.stop]);
		const ret = obj.stop();
		expect(ret).toBeFalsy();
		assertStatusChange(0, false);
	});

	it('should finish started game when shape can\'t move in DOWN direction', () => {
		obj.start();
		assertGameFinished();
	});

	it('should not finish started game when shape can\'t move in LEFT, RIGHT, UP directions', () => {
		const allowedInputKeys = [InputKey.UP, InputKey.LEFT, InputKey.RIGHT];
		obj.start();
		setMoveRetVal(MoveResult.NO);
		clearMocks([cbStatus, timer.stop]);
		for(let i=0; i<allowedInputKeys.length; i++){
			obj.handleInputKey(allowedInputKeys[i]);
			expect(timer.stop).toHaveBeenCalledTimes(0);
			expect(cbStatus).toHaveBeenCalledTimes(0);
		}
	});

	it('should createMetaShape be called in run if current shape is freezed', () => {
		const getMetaShape = ret => {
				const ms = new MetaShape();
				setMoveRetVal(ret); 
				return ms;
		};

		obj.start();
		const mockCreateShape = RandomMetaShapeFactory.mock.instances[0].createMetaShape;
		for(let i=0; i<10;i++){
			setMoveRetVal(MoveResult.FREEZE); //existing shape return FREEZE
			//set new metashapes
			mockCreateShape.mockClear(); 	
			const shapes = [];
			for(let j=0; j<i; j++){ 
				shapes.push(getMetaShape(MoveResult.FREEZE));
				mockCreateShape.mockReturnValueOnce(shapes[j]);
			}
			shapes.push(getMetaShape(MoveResult.YES)); //last created shape return YES
			mockCreateShape.mockReturnValueOnce(shapes[i]);
			clearMocks([cbStatus]);
			
			runFunc();
			
			assertStatusChange(0, false);
			for(let j=0; j<=i; j++){
				expect(shapes[j].move.mock.calls).toEqual([[Direction.DOWN]]);
			}
			expect(mockCreateShape).toHaveBeenCalledTimes(i+1);
		}
	});
	
	it('should handle only allowed keys', function() {
		const allowedInputKeys = [InputKey.UP, InputKey.LEFT, InputKey.RIGHT, InputKey.DOWN];
		const inputkey2Direction = {
			[InputKey.UP]:Direction.UP,
			[InputKey.LEFT]:Direction.LEFT,
			[InputKey.RIGHT]:Direction.RIGHT,
			[InputKey.DOWN]:Direction.DOWN
		};
		obj.start();	
		for(let i=0; i<allowedInputKeys.length; i++){
			setMoveRetVal(MoveResult.YES);
			const key = allowedInputKeys[i];
			const ret = obj.handleInputKey(key);
			expect(ret).toBe(MoveResult.YES)
			const args = [[inputkey2Direction[key]]];
			expect(metaShape.move.mock.calls).toEqual(args);

		}
		metaShape.move.mockClear();
		const ret = obj.handleInputKey('dummy');
		expect(ret).toBeFalsy();
		expect(metaShape.move).toHaveBeenCalledTimes(0);
	});

});