function generate(height = 10, width = 10) {
	const graph = []
	for (let i = 0; i < height; i++) {
		const row = []
		for (let j = 0; j < width; j++) {
			let alpha = Math.random() < 0.5 ? 1 : 0
			row.push(alpha)
		}
		graph.push(row)
	}
	JSON.parse(JSON.stringify(graph)).reverse().forEach(row => {
		console.log(row.join(' '))
	})
	return graph
}

function dig(x, y, path) {
      if (pathMap[`(${x},${y})`] || x >= width || x < 0 || y >= height || routeMap[y][x] == 0) {
        path.length > 0 && !pathMap[path.join('|')] ? pathArr.push(path) : ''
        pathMap[path.join('|')] = true
        return
      }
      pathMap[`(${x},${y})`] = true
      const n_path = JSON.parse(JSON.stringify(path))
      n_path.push([x,y])
      dig(x, y + 1, n_path)
      dig(x - 1, y, n_path)
      dig(x + 1, y, n_path)
    }

const height = 10
const width = 10
const routeMap = generate(height, width)
const pathMap = {}
const pathArr = []
routeMap[0].forEach((start, i) => {
	dig(i, 0, [])
})
pathArr.forEach(path => {
	console.log(path.join('|'))
})