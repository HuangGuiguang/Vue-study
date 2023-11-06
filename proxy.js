// Object.defineProperty存在的问题
// 1. 需要递归监听
// 2. 修改值为对象需要设置监听
// 3. 无法监听对象新增的属性，push等方法无法触发set
// 4. 一次只能对一个属性监听，需要遍历所有属性监听

// let person = {
//     age: 24,
//     name: "cui",
//     arr: [1, 2, 3, 4],
// };

// let handler = {
//     get(obj, key) {
//         console.log(`get${key}`);
//         return key in obj ? obj[key] : "66";
//     },
//     set(obj, key, val) {
//         console.log(`set${key}`);
//         obj[key] = val;
//         return true;
//     },
// };

// let proxyP = new Proxy(person, handler);

// console.log(proxyP.age);
// console.log(proxyP.sex);

// person.age = 25; // 这样是不会触发set的, 需要操作代理对象
// proxyP.age = 25;
// proxyP.sex = 0; // 新增属性时可以触发set
// proxyP.arr.push(5); // 光这样也是不会触发set

// 使用proxy深度监听对象
// 判断是否是对象, null也是对象
const isObject = (val) => val !== null && typeof val === "object";

function createProxy(obj) {
    let handler = {
        get(obj, key) {
            console.log(`get${key}`);
            if (isObject(obj[key])) {
                return createProxy(obj[key]);
            }
            return key in obj ? obj[key] : "66";
        },
        set(obj, key, val) {
            console.log(`set${key}`);
            obj[key] = val;
            return true;
        },
    };

    return new Proxy(obj, handler);
}

let person = {
    age: 0,
    school: "xdu",
    children: {
        name: "小明",
    },
    arr: [1, 2, 3, 4],
};

let proxyObj = createProxy(person);

// 测试get
console.log(proxyObj.children.name); //输出：触发了get 小明
console.log(proxyObj.children.name); //输出：触发了get 小明
console.log(proxyObj.children.name); //输出：触发了get 小明
console.log(proxyObj.children.height); //输出：触发了get 66
// 测试set
proxyObj.children.name = "菜菜"; // 触发了getChildren和setName
console.log(proxyObj.children.name); //输出: 触发了get 菜菜

proxyObj.arr.push(5);

// this指向问题
let thisProblem = {
    m() {
        console.log(this === thisProblem);
    },
};

const proxyThisProblem = new Proxy(thisProblem, {
    get(obj, key, receiver) {
        return key in obj ? Reflect.get(obj, key, receiver) : "66";
    },
    set(obj, key, val, receiver) {
        console.log(`set${key}`);
        obj[key] = val;
        return true;
    },
});

console.log(proxyThisProblem.m()); // false
console.log(thisProblem.m()); // true

const _name = new WeakMap();
class Person {
    //把person的name存储到_name的name属性上
    constructor(name) {
        _name.set(this, name);
    }
    //获取person的name属性时，返回_name的name
    get name() {
        return _name.get(this);
    }
}

const jane = new Person("Jane");
jane.name; // 'Jane'

const proxyObj = new Proxy(jane, {});
proxyObj.name; // undefined

const tempObj1 = {
    a: 1,
    get value() {
        console.log(this === proxyObj); // false
        return this.a;
    },
};
const handler = {
    get: function (obj, prop, receiver) {
        return obj[prop];
    },
    set: function (obj, prop, value, receiver) {
        obj[prop] = value;
        return true;
    },
};
const proxyObj = new Proxy(tempObj1, handler);
proxyObj.value; // 1

const parent = {
    a: 1,
    get value() {
        console.log(this === child); // false
        return this.a;
    },
};
const handler = {
    get: function (obj, prop, receiver) {
        return obj[prop];
    },
    set: function (obj, prop, value, receiver) {
        obj[prop] = value;
        return true;
    },
};

const proxyObj = new Proxy(parent, handler);
const child = Object.setPrototypeOf({ a: 2 }, proxyObj);
child.value; // 1

const parent = {
    a: 1,
    get value() {
        console.log(this === child); // true
        return this.a;
    },
};
const handler = {
    get: function (obj, prop, receiver) {
        Reflect.get(obj, prop);
        return Reflect.get(obj, prop, receiver);
    },
    set: function (obj, prop, value, receiver) {
        Reflect.get(obj, prop, value, receiver);
        return true;
    },
};

const proxyObj = new Proxy(parent, handler);
const child = Object.setPrototypeOf({ a: 2 }, proxyObj);
child.value; // 2
