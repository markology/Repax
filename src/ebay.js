const axios = require('axios');
const cheerio = require('cheerio');
const { obfuscatedAxiosGet } = require('./utils/obfuscateAxios.js');
const { ebayUrl } = require('./constants.js');
const { filterUndefined } = require('./utils/filterUndefined.js');

async function scrapeProductLinksFromEbaySearchPage() {
	const amazonPageLinks = await obfuscatedAxiosGet(ebayUrl).then(function(res) {
		const $ = cheerio.load(res.data);
		const regexp = new RegExp(/https:\/\/www.ebay.com\/itm\/[0-9]*/);
		const matches = [];
		$('.s-item__link').map(function(x, y){
			const href = regexp.exec(y.attribs.href) && regexp.exec(y.attribs.href)[0];
			if (href) {
				matches.push(href);
			}
		})

		return matches;

	}).catch(err => console.error(err));

	return amazonPageLinks;
}

function scrapeProductDataFromEbayProductPageHTML($) {
	console.log('in here');
	if (!$) {
		// logs price and model number of product
		console.log('generating test product scrape');
		obfuscatedAxiosGet('https://www.ebay.com/itm/363230126234').then(
			function(response) {
				const $ = cheerio.load(response.data);
				console.log($);
				const price = $('#prcIsum')[0].attribs.content;
				let upc;

				const spans = $('#viTabs_0_is .ux-textspans');
				for (let x = 0; x < spans.length; x++ ) {
					const children = spans[x].children;

					for (let y = 0; y < children.length; y++) {
						if(children[y].type === 'text') {
							if(children[y].data === 'UPC:') {
								upc = spans[x + 1].children[1].data;

								// EXIT
								y = 1000;
								x = 1000;
								break;
							}
						}
					}
				}

				console.log({price, upc});
			}
		).catch(e => console.error(e));
	} else {
		console.log('here');
		let price; 
		const priceElem = $('#prcIsum');
		price = priceElem[0].attribs.content;
		
		console.log(price);
		
		let upc;
		let manufacturer;
		const spans = $('#viTabs_0_is .ux-textspans');
		for (let x = 0; x < spans.length; x++ ) {
			const children = spans[x].children;

			for (let y = 0; y < children.length; y++) {
				if(children[y].type === 'text') {
					if (children[y].data === 'UPC:') {
						upc = spans[x + 1].children[1].data;
						y = 1000;
						x = 1000;
						break;
					}
					if (children[y].data === 'Manufacturer:') {
						manufacturer = spans[x + 1].children[1].data;
						y = 1000;
						x = 1000;
						break;
					}
				}
			}
		}
		return {price, upc, manufacturer};
	}
}

async function queueScrapeFromEbayProductLinkArray(links) {
	const batch = {};
	const requests = links
		.filter(link => !!link)
		.map(function(link) {
			return obfuscatedAxiosGet(link).then(function(response){
				console.log(response.status)
		        const $ = cheerio.load(response.data);					
   		 		batch[link] = scrapeProductDataFromEbayProductPageHTML($);
   		 		console.log(batch)
			}).catch(e => console.log(e));
		}
	);
}

module.exports.scrapeProductLinksFromEbaySearchPage = scrapeProductLinksFromEbaySearchPage;
module.exports.queueScrapeFromEbayProductLinkArray = queueScrapeFromEbayProductLinkArray;
module.exports.scrapeProductDataFromEbayProductPageHTML = scrapeProductDataFromEbayProductPageHTML;
