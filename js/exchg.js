/**
 * Authorized by Seorenn <hirenn@gmail.com>
 */

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
