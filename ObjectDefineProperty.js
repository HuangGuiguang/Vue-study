// 基础使用(监听一个属性的变化)
// let person = {};
// let personName = "jacky";

// // 在person上添加name属性, 值为personName
// Object.defineProperty(person, "name", {
//   enumerable: true, // 默认添加的属性是不可枚举的
//   //   writable: true, // 默认是不可修改的
//   configurable: true, // 默认是不可删除的
//   get: () => {
//     console.log("获取person.name");
//     return personName;
//   },
//   set: (val) => {
//     console.log("设置person.name");
//     personName = val;
//   },
// });

// console.log(person.name);

// personName = "marry";

// console.log(person.name);

// person.name = "rose";
// console.log(personName);

// var obj = { 0: "a", 1: "b", 2: "c" };
// console.log(Object.keys(obj));

// 错误的劫持所有属性的方法
// let person = { name: "jacky" };
// Object.keys(person).forEach((key) => {
//   Object.defineProperty(person, key, {
//     enumerable: true,
//     configurable: true,
//     get() {
//       return person[key]; // 返回person[key]时又会触发get, 导致栈溢出, 所以要设置一个中转站
//     },
//     set() {
//       person[key] = val; // 这里也是同理, 本来是设置值触发了set, 但是方法内部有触发了set
//     },
//   });
// });

// console.log(person.name);

//************************正确的监听所有属性的方法***************** */
let person = {
    name: "jacky",
    age: 24,
    info: {
        height: 170,
        weight: "60kg",
    },
    arr: [1, 2, 3],
};
function defineProperty(obj, key, val) {
    // 深度监听对象, 对象的值也是对象的情况
    if (typeof val === "object" && val !== null) {
        Observer(val);
    }
    Object.defineProperty(obj, key, {
        get() {
            console.log(`访问了${key}属性`);
            return val;
        },
        set(newVal) {
            console.log(`设置了${key}属性`);
            // 如果newVal是一个对象，递归进入该对象进行监听
            // set的时候如果设置成了对象, 则也需要监听
            if (typeof newVal === "object" && typeof newVal !== null) {
                Observer(newVal);
            }
            val = newVal;
        },
    });
}

function Observer(obj) {
    Object.keys(obj).forEach((key) => {
        defineProperty(obj, key, obj[key]);
    });
}

Observer(person);
console.log(person.info.height);
console.log("--------");
person.info.height = {
    heartRate: 90,
};
console.log("--------");
console.log(person.info.height.heartRate);
console.log("--------");
person.arr.push(5); // 无法监听到set中
console.log("--------");
person.sex = 0; // 无法监听新增的属性
console.log(person.sex);

//************************数组监听问题***************** */
// let arr = [1, 2, 3];
// let obj = {};
// Object.defineProperty(obj, "arr", {
//     get() {
//         console.log("get arr");
//         return arr;
//     },
//     set(newVal) {
//         console.log("set arr");
//         arr = newVal;
//     },
// });

// // obj.arr[1] = 5;
// obj.arr = [1, 2, 3, 4];
// console.log(obj.arr);
// console.log("--------");
// obj.arr.push(5); // 无法触发set
// console.log(obj.arr);
