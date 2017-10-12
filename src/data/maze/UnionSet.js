export default class UnionSet {
	constructor(size) {
		this.set = new Array(size)
		for (let i = this.set.length - 1; i >= 0; i--) {
			this.set[i] = -1;
		}
	}

	union(root1, root2) {
		this.set[root1] = root2
	}

	findSet(x) {
		while (this.set[x] >= 0) {
			x = this.set[x]
		}
		return x
	}

	sameSet(x, y) {
		return this.findSet(x) === this.findSet(y)
	}

	unionElement(x, y) {
		this.union(this.findSet(x), this.findSet(y))
	}
}
