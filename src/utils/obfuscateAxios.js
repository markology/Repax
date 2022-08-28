const axios = require('axios');
const cheerio = require('cheerio');
const { userAgent } = require('./../constants');
let toggleUserAgent = false;

let ip_addresses = [];
let port_numbers = [];

let random_number = Math.floor(Math.random() * 100);

// function proxies() {
// 	return axios.get("https://sslproxies.org/").then(function(response) {
// 		// console.log(response)
// 		if (response.status == 200) {
// 			const $ = cheerio.load(response.data);

// 			$("td:nth-child(1)").each(function(index, value) {
// 				ip_addresses[index] = $(this).text();
// 			});

// 			$("td:nth-child(2)").each(function(index, value) {
// 				port_numbers[index] = $(this).text();
// 			});
// 		} else {
// 			console.log("Error loading proxy, please try again");
// 		}

// 		ip_addresses.join(", ");
// 		port_numbers.join(", ");

// 		// console.log("IP Addresses:", ip_addresses);
// 		// console.log("Port Numbers:", port_numbers);
// 		// console.log(ip_addresses[random_number]);
// 		// console.log(port_numbers[random_number]);
// 		// console.log('http://' + ip_addresses[0 ] + ':' + port_numbers[random_number])
// 	});
// };

// proxies();

module.exports.obfuscatedAxiosGet = function(url) {
	// toggleUserAgent = !toggleUserAgent;
	// if (toggleUserAgent) 
	// const proxy = 'https://' + ip_addresses[0] + ':' + port_numbers[0];
	// const proxy = {
	// 	host: ip_addresses[2],
	// 	port: port_numbers[2]
	// };
	// console.log(proxy);
	const headers = {headers: userAgent};
	// if (ip_addresses.length) headers.proxy = proxy;
	// return axios.get(url, headers);
	// else 
	return axios.get(url);
};

