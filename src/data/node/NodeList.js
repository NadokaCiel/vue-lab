import Node from './Node'

export default class NodeList {
	constructor(arr = []) {
		this.setList(arr)
		return this
	}

	setList(arr = []) {
		this.nodes = []
		arr.forEach((d, i) => {
			this.nodes.push(new Node(i, d))
		})
		this.cycleChain()
	}

	cycleChain() {
		this.head = this.nodes[0] ? this.nodes[0] : null
		this.nodes.forEach((n, i) => {
			i == 0 ? n.prev = this.nodes[this.nodes.length - 1] : n.prev = this.nodes[i - 1]
			i == this.nodes.length - 1 ? n.next = this.nodes[0] : n.next = this.nodes[i + 1]
		})
	}

	isEmpty() {
		return Boolean(this.head)
	}
}
