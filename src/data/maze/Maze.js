import UnionSet from './UnionSet'
export default class Maze {
	constructor(columns, rows) {
		this.columns = columns
		this.rows = rows
		this.cells = columns * rows
		this.linkedMap = {}
		this.unionSets = new UnionSet(this.cells)
	}

	generate() {
		//每次任意取两个相邻的格子，如果它们不在同一个连通集，
		//则拆掉中间的墙，让它们连在一起成为一个连通集
		while (!this.firstLastLinked()) {
			let cellPairs = this.pickRandomCellPairs();
			if (!this.unionSets.sameSet(cellPairs[0], cellPairs[1])) {
				this.unionSets.unionElement(cellPairs[0], cellPairs[1]);
				this.addLinkedMap(cellPairs[0], cellPairs[1]);
			}
		}
	}

	pickRandomCellPairs() {
		let cell = (Math.random() * this.cells) >> 0;
		//再取一个相邻格子，0 = 上，1 = 右，2 = 下，3 = 左
		let neiborCells = [];
		let row = (cell / this.columns) >> 0,
			column = cell % this.rows;
		//不是第一排的有上方的相邻元素
		if (row !== 0) {
			neiborCells.push(cell - this.columns);
		}
		//不是最后一排的有下面的相邻元素
		if (row !== this.rows - 1) {
			neiborCells.push(cell + this.columns);
		}
		if (column !== 0) {
			neiborCells.push(cell - 1);
		}
		if (column !== this.columns - 1) {
			neiborCells.push(cell + 1);
		}
		let index = (Math.random() * neiborCells.length) >> 0;
		return [cell, neiborCells[index]];
	}

	addLinkedMap(x, y) {
		if (!this.linkedMap[x]) this.linkedMap[x] = [];
		if (!this.linkedMap[y]) this.linkedMap[y] = [];
		if (this.linkedMap[x].indexOf(y) < 0) {
			this.linkedMap[x].push(y);
		}
		if (this.linkedMap[y].indexOf(x) < 0) {
			this.linkedMap[y].push(x);
		}
	}
}
