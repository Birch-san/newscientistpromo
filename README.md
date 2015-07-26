# New Scientist Crafty Consumer
## Story time
### Motivation
I remembered I like reading magazines, so I bought a magazine.

I decided I might like to read magazines on a regular basis.

### Pique
New Scientist had 3 inserts in their magazine, advertising subscriptions. These promotions varied in price, saving, and the number of issues offered.

The deeplinks proposed in these printed inserts were addresses like (spot the obvious pattern):

- `newscientist.com/8202`
- `newscientist.com/8204`

These addresses didn't lead to anywhere meaningful, but bore resemblance to their pricing page for new subscribers:

`https://www.newscientist.com/subscribe-header/?promCode=8068&packageCodes=TPA&offerCode=Q&intcmp=SUBS-header-beta`

Note the `promCode=8068`.

On such a [sample price page](https://www.newscientist.com/subscribe-header/?promCode=8200&packageCodes=TPA&offerCode=Q&intcmp=SUBS-header-beta) of theirs, it is evident that the product which most cheaply confers one the printed magazine is Product 2 (Print + Web).

I noticed that the prices loaded in asynchronously after the initial page was built server-side; 
they have a public-facing quotes API for checking the prices of their promotions.

### Epiphany

Let's ask this quotes API what promotions exist~

The quotes API is a trivial GET:

`https://www.newscientist.com/wp-content/plugins/ns-barrier/ajaxPrices.php?promCode=8068&offerCode=Q`

It gives output like this:

```json
{
   "price1":"£329.00",
   "price2":"£344.00",
   "price3":"£354.00",
   "price4":"0.00",
   "saving1":"Save 41%",
   "saving2":"Save 11%",
   "saving3":"Save 45%",
   "pricestring1":"12 issues for £329.00",
   "pricestring2":"12 issues for £344.00",
   "pricestring3":"12 issues for £354.00",
   "pricestring4":"1 Month for 0.00",
   "promChange1":null,
   "promChange2":null,
   "promChange3":null,
   "promChange4":"8068"
}
```

`price2` is the offer for Product 2, (Print + Web).

We can query for a variety of quotes, and look for the cheapest.

### Result

Here is sample output from my Node program:

```
Querying promotions 8200–8210…
Regarding product 2…
Lowest price:
{
	"price2": "£44.00",
	"saving2": "Save 11%",
	"pricestring2": "12 issues for £44.00"
}
Largest saving:
{
	"price2": "£149.00",
	"saving2": "Save 25%",
	"pricestring2": "51 Issues for £149.00"
}
```

nice~

## Development
### Installation

Obviously clone this repo

Install dependencies by running `npm install` on this folder.

### Running

Then run the program using `node --harmony index.js`.

You can create a Sublime Text build system like so:

```
{   
  "cmd": ["/usr/local/bin/node", "--harmony", "$file"],   
  "selector": "source.js"   
}
```

### License
whatever

¯\\\_(ツ)\_/¯