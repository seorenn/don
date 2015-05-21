var currencies = [
  { name: 'KRW', desc: 'Korean Won' },
  { name: 'USD', desc: 'U.S. Dollar' },
  { name: 'EUR', desc: 'Euro' },
  { name: 'JPY', desc: 'Japanese Yen' },
  { name: 'CNY', desc: 'Chinese Yuan' },
  { name: 'RUB', desc: 'Russian Rouble' },
  { name: 'CAD', desc: 'Canadian Dollar' },
  { name: 'HKD', desc: 'Hong Kong Dollar' },
  { name: 'SGD', desc: 'Singapore Dollar' },
  { name: 'ZWD', desc: 'Zimbabwe Dollar' } // Just joke :-p
];

var exchg_yahoo = function(from, to, complete) {
  var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22'
          + from
          + to
          + '%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=';
  $.ajax({url: url})
  .done(function(data) {
    var rate = data['query']['results']['rate']['Rate']
    complete(rate);
  });
};

var exchg_wsx = function(from, to, complete) {
  var url = 'http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=' + from + '&ToCurrency=' + to;
  // TODO: Implement if needed...
};

var exchg = function(from, to, complete) {
  // select function context
  exchg_yahoo(from, to, complete);
};
