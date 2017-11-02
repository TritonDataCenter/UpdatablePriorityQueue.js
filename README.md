# UpdatablePriorityQueue.js : a updatable heap-based priority queue in
JavaScript based on FastPriorityQueue.js

In a priority queue, you can...

- query or remove (poll) the smallest element quickly
- insert elements quickly

In practice, "quickly" often means in logarithmic time (O(log n)).

A heap can be used to implement a priority queue.

In an UpdatablePriorityQueue, you can also lookup/modify the elements
inside the queue (ie you don't have to interact only with the
least-element at the top), at the expense of maintaining some extra
state (a mapping from element -> heap-position). After any updates,
the priority-queue rebalances.

License: Apache License 2.0

Usage
===

```javascript
var x = new UpdatablePriorityQueue();
x.add(1);
x.add(0);
x.add(5);
x.add(4);
x.add(3);
x.peek(); // should return 0, leaves x unchanged
x.size; // should return 5, leaves x unchanged
while(!x.isEmpty()) {
  console.log(x.poll());
} // will print 0 1 3 4 5
x.trim(); // (optional) optimizes memory usage
```

You can also provide the compound object with a functions to
extract key and value


```javascript
var getKey = function (o) { return (o.k); };
var getValue = function (o) { return (o.v); };
var x = new UpdatablePriorityQueue(getKey, getValue);
x.add({'k':'a','v':1,'data':'foo'});
x.add({'k':'b','v':0,'data':'bar'});
x.add({'k':'c','v':5,'data':'baz'});
x.add({'k':'d','v':4,'data':'thud'});
x.add({'k':'e','v':3,'data':'blah'});
while(!x.isEmpty()) {
  console.log(x.poll().data);
} // will print bar foo blah thud baz
```

You can also update and delete the objects in-place

```javascript
var getKey = function (o) { return (o.k); };
var getValue = function (o) { return (o.v); };
var x = new UpdatablePriorityQueue(getKey, getValue);
x.add({'k':'a','v':1,'data':'foo'});
x.add({'k':'b','v':0,'data':'bar'});
x.add({'k':'c','v':5,'data':'baz'});
x.add({'k':'d','v':4,'data':'thud'});
x.add({'k':'e','v':3,'data':'blah'});
x.updateElement('e', {'k':'e','v':7,'data':'last'});
x.deleteElement('d');
while(!x.isEmpty()) {
  console.log(x.poll().data);
} // will print bar foo baz last
```

If you are using node.js, you need to import the module:

```javascript
var UpdatablePriorityQueue = require("updatablepriorityqueue");
var b = new UpdatablePriorityQueue ();// initially empty
b.add(1);// add the value "1"
```

npm install
===

      $ npm install updatablepriorityqueue

Computational complexity
===

The function calls "add" and "poll" have logarithmic complexity with respect
to the size of the data structure (attribute size). Looking at the top value
is a constant time operation. Update should have complexity roughly
equivalent to add.


Testing
===

Using node.js (npm), you can test the code as follows...

      $ npm install mocha
      $ npm test
