export default class Node {
	constructor(index, data, prev, next) {
		this.index = index
		this.data = data
		this.prev = prev
		this.next = next
		return this
	}

	setPrev(node) {
		this.prev = node
	}

	getPrev() {
		return this.prev
	}

	setNext(node) {
		this.next = node
	}

	getNext() {
		return this.next
	}
}
