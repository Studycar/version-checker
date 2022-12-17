import Subject from './Subject';

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
const _toString = Object.prototype.toString;

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
    odf(arrayMethods, method, {
        value: function mutator(...args) {
            let result = arrayProto[method].apply(this, args);
            this.$sub.notifyObserver();
            return result;
        },
        configurable: true,
        writable: true,
        enumerable: false,
    });
});


export default class Mutation {
    mutate(val) {
        if (val.hasOwnProperty('$sub')) {
            return;
        } else {
            const subject = new Subject();
            odf(val, '$sub', {value: subject});
        }

        if (Array.isArray(val)) {
            val.__proto__ = arrayMethods;
        } else if (isObject(val)) {
            let keys = Object.keys(val);
            let l = keys.length;
            while (l--) {
                let value = val[keys[l]];
                odf(val, keys[l], {
                    set: function (newVal) {
                        value = newVal;
                        this.$sub.notifyObserver(value);
                    },
                    get: function () {
                        return value;
                    }
                })
            }
        }
    }
}

export function odf(target, property, value) {
    Object.defineProperty(target, property, value);
}

function isObject(val) {
    return _toString.call(val) === '[object Object]';
}
