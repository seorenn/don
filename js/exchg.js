var config_currencies = [
  { name: 'KRW', desc: '대한민국 원화(Korean Won)', unit: '원', unitprice: 1000 },
  { name: 'USD', desc: '미국 달러화(U.S. Dollar)', unit: '달러', unitprice: 1 },
  { name: 'EUR', desc: '유로화(Euro)', unit: '유로', unitprice: 1 },
  { name: 'JPY', desc: '일본 엔화(Japanese Yen)', unit: '엔', unitprice: 100 },
  { name: 'CNY', desc: '중국 위안화(Chinese Yuan)', unit: '위안', unitprice: 10 }//,
  //{ name: 'RUB', desc: 'Russian Rouble', unitprice: 1 },
  //{ name: 'CAD', desc: 'Canadian Dollar', unitprice: 1 },
  //{ name: 'HKD', desc: 'Hong Kong Dollar', unitprice: 1 },
  //{ name: 'SGD', desc: 'Singapore Dollar', unitprice: 1 },
  //{ name: 'ZWD', desc: 'Zimbabwe Dollar', unitprice: 1 } // Just joke :-p
];

var name_list_of_currencies = function(target) {
  var result = [];

  for (var i=0; i < config_currencies.length; i++) {
    var item = config_currencies[i];
    if (item.name != target) {
      result.push(item.name);
    }
  }

  return result;
};

/*var currencies_cache = {};*/

/*http://query.yahooapis.com/v1/public/yql?q=
 * select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%22
 * USDEUR%22,%20%22USDJPY%22,%20%22USDBGN%22,%20%22USDCZK%22,%20%22USDDKK%22,%20%22USDGBP%22,%20%22USDHUF%22,%20%22USDLTL%22,%20%22USDLVL%22,%20%22USDPLN%22,%20%22USDRON%22,%20%22USDSEK%22,%20%22USDCHF%22,%20%22USDNOK%22,%20%22USDHRK%22,%20%22USDRUB%22,%20%22USDTRY%22,%20%22USDAUD%22,%20%22USDBRL%22,%20%22USDCAD%22,%20%22USDCNY%22,%20%22USDHKD%22,%20%22USDIDR%22,%20%22USDILS%22,%20%22USDINR%22,%20%22USDKRW%22,%20%22USDMXN%22,%20%22USDMYR%22,%20%22USDNZD%22,%20%22USDPHP%22,%20%22USDSGD%22,%20%22USDTHB%22,%20%22USDZAR%22,%20%22USDISK%22%29&env=store://datatables.org/alltableswithkeys*/

/*http://query.yahooapis.com/v1/public/yql?q=
 * select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%22
 * USDEUR%22%2C%20%22USDKRW%22%29&format=json&env=store://datatables.org/alltableswithkeys&callback=*/

var build_yahoo_exchg_url = function(fromlist, totarget) {
  var prefix = 'http://query.yahooapis.com/v1/public/yql?q=';
  var orig = escape('select * from yahoo.finance.xchange where pair in (');
  var curs = '';
  for (var i=0; i < fromlist.length; i++) {
    if (curs.length > 0) {
      curs = curs + ',%20';
    }
    var item = fromlist[i];
    var itemstr = item + totarget;
    curs = curs + '%22' + itemstr + '%22';
  }

  orig = orig + curs + '%29';

  var url = prefix + orig + '&format=json&env=store://datatables.org/alltableswithkeys&callback=';
  return url;
};

var exchg_yahoo_bulk = function(fromlist, totarget, complete) {
  var url = build_yahoo_exchg_url(fromlist, totarget);
  $.ajax({url: url})
  .done(function(data) {
    console.log(data);
    var result = {};

    var query = data.query;
    var count = query.count;
    var results = query.results;
    var ratelist = results.rate;

    for (var i=0; i < count; i++) {
      var rateitem = ratelist[i];
      var keyword = rateitem.id;
      var rate = parseFloat(rateitem.Rate);
      var ask = parseFloat(rateitem.Ask); // ASK Price: 매도율
      var bid = parseFloat(rateitem.Bid); // BID Price: 매입률

      result[keyword] = { rate: rate, ask: ask, bid: bid };
    }
    complete(result);
  });
};

/*
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
*/
