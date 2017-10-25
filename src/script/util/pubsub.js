/**
 * Event callback table
 * @type {Object}
 */
var table = {};

function type(v) {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    var t = Object.prototype.toString.call(v);
    return t.substring('[object '.length, t.length - 1).toLowerCase();
}

function findCallback(eventId, callback) {
    if (type(callback) !== 'function') return -3;
    if (!table[eventId]) return -2;
    for (var i = 0, len = table[eventId].length; i < len; i++) {
        var item = table[eventId][i];
        if (type(item) === 'object') item = item.callback;
        if (item === callback) return i;
    }
    return -1;
}

/**
 * On event
 * @param eventId
 * @param callback
 * @param once
 */
var pOn = function (eventId, callback, once) {
    if (type(callback) !== 'function') return;
    if (!table[eventId]) table[eventId] = [];
    table[eventId].push(once ? {
        callback: callback,
        once: true
    } : callback);
};

/**
 * Off event
 * @param eventId
 * @param callback
 */
var pOff = function (eventId, callback) {
    if (type(callback) !== 'function') return;
    if (!table[eventId]) return;
    var p = findCallback(eventId, callback);
    if (p < 0) return;
    table[eventId].splice(p, 1);
};

/**
 * Trigger event
 * @param eventId
 * @param data
 */
var pTrigger = function (eventId, data) {
    if (!table[eventId]) return;
    var onceToOff = [];
    table[eventId].forEach(function (cb, i) {
        var item = cb;
        if (type(cb) === 'object' && cb.once) {
            item = cb.callback;
            onceToOff.push(item);
        }
        item(data);
    });
    onceToOff.forEach(function (cb) {
        pOff(eventId, cb);
    });
};

var pubsub = {
    on: pOn,
    off: pOff,
    trigger: pTrigger
};

module.exports = pubsub;
