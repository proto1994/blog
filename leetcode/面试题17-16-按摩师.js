/**
 * 
一个有名的按摩师会收到源源不断的预约请求，每个预约都可以选择接或不接。在每次预约服务之间要有休息时间，
因此她不能接受相邻的预约。给定一个预约请求序列，替按摩师找到最优的预约集合（总预约时间最长），返回总的分钟数。

注意：本题相对原题稍作改动
 
示例 1：

输入： [1,2,3,1]
输出： 4
解释： 选择 1 号预约和 3 号预约，总时长 = 1 + 3 = 4。

示例 2：

输入： [2,7,9,3,1]
输出： 12
解释： 选择 1 号预约、 3 号预约和 5 号预约，总时长 = 2 + 9 + 1 = 12。
示例 3：

输入： [2,1,4,5,3,1,1,3]
输出： 12
解释： 选择 1 号预约、 3 号预约、 5 号预约和 8 号预约，总时长 = 2 + 4 + 3 + 3 = 12。


 */

/**
 * @param {number[]} nums
 * @return {number}
 */
var massage = function(nums) {

    if (nums.length == 0) return 0
    if (nums.length == 1) return nums[0]
    if (nums.length == 2) return Math.max.apply(null, nums)
    let f = [],
        len = nums.length
    f[0] = nums[0]
    f[1] = Math.max(nums[0], nums[1])

    for (let i = 2; i < len; i++) {
        f[i] = Math.max(f[i - 2] + nums[i], f[i - 1])
    }
    console.log(f[len - 1])
    return f[len - 1]
};


var massage1 = function(nums) {

    if (nums.length == 0) return 0
    if (nums.length == 1) return nums[0]
    if (nums.length == 2) return Math.max.apply(null, nums)
    let f = [],
        len = nums.length

    for (let i = 0; i < len; i++) {
        f[i] = []
        f[i][0] = 0
        f[i][1] = 0
    }

    f[0][0] = 0
    f[0][1] = nums[0]

    for (let i = 1; i < len; i++) {
        // 今天不预约，取昨天预约或者不预约的最大值时长
        f[i][0] = Math.max(f[i - 1][0], f[i - 1][1])
        // 今天预约，取昨天不预约+今天的数据
        f[i][1] = f[i - 1][0] + nums[i]
        
    }
    // console.log(Math.max(f[len - 1][0], f[len - 1][1]))
    return Math.max(f[len - 1][0], f[len - 1][1])


};

massage1([2,1,1,2])

massage1([1,2,3,1])

massage1([2,7,9,3,1])

massage1([2,1,4,5,3,1,1,3])