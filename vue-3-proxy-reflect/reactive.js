// 判断是否是对象, null也是对象
const isObject = (val) => val !== null && typeof val === "object";
// 判断key是否存在
const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

export function reactive(target) {
    // 首先判断是否是对象
    if (!isObject(target)) return target;

    const handler = {
        get(target, key, receiver) {
            console.log(`获取${key}值`);
            // ...这里还需要收集依赖
            // 收集依赖
            track(target, key);

            const result = Reflect.get(target, key, receiver);
            // 递归判断的关键, 如果发现子元素是引用类型, 递归处理
            if (isObject(result)) {
                return reactive(result);
            }
            return result;
        },

        set(target, key, value, receiver) {
            console.log(`设置${key}值`);

            // 首先获取旧值
            const oldValue = Reflect.get(target, key, receiver);

            // set是需要返回布尔值的
            let result = true;
            if (oldValue !== value) {
                result = Reflect.set(target, key, value, receiver);
                // ...更新操作
                trigger(target, key);
            }
            return result;
        },

        deleteProperty(target, key) {
            console.log(`删除${key}值`);

            // 先判断是否有对应的key
            const hasKey = hasOwn(target, key);
            const result = Reflect.deleteProperty(target, key);

            if (hasKey && result) {
                // ...更新操作
                trigger(target, key);
            }

            return result;
        },
    };
    return new Proxy(target, handler);
}

let activeEffect = null;
export function effect(callback) {
    activeEffect = callback;
    callback();
    activeEffect = null;
}

// targetMap表里的每个key都是一个普通对象, 对应他们的depsMap;
const targetMap = new WeakMap();
export function track(target, key) {
    // 如果当前没有effect就不执行追踪
    if (!activeEffect) return;

    // 获取当前对象的依赖图
    let depsMap = targetMap.get(target);

    // 不存在就新建
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }

    // 根据key从依赖图里获取到effect集合
    let dep = depsMap.get(key);

    // 不存在就新建
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }

    // 如果当前effect不存在, 才注册到dep里
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
}

export function trigger(target, key) {
    // 拿到依赖图
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        // 没有被追踪, 直接return
        return;
    }
    // 拿到后视图渲染effect就可以进行排队更新effect了
    const dep = depsMap.get(key);

    // 遍历dep集合执行里面的effect副作用方法
    if (dep) {
        dep.forEach((effect) => effect());
    }
}

// const isObj = (_) => _ && typeof _ === "object";
// const proxyDeps = new WeakMap();
// let runner = undefined;

// const makeProxy = (target) => {
//     proxyDeps.set(target, []);

//     return new Proxy(target, {
//         get: (target, key) => {
//             const deps = proxyDeps.get(target) || {};

//             if (typeof runner === "function") {
//                 if (!deps[key]) {
//                     deps[key] = [];
//                 }

//                 deps[key].push(runner);
//                 proxyDeps.set(target, deps);
//             }
//             return target[key];
//         },
//         set: (target, key, value) => {
//             const deps = proxyDeps.get(target) || {};
//             const oldValue = target[key];

//             target[key] = value;

//             if (oldValue !== target[key]) {
//                 (deps[key] || []).forEach((dep) => {
//                     dep();
//                 });
//             }

//             return true;
//         },
//     });
// };

// const reactive = (target) => {
//     if (!isObj(target)) {
//         throw Error("只支持对象、数组");
//     }

//     Object.entries(target).forEach(([key, value]) => {
//         if (isObj(value)) {
//             target[key] = reactive(value);
//         }
//     });

//     return makeProxy(target);
// };

// const reactiveRunner = (fn) => {
//     runner = fn;
//     fn();
//     runner = undefined;
// };

// const count = reactive({ value: 1 });

// function print1() {
//     console.log("print1", count.value);
// }

// reactiveRunner(print1);

// count.value = 2;
