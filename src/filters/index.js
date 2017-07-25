export function timeAgo(time) {
	const between = Date.now() / 1000 - Number(time)
	if (between < 3600) {
		return pluralize(~~(between / 60), ' minute')
	} else if (between < 86400) {
		return pluralize(~~(between / 3600), ' hour')
	} else {
		return pluralize(~~(between / 86400), ' day')
	}
}

export function timeNormalize(time) {
	const between = Number(time) / 1000
	if (between < 60) {
		return ~~(between) + ' s '
	} else if (between < 3600) {
		return pluralize(~~(between / 60), ' minute') + timeNormalize(between % 60 * 1000)
	} else if (between < 86400) {
		return pluralize(~~(between / 3600), ' hour') + timeNormalize(between % 3600 * 1000)
	} else {
		return pluralize(~~(between / 86400), ' day') + timeNormalize(between % 86400 * 1000)
	}
}

function pluralize(time, label) {
	if (time === 1) {
		return time + label + ' '
	}
	return time + label + 's '
}