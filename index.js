const rest = require('restler-bluebird');
const _ = require('lodash');

const Promise = require("bluebird");
const util = require('util');

const templateURL = "https://www.newscientist.com/wp-content/plugins/ns-barrier/ajaxPrices.php\?promCode\=%s\&offerCode\=Q";

const prettyPrint = (offer) => {
	return JSON.stringify(_.pick(
		offer,
		'price2', 'saving2', 'pricestring2', 'promo'
		), null, "\t");
};

const promo = {
	start:8200,
	end: 8202
};
console.log(util.format("Querying promotions %d–%d…", promo.start, promo.end));

Promise.settle(_.map(_.range(promo.start, promo.end), (iterand) => {
	return rest.get(util.format(templateURL, iterand))
	.then((result) => {
		return _.extend({}, JSON.parse(result), {
			promo: iterand
		});
	})
}))
.then((results) => {
	var offers = _.map(
		_.filter(
			results,
			(r) => {
				return r.isFulfilled();
			}),
		(r) => {
			return r.value();
		});
	var lowestPrice2 = _.min(offers, (offer) => {
		return offer.price2.replace(/£/, "");
	});
	var largestSaving2 = _.max(offers, (offer) => {
		return offer.saving2.match(/\d+\.?\d+/, "");
	});

	// console.log(offers);

	console.log("Regarding product 2…");
	if (lowestPrice2 == largestSaving2) {
		console.log("Lowest price and largest saving:");
		console.log(prettyPrint(lowestPrice2));
	} else {
		console.log("Lowest price:");
		console.log(prettyPrint(lowestPrice2));
		console.log("Largest saving:");
		console.log(prettyPrint(largestSaving2));
	}
})
.done();

// sample quotes:
/*
[
	{
		"price1": "£29.00",
		"price2": "£44.00",
		"price3": "£54.00",
		"price4": "0.00",
		"saving1": "Save 41%",
		"saving2": "Save 11%",
		"saving3": "Save 45%",
		"pricestring1": "12 issues for £29.00",
		"pricestring2": "12 issues for £44.00",
		"pricestring3": "12 issues for £54.00",
		"pricestring4": "1 Month for 0.00",
		"promChange1": null,
		"promChange2": null,
		"promChange3": null,
		"promChange4": "8200"
	},
	{
		"price1": "£99.00",
		"price2": "£149.00",
		"price3": "£189.00",
		"price4": "0.00",
		"saving1": "Save 50%",
		"saving2": "Save 25%",
		"saving3": "Save 52%",
		"pricestring1": "51 Issues for £99.00",
		"pricestring2": "51 Issues for £149.00",
		"pricestring3": "51 Issues for £189.00",
		"pricestring4": "1 Month for 0.00",
		"promChange1": null,
		"promChange2": null,
		"promChange3": null,
		"promChange4": "8201"
	}
]
*/