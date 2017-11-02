/* This script expects node.js  and mocha */

'use strict';

describe('UpdatablePriorityQueue', function() {
  var UpdatablePriorityQueue = require('../UpdatablePriorityQueue.js');
  var seed = 1;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  it('example1', function() {
    var x = new UpdatablePriorityQueue();
    x.add(1);
    x.add(0);
    x.add(5);
    x.add(4);
    x.add(3);
    if (x.poll() != 0) throw 'bug';
    if (x.poll() != 1) throw 'bug';
    if (x.poll() != 3) throw 'bug';
    if (x.poll() != 4) throw 'bug';
    if (x.poll() != 5) throw 'bug';
  });

  it('compoundObj', function() {
    var x = new UpdatablePriorityQueue(
       function (o) { return (o.k); },
       function (o) { return (o.v); });
    x.add({'k':'a', 'v':1});
    x.add({'k':'b', 'v':0});
    x.add({'k':'c', 'v':5});
    x.add({'k':'d', 'v':4});
    x.add({'k':'e', 'v':3});
    if (x.poll().k != 'b') throw 'bug';
    if (x.poll().k != 'a') throw 'bug';
    if (x.poll().k != 'e') throw 'bug';
    if (x.poll().k != 'd') throw 'bug';
    if (x.poll().k != 'c') throw 'bug';
  });

  it('compoundObjUpdate', function() {
    var x = new UpdatablePriorityQueue(
       function (o) { return (o.k); },
       function (o) { return (o.v); });
    x.add({'k':'a', 'v':1});
    x.add({'k':'b', 'v':0});
    x.add({'k':'c', 'v':5});
    x.add({'k':'d', 'v':4});
    x.add({'k':'e', 'v':3});
    x.updateElement('c', {'k':'c', 'v':2});
    if (x.poll().k != 'b') throw 'bug';
    if (x.poll().k != 'a') throw 'bug';
    if (x.poll().k != 'c') throw 'bug';
    if (x.poll().k != 'e') throw 'bug';
    if (x.poll().k != 'd') throw 'bug';
  });

  it('compoundObjUpdateWithData', function() {
    var x = new UpdatablePriorityQueue(
       function (o) { return (o.k); },
       function (o) { return (o.v); });
    x.add({'k':'a','v':1,'data':'foo'});
    x.add({'k':'b','v':0,'data':'bar'});
    x.add({'k':'c','v':5,'data':'baz'});
    x.add({'k':'d','v':4,'data':'thud'});
    x.add({'k':'e','v':3,'data':'blah'});
    x.updateElement('e', {'k':'e','v':7,'data':'last'});
    if (x.poll().data != 'bar') throw 'bug';
    if (x.poll().data != 'foo') throw 'bug';
    if (x.poll().data != 'thud') throw 'bug';
    if (x.poll().data != 'baz') throw 'bug';
    if (x.poll().data != 'last') throw 'bug';
  });

  it('compoundObjDelete', function() {
    var x = new UpdatablePriorityQueue(
       function (o) { return (o.k); },
       function (o) { return (o.v); });
    x.add({'k':'a', 'v':1});
    x.add({'k':'b', 'v':0});
    x.add({'k':'c', 'v':5});
    x.add({'k':'d', 'v':4});
    x.add({'k':'e', 'v':3});
    x.updateElement('c', {'k':'c', 'v':2});
    x.deleteElement('b');
    if (x.poll().k != 'a') throw 'bug';
    if (x.poll().k != 'c') throw 'bug';
    if (x.poll().k != 'e') throw 'bug';
    if (x.poll().k != 'd') throw 'bug';
  });

  it('Random', function() {
    for (var ti = 0; ti < 100; ti++) {
      var b = new UpdatablePriorityQueue();
      var N = 1024 + ti;
      for (var i = 0; i < N; ++i) {
        b.add(Math.floor((random() * 1000000) + 1));
      }
      var v = 0;
      while (!b.isEmpty()) {
        var nv = b.poll();
        if (nv < v) throw 'bug';
        v = nv;
      }
    }
  });
  it('RandomArray', function() {
    for (var ti = 0; ti < 100; ti++) {
      var b = new UpdatablePriorityQueue();
      var array = new Array();
      var N = 1024 + ti;
      for (var i = 0; i < N; ++i) {
        var val  = Math.floor((random() * 1000000) + 1);
        b.add(val);
        array.push(val);
      }
      array.sort(function(a, b) {
        return b - a;
      });
      while (!b.isEmpty()) {
        var nv = b.poll();
        var nx = array.pop();
        if (nv != nx) throw 'bug';
      }
    }
  });
  it('RandomArrayEnDe', function() {
    for (var ti = 0; ti < 100; ti++) {
      var b = new UpdatablePriorityQueue();
      var array = new Array();
      var N = 16 + ti;
      for (var i = 0; i < N; ++i) {
        var val  = Math.floor((random() * 1000000) + 1);
        b.add(val);
        array.push(val);
      }
      array.sort(function(a, b) {
        return b - a;
      });
      for (var j = 0; j < 1000; ++j) {
        var nv = b.poll();
        var nx = array.pop();
        if (nv != nx) throw 'bug';
        var val  = Math.floor((random() * 1000000) + 1);
        b.add(val);
        array.push(val);
        array.sort(function(a, b) {
          return b - a;
        });
      }
    }
  });

});
