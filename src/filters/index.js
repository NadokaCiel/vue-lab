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

export function date(time) {
	return new Date(time).Format("yyyy-MM-dd hh:mm:ss")
}

function pluralize(time, label) {
	if (time === 1) {
		return time + label + ' '
	}
	return time + label + 's '
}

Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
