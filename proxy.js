// Object.defineProperty存在的问题
// 1. 需要递归监听
// 2. 修改值为对象需要设置监听
// 3. 无法监听对象新增的属性，push等方法无法触发set
// 4. 一次只能对一个属性监听，需要遍历所有属性监听
// 判断是否是对象, null也是对象
const isObject = (val) => val !== null && typeof val === "object";

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
};

let proxyObj = createProxy(person);

// 测试get
console.log(proxyObj.children.name); //输出：触发了get 小明
console.log(proxyObj.children.height); //输出：触发了get 66
// 测试set
proxyObj.children.name = "菜菜"; // 触发了getChildren和setName
console.log(proxyObj.children.name); //输出: 触发了get 菜菜

const el = dom.div(
    {},
    "Hello, my name is ",
    dom.a({ href: "//example.com" }, "Mark"),
    ". I like:",
    dom.ul(
        {},
        dom.li({}, "The web"),
        dom.li({}, "Food"),
        dom.li({}, "…actually that's it")
    )
);
