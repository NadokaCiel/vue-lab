import axios from 'axios'

export function ajax(method, url, payload, successFunc, errorFunc) {
	if (!axios[method]) {
		errorFunc()
		throw new Error('不支持的请求类型');
	}
	payload = payload || {}
	if (method == 'get') {
		url = getUrl(url, payload)
	}
	return axios[method](url, payload).then(response => {
		const data = response.data
		if (data.status == "success") {
			successFunc && successFunc(data.data)
		} else {
			errorFunc && errorFunc(data)
		}
	}).catch(error => {
		console.log(error);
		errorFunc && errorFunc(error)
	});
}

function getUrl(url, payload) {
	let query = []
	let queryString = ""
	Object.keys(payload).forEach(k => {
		query.push(k + "=" + payload[k])
	})
	query.length>0?queryString="?"+query.join('&'):''
	return url + queryString
}
