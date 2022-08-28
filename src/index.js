const { scrapeProductDataFromAmazonProductPageHTML, scrapeProductLinksFromAmazonSearchPage, queueScrapeFromAmazonProductLinkArray } = require('./amazon.js');
const { scrapeProductDataFromEbayProductPageHTML, scrapeProductLinksFromEbaySearchPage, queueScrapeFromEbayProductLinkArray } = require('./ebay.js');
const { testEbayLinks } = require('./constants');
const json2xls = require('json2xls');
const fs = require('fs');

async function scrapeAmazon() {
	const links = await scrapeProductLinksFromAmazonSearchPage();
	console.log(links);
	if (links.length) {
		const batch = await queueScrapeFromAmazonProductLinkArray(links);
		return batch;
	}
}

async function scrapeEbay() {
	const links = await scrapeProductLinksFromEbaySearchPage();
	console.log(links);
	if (links && links.length) {
		const batch = await queueScrapeFromEbayProductLinkArray(links);
		return batch;
	} else {
		const batch = await queueScrapeFromEbayProductLinkArray(testEbayLinks);
		return batch;
	}
}

async function main() {
	const amazonBatch = await scrapeAmazon();
	console.log('++++++');
	console.log(amazonBatch);
	console.log('++++++');
// const ebayData = {
//   'https://www.ebay.com/itm/284416384809': { price: '13.75', upc: undefined, manufacturer: undefined },
//   'https://www.ebay.com/itm/203484977195': { price: '0.99', upc: undefined, manufacturer: 'Upper Deck' },
//   'https://www.ebay.com/itm/185506941255': { price: '5.99', upc: undefined, manufacturer: 'POKEMON' },
//   'https://www.ebay.com/itm/115496135367': { price: '3.99', upc: undefined, manufacturer: undefined },
//   'https://www.ebay.com/itm/232699010461': { price: '19.95', upc: 'does not apply', manufacturer: undefined },
//   'https://www.ebay.com/itm/165504923603': { price: '2.99', upc: undefined, manufacturer: 'Nintendo' },
//   'https://www.ebay.com/itm/284924027710': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/324809564145': {
//     price: '1.6',
//     upc: undefined,
//     manufacturer: 'Wizards of the Coast'
//   },
//   'https://www.ebay.com/itm/275414018675': { price: '0.99', upc: undefined, manufacturer: 'Bowman' },
//   'https://www.ebay.com/itm/202957713140': { price: '1.0', upc: undefined, manufacturer: undefined },
//   'https://www.ebay.com/itm/265771216386': { price: '0.99', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/225120335426': { price: '0.99', upc: undefined, manufacturer: 'Bowman' },
//   'https://www.ebay.com/itm/115425628587': { price: '1.29', upc: undefined, manufacturer: 'Bowman' },
//   'https://www.ebay.com/itm/115483440795': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/155122494416': { price: '0.99', upc: undefined, manufacturer: "McDonald's" },
//   'https://www.ebay.com/itm/133611151210': { price: '1.0', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/185410037812': { price: '0.99', upc: undefined, manufacturer: 'Bowman' },
//   'https://www.ebay.com/itm/134040117684': { price: '5.99', upc: undefined, manufacturer: undefined },
//   'https://www.ebay.com/itm/234601712067': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/284902932971': { price: '1.5', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/144695161377': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/165640959168': { price: '1.0', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/234658846555': { price: '0.99', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/125462200673': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/194999040085': { price: '0.99', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/225126161461': { price: '1.49', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/164757998948': { price: '0.99', upc: undefined, manufacturer: "McDonald's" },
//   'https://www.ebay.com/itm/234633297768': { price: '1.0', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/165643033488': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/224433293797': { price: '0.99', upc: undefined, manufacturer: 'NBA Hoops' },
//   'https://www.ebay.com/itm/115474960714': { price: '0.99', upc: undefined, manufacturer: 'Panini' },
//   'https://www.ebay.com/itm/255534396236': { price: '1.0', upc: undefined, manufacturer: 'Topps' },
//   'https://www.ebay.com/itm/175348613608': { price: '0.99', upc: undefined, manufacturer: 'Parkside' },
//   'https://www.ebay.com/itm/353430718730': { price: '0.99', upc: undefined, manufacturer: 'Wizards of the Coast' },
//   'https://www.ebay.com/itm/223477023752': { price: '0.99', upc: undefined, manufacturer: 'Topps' }};

  	const amazonLinks = Object.keys(amazonBatch).map(link => {
  		const amazonLink = amazonBatch[link];
  		return {
  			['Title']: amazonLink.title,
	  		['URL']: link, 
	  		['Price']: amazonLink.price, 
	  		['Model Name']: amazonLink.modelName, 
	  		['Model Number']: amazonLink.modelNumber, 
	  		['Part Number']: amazonLink.partNumber,
	  		['Manufacturer']: amazonLink.manufacturer
	  	};
	  });
	const amazonXls = json2xls(amazonLinks);
	fs.writeFileSync(
		new Date()
			.toString()
			.replaceAll(' ', '')
			.replaceAll(')', '')
			.replaceAll('(', '')
			.replaceAll(':', '') + '-amazon.xlsx', amazonXls, 'binary');

	// const ebayBatch = await scrapeEbay();
	// console.log('++++++');
	// console.log(ebayBatch);
	// console.log('++++++');

	// const ebayXls = json2xls(amazonBatch);
	// fs.writeFileSync('ebay.xlsx', ebayXls, 'binary');
}

// prod task
// setTimeout(main, 3000);
main();
// scrapeAmazon();

// dev amazon
// scrapeProductDataFromAmazonProductPageHTML();

// dev ebay
// scrapeProductDataFromEbayProductPageHTML();
// proxies();