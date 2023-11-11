/****************数组乱序 */
{
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = arr.length - 1; i >= 1; i--) {
        const randomIndex = Math.floor(Math.random() * i);
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }

    console.log(arr);
}

/****************数组去重 */
// 方法1
{
    let arr = [1, 1, 2, 3, 4, 4, 5, 4, 5, 7, 6, 7, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    console.time("代码执行时长");
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (result.includes(arr[i])) {
            continue;
        } else {
            result.push(arr[i]);
        }
    }
    console.log(result);
    console.timeEnd("代码执行时长");

    // 方法2
    console.time("代码执行时长");
    let result1 = null;
    result1 = arr.filter((val, index, arr) => {
        return arr.indexOf(val) === index;
    });
    console.log(result1);
    console.timeEnd("代码执行时长");
}

/****************扁平化数组 */
{
    const arr = [
        [1, 2, 4],
        2,
        [4, 4, 45],
        [2, [3, 5, 6]],
        [
            [1, 2],
            [2, 3, [55, 66, 77]],
        ],
    ];
    console.log(arr.flat(Infinity));
    // 主要还是concat在起作用
    function flatArr(arr) {
        const result = arr.reduce((prev, current) => {
            if (Object.prototype.toString.call(current) === "[object Array]") {
                return prev.concat(flatArr(current));
            } else {
                return prev.concat(current);
            }
        }, []);
        return result;
    }
    console.log(flatArr(arr));
}
