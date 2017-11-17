/**
 * UpdatablePriorityQueue.js : a fast heap-based priority queue  in JavaScript.
 * (c) the authors
 * Licensed under the Apache License, Version 2.0.
 *
 * heap-based priority queue for modern browsers and JavaScript engines,
 * supporting updates.
 * Based on FastPriorityQueue: https://github.com/lemire/FastPriorityQueue.js
 *
 * Usage :
 *       Installation (in shell, if you use node):
 *       $ npm install updatablepriorityqueue
 *
 *       Running test program (in JavaScript):
 *
 *       // in node:
 *       // var UpdatablePriorityQueue = require('updatablepriorityqueue');
 *       var x = new UpdatablePriorityQueue();
 *       x.add(1);
 *       x.add(0);
 *       x.add(5);
 *       x.add(4);
 *       x.add(3);
 *       x.peek(); // should return 0, leaves x unchanged
 *       x.size; // should return 5, leaves x unchanged
 *       while(!x.isEmpty()) {
 *         console.log(x.poll());
 *       } // will print 0 1 3 4 5
 *       x.trim(); // (optional) optimizes memory usage
 */

var assert = require('assert-plus');

'use strict';

var defaultidentity = function (a) {
    return (a);
}

var defaultpriority = function (a) {
    return (a);
}

/*
 * Either provide two arguments, or none.
 *
 * The arguments are used to pick apart compound objects. Our
 * heap is arranged by priority. And the objects are arranged
 * by identity.
 */
function UpdatablePriorityQueue(identity, priority) {
    assert.ok(arguments.length == 0 || arguments.length == 2)
    if (!(this instanceof UpdatablePriorityQueue))
        return (new UpdatablePriorityQueue(identity, priority));
    this.array = [];
    this.lookup = {};
    this.size = 0;
    this.identity = identity || defaultidentity;
    this.priority = priority || defaultpriority;
    this.compare = function (a, b) {
        return (this.priority(a) < this.priority(b));
    };
}


// Add an element the the queue
// runs in O(log n) time
UpdatablePriorityQueue.prototype.add = function (myval) {
    var i = this.size;
    this.array[this.size] = myval;
    this.size += 1;
    var p;
    var ap;
    while (i > 0) {
        p = (i - 1) >> 1;
        ap = this.array[p];
        if (!this.compare(myval, ap)) {
             break;
        }
        this.array[i] = ap;
        this.lookup[this.identity(ap)] = i;
        i = p;
    }
    this.array[i] = myval;
    this.lookup[this.identity(myval)] = i;
};

// replace the content of the heap by provided array and "heapifies it"
UpdatablePriorityQueue.prototype.heapify = function (arr) {
    this.array = arr;
    this.size = arr.length;
    var i;
    for (i = (this.size >> 1); i >= 0; i--) {
        this._percolateDown(i);
    }
};

// for internal use
UpdatablePriorityQueue.prototype._percolateUp = function (i) {
    var myval = this.array[i];
    var p;
    var ap;
    while (i > 0) {
        p = (i - 1) >> 1;
        ap = this.array[p];
        if (!this.compare(myval, ap)) {
            break;
        }
        this.array[i] = ap;
        this.lookup[this.identity(ap)] = i;
        i = p;
    }
    this.array[i] = myval;
    this.lookup[this.identity(myval)] = i;
};


// for internal use
UpdatablePriorityQueue.prototype._percolateDown = function (i) {
    var size = this.size;
    var hsize = this.size >>> 1;
    var ai = this.array[i];
    var l;
    var r;
    var bestc;
    while (i < hsize) {
        l = (i << 1) + 1;
        r = l + 1;
        bestc = this.array[l];
        if (r < size) {
            if (this.compare(this.array[r], bestc)) {
                l = r;
                bestc = this.array[r];
            }
        }
        if (!this.compare(bestc, ai)) {
            break;
        }
        this.array[i] = bestc;
        this.lookup[this.identity(bestc)] = i;
        i = l;
    }
    this.array[i] = ai;
    this.lookup[this.identity(ai)] = i;
};

// Look at the top of the queue (a smallest element)
// executes in constant time
//
// Calling peek on an empty priority queue returns
// the "undefined" value.
// JSSTYLED
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
//
UpdatablePriorityQueue.prototype.peek = function () {
    if (this.size == 0)
       return (undefined);
    else
       return (this.array[0]);
};

// remove the element on top of the heap (a smallest element)
// runs in logarithmic time
//
// If the priority queue is empty, the function returns the
// "undefined" value.
// JSSTYLED
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/undefined
//
// For long-running and large priority queues, or priority queues
// storing large objects, you may  want to call the trim function
// at strategic times to recover allocated memory.
UpdatablePriorityQueue.prototype.poll = function () {
    if (this.size == 0)
        return (undefined);
    var ans = this.array[0];
    if (this.size > 1) {
        this.array[0] = this.array[--this.size];
        this._percolateDown(0 | 0);
    } else {
        this.size -= 1;
    }
    delete this.lookup[this.identity(ans)];
    return (ans);
};


// This function adds the provided value to the heap, while removing
//  and returning the peek value (like poll). The size of the priority
// thus remains unchanged.
UpdatablePriorityQueue.prototype.replaceTop = function (myval) {
    if (this.size == 0)
        return (undefined);
    var ans = this.array[0];
    delete this.lookup[this.identity(ans)];
    this.array[0] = myval;
    this.lookup[this.identity(myval)] = 0;
    this._percolateDown(0 | 0);
    return (ans);
};

// Get the entry by key.
UpdatablePriorityQueue.prototype.getElement = function (k) {
    var index = this.lookup[k];
    return (this.priority(this.array[index]));
};

// Update the entry by key, returns old value
UpdatablePriorityQueue.prototype.updateElement = function (k, v) {
    var index = this.lookup[k];
    var ans = this.array[index];
    delete this.lookup[this.identity(ans)];
    this.array[index] = v;
    this.lookup[v] = index;

    // re-establish the heap invariant
    if (this.compare(v, ans))
       this._percolateUp(index);
    else
       this._percolateDown(index);
    return (ans);
};

// Delete an entry by key, returns old value
UpdatablePriorityQueue.prototype.deleteElement = function (k) {
    if (!this.lookup.hasOwnProperty(k)) {
       return (undefined);
    }

    var index = this.lookup[k];
    var ans = this.array[index];
    delete this.lookup[this.identity(ans)];

    /*
     * we may have array.length != size, to avoid
     * two calls to splice, we move our deleted
     * element to the end, and trim appropriately.
     */
    this.array[index] = this.array[this.size - 1]
    this.size -= 1;
    this.trim();

    // re-establish the heap invariant
    this.heapify(this.array);

    // return deleted element
    return (ans);
};

// recover unused memory (for long-running priority queues)
UpdatablePriorityQueue.prototype.trim = function () {
    this.array = this.array.slice(0, this.size);
};

// Check whether the heap is empty
UpdatablePriorityQueue.prototype.isEmpty = function () {
    return (this.size === 0);
};

// just for illustration purposes
var main = function () {
    // main code
    var x = new UpdatablePriorityQueue();
    x.add(1);
    x.add(0);
    x.add(5);
    x.add(4);
    x.add(3);
    while (!x.isEmpty()) {
        console.log(x.poll());
    }
};

if (require.main === module) {
    main();
}

module.exports = UpdatablePriorityQueue;
