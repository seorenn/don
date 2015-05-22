var currencies = [
  { name: 'KRW', desc: 'Korean Won' },
  { name: 'USD', desc: 'U.S. Dollar' },
  { name: 'EUR', desc: 'Euro' },
  { name: 'JPY', desc: 'Japanese Yen' },
  { name: 'CNY', desc: 'Chinese Yuan' },
  //{ name: 'RUB', desc: 'Russian Rouble' },
  //{ name: 'CAD', desc: 'Canadian Dollar' },
  //{ name: 'HKD', desc: 'Hong Kong Dollar' },
  //{ name: 'SGD', desc: 'Singapore Dollar' },
  //{ name: 'ZWD', desc: 'Zimbabwe Dollar' } // Just joke :-p
];

var currencies_cache = {};

var exchg_yahoo = function(from, to, complete) {
  if (from in currencies_cache) {
    complete(currencies_cache[from]);
    return;
  }

  var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22'
          + from
          + to
          + '%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=';
  $.ajax({url: url})
  .done(function(data) {
    var rate = data['query']['results']['rate']['Rate']
    currencies_cache[from] = rate;
    complete(rate);
  });
};

var exchg_wsx = function(from, to, complete) {
  if (from in currencies_cache) {
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
