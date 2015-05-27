var currencies = [
  { name: 'KRW', desc: 'Korean Won', unitprice: 1000 },
  { name: 'USD', desc: 'U.S. Dollar', unitprice: 1 },
  { name: 'EUR', desc: 'Euro', unitprice: 1 },
  { name: 'JPY', desc: 'Japanese Yen', unitprice: 100 },
  { name: 'CNY', desc: 'Chinese Yuan', unitprice: 10 }//,
  //{ name: 'RUB', desc: 'Russian Rouble', unitprice: 1 },
  //{ name: 'CAD', desc: 'Canadian Dollar', unitprice: 1 },
  //{ name: 'HKD', desc: 'Hong Kong Dollar', unitprice: 1 },
  //{ name: 'SGD', desc: 'Singapore Dollar', unitprice: 1 },
  //{ name: 'ZWD', desc: 'Zimbabwe Dollar', unitprice: 1 } // Just joke :-p
];

var currencies_cache = {};

var exchg_yahoo = function(from, to, complete) {
  if (to in currencies_cache && from in currencies_cache[to]) {
    console.log('Found ' + from + ' data from cookie. Skipping Request...');
    complete(currencies_cache[to][from]);
    return;
  }

  var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22'
          + from
          + to
          + '%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=';
  $.ajax({url: url})
  .done(function(data) {
    var rate = data['query']['results']['rate']['Rate']
    var to_object = currencies_cache[to];
    if (!to_object || Object.keys(to_object).length <= 0) {
      currencies_cache[to] = {};
    }
    currencies_cache[to][from] = rate;
    complete(rate);
  });
};

var exchg_wsx = function(from, to, complete) {
  if (to in currencies_cache && from in currencies_cache[to]) {
    complete(currencies_cache[from]);
    return;
  }

  var url = 'http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=' + from + '&ToCurrency=' + to;
  // TODO: Implement if needed...
};

var exchg = function(from, to, complete) {
  // select function context
  exchg_yahoo(from, to, complete);
};
