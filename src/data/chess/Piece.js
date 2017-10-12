export default class Piece {
	constructor(alias) {
		const piece = pieceEnum[alias.toLowerCase()]
		this.name = piece.name
		this.move = piece.move
		this.weight = piece.weight
		this.camp = /[A-Z]/.test(alias) ? 'white' : 'black'
		this.inactive = true
	}

	transform(alias) {
		const piece = pieceEnum[alias.toLowerCase()]
		this.name = piece.name
		this.move = piece.move
		this.weight = piece.weight
		this.inactive = true
	}
}

const moves = {
	pawn(startBlock, endBlock, axisMap, isHint) {
		const x1 = startBlock.x
		const y1 = startBlock.y
		const x2 = endBlock.x
		const y2 = endBlock.y
		const upside = startBlock.piece.camp === 'white'
		const _x = x1 - x2
		const _y = y1 - y2
		if ((_y < 0 && upside) || (_y > 0 && !upside)) {
			return false
		}
		if (Math.abs(_x) === 0 && Math.abs(_y) === 1 && !endBlock.piece) {
			return true
		}
		if (Math.abs(_x) === 1 && Math.abs(_y) === 1 && endBlock.piece && endBlock.piece.camp !== startBlock.piece.camp) {
			return true
		}
		if (startBlock.piece.inactive && Math.abs(_x) === 0 && Math.abs(_y) === 2 && !axisMap[`(${x1},${(y1+y2)/2})`].piece && !endBlock.piece && inBorder(y2, upside)) {
			const passer = {
				camp:startBlock.piece.camp,
				block:endBlock,
				eaten:false,
				x:x2,
				y:startBlock.piece.camp === 'white' ? y2 + 1 : y2 - 1
			}
			isHint ? '' : axisMap['passer'] = passer
			return true
		}
		if (Math.abs(_x) === 1 && Math.abs(_y) === 1 && axisMap.passer && axisMap.passer.camp !== startBlock.piece.camp && x2 === axisMap['passer'].x && y2 === axisMap['passer'].y) {
			axisMap['passer'].eaten = true
			return true
		}
		return false
	},
	rook(startBlock, endBlock, axisMap) {
		const x1 = startBlock.x
		const y1 = startBlock.y
		const x2 = endBlock.x
		const y2 = endBlock.y
		if (x1 !== x2 && y1 !== y2) {
			return false
		}
		if (endBlock.piece && endBlock.piece.camp === startBlock.piece.camp) {
			return false
		}
		return clearPath(x1, y1, x2, y2, axisMap)
	},
	knight(startBlock, endBlock, axisMap) {
		const x1 = startBlock.x
		const y1 = startBlock.y
		const x2 = endBlock.x
		const y2 = endBlock.y
		const _x = x1 - x2
		const _y = y1 - y2
		if (endBlock.piece && endBlock.piece.camp === startBlock.piece.camp) {
			return false
		}
		if ((Math.abs(_x) === 1 && Math.abs(_y) === 2) || (Math.abs(_x) === 2 && Math.abs(_y) === 1)) {
			return true
		}
		return false
	},
	bishop(startBlock, endBlock, axisMap) {
		const x1 = startBlock.x
		const y1 = startBlock.y
		const x2 = endBlock.x
		const y2 = endBlock.y
		const _x = x1 - x2
		const _y = y1 - y2
		if (Math.abs(_x) !== Math.abs(_y)) {
			return false
		}
		if (endBlock.piece && endBlock.piece.camp === startBlock.piece.camp) {
			return false
		}
		return clearPath(x1, y1, x2, y2, axisMap)
	},
	queen(startBlock, endBlock, axisMap) {
		const x1 = startBlock.x
		const y1 = startBlock.y
		const x2 = endBlock.x
		const y2 = endBlock.y
		if (endBlock.piece && endBlock.piece.camp === startBlock.piece.camp) {
			return false
		}
		return clearPath(x1, y1, x2, y2, axisMap)
	},
	king(startBlock, endBlock, axisMap) {
		const x1 = startBlock.x
		const y1 = startBlock.y
		const x2 = endBlock.x
		const y2 = endBlock.y
		const _x = x1 - x2
		const _y = y1 - y2
		if (Math.abs(_x) > 1 || Math.abs(_y) > 1) {
			return false
		}
		if (endBlock.piece && endBlock.piece.camp === startBlock.piece.camp) {
			return false
		}
		return true
	}
}

const pieceEnum = {
	'p':{
		name:'Pawn',
		move:moves.pawn,
		weight:10
	},
	'r':{
		name:'Rook',
		move:moves.rook,
		weight:50
	},
	'n':{
		name:'Knight',
		move:moves.knight,
		weight:30
	},
	'b':{
		name:'Bishop',
		move:moves.bishop,
		weight:30
	},
	'q':{
		name:'Queen',
		move:moves.queen,
		weight:90
	},
	'k':{
		name:'King',
		move:moves.king,
		weight:900
	},
}

function clearPath(x1, y1, x2, y2, axisMap) {
	if (x1 === x2) {
		const minY = y1 < y2 ? y1 : y2
		const length = Math.abs(y1 - y2)
		for (let i = 1; i < length; i++) {
			if (axisMap[`(${x1},${minY+i})`].piece) {
				return false
			}
		}
		return true
	} else if (y1 === y2) {
		const minX = x1 < x2 ? x1 : x2
		const length = Math.abs(x1 - x2)
		for (let i = 1; i < length; i++) {
			if (axisMap[`(${minX+i},${y1})`].piece) {
				return false
			}
		}
		return true
	} else if (Math.abs(x1 - x2) === Math.abs(y1 - y2)) {
		const minX = x1 < x2 ? x1 : x2
		const minY = y1 < y2 ? y1 : y2
		const length = Math.abs(x1 - x2)
		const x_raise = x1 < x2
		const y_raise = y1 < y2
		for (let i = 1; i < length; i++) {
			if (axisMap[`(${x_raise ? x1+i : x1-i},${y_raise ? y1+i : y1-i})`].piece) {
				return false
			}
		}
		return true
	}
	return false
}

function inBorder(y2, upside) {
	if((!upside && y2 === 4) ||(upside && y2 === 5)){
		return true
	}
	return false
}
