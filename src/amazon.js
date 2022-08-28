const axios = require('axios');
const cheerio = require('cheerio');
const { obfuscatedAxiosGet } = require('./utils/obfuscateAxios.js');
const { amazonUrl } = require('./constants.js');
const { filterUndefined } = require('./utils/filterUndefined.js');


function scrapeProductDataFromAmazonProductPageHTML($) {
	if (!$) {
		// logs price and model number of product
		console.log('generating test product scrape');
		obfuscatedAxiosGet('https://www.amazon.com/GPX-Portable-Top-Loading-Boombox-Device/dp/B007B5QVTG?th=1').then(function(res) {
 			const $ = cheerio.load(res.data);
			const priceElem = $('.a-price-whole')[0];
			price = priceElem.children[0].data;

			let productTitle = $('#productTitle');
			productTitle = productTitle[0].children[0].data.trim();

			let modelNumber;
			$('.prodDetSectionEntry').nextAll('th').prevObject.map(function(index, tableHeader) {
				// run through product detail table until find model number and store
				if(tableHeader && tableHeader.children.length && tableHeader.children[0].data.trim() == 'Item model number') {
					modelNumber = tableHeader.next.next.children[0].data;
				}
				return;
			});

			console.log({test: {title: productTitle, price, modelNumber}});

		}).catch(err => console.error(err));
       
	} else {
		const priceElem = $('.a-price-whole')[0];
		price = priceElem && priceElem.children && priceElem.children[0].data;
		let productTitle = $('#productTitle');
		productTitle = productTitle[0].children[0].data.trim();
		let modelNumber;
		let partNumber;
		let modelName;
		let manufacturer;
		$('.prodDetSectionEntry').nextAll('th').prevObject.map(function(index, tableHeader) {
			// run through product detail table until find model number and store
			// console.log(tableHeader && tableHeader.children.length && tableHeader.children[0].data.trim());

			if (tableHeader && tableHeader.children.length) {
				switch(tableHeader.children[0].data.trim()) {
					case 'Model Name':
						modelName = tableHeader.next.next.children[0].data.trim().slice(1);
						break;
					case 'Part Number':
						partNumber = tableHeader.next.next.children[0].data.trim().slice(1);
						break;
					case 'Item model number':
						modelNumber = tableHeader.next.next.children[0].data.trim();
						break;
					case 'Manufacturer':
						manufacturer = tableHeader.next.next.children[0].data.trim();
						break;
					default:
						break;						
				}
			}
			return;
		});

		return { title: productTitle, price, manufacturer, modelNumber, modelName, partNumber };
	}
}

async function queueScrapeFromAmazonProductLinkArray(links) {
	const batch = {};
	const requests = links.map(function(link, index){
		const url = 'https://www.amazon.com' + link + '?th=1';
		return obfuscatedAxiosGet(url);
	});
	console.log(requests);
	try {
		const responses = await axios.all(requests);
		if (responses.length) {
			responses.map(function(res, index) {
		        const $ = cheerio.load(res.data);
		        batch[links[index]] = scrapeProductDataFromAmazonProductPageHTML($);
			});	
		}
		return batch;
	} catch(e) {
		console.error(e);
		return batch;
	}
}

async function scrapeProductLinksFromAmazonSearchPage() {
	const amazonPageLinks = await obfuscatedAxiosGet(amazonUrl)
	    .then(res => {
	        const $ = cheerio.load(res.data);
	        // fastest way to product link from search page
	        const anchors = $('.s-result-item a img');
	        const matches = [];

	        // filter urls
	        for (let x = 0; x < anchors.length; x++) {
	        	const regex = new RegExp(/\/dp\/([A-Z]|[0-9])*\//);
	        	const link = anchors[x].parent.parent.attribs.href;
	        	if (regex.test(link)) {
					matches.push(link);
	        	}
	        }

			const unique = matches.filter(filterUndefined);
			return unique;
			// '/Tentacles-VHS-John-Huston/dp/B00004YRX5/ref=sr_1_21?keywords=tentacles&qid=1661622142&sr=8-21'
			// '/Tentacles-Cryptid-Hunters-Roland-Smith/dp/0545178169/ref=sr_1_5?keywords=tentacles&qid=1661621242&sr=8-5'
	    }).catch(err => console.error(err));

	return amazonPageLinks;
}


module.exports.scrapeProductLinksFromAmazonSearchPage = scrapeProductLinksFromAmazonSearchPage;
module.exports.queueScrapeFromAmazonProductLinkArray = queueScrapeFromAmazonProductLinkArray;
module.exports.scrapeProductDataFromAmazonProductPageHTML = scrapeProductDataFromAmazonProductPageHTML;
