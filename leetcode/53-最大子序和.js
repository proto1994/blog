/** 
    给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
    示例:
    输入: [-2,1,-3,4,-1,2,1,-5,4]
    输出: 6
    解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    var f = [],
        max = nums[0]
    f[0] = max
    for (let i = 1, len = nums.length; i < len; i++) {
        f[i] = Math.max(nums[i], f[i - 1] + nums[i])
        max = Math.max(f[i], max)
    }
    return max
};



var maxSubArray1 = function(nums) {
    var max = nums[0],
        sum = max
    for (let i = 1, len = nums.length; i < len; i++) {
        if (sum > 0) {
            sum += nums[i]
        } else {
            sum = nums[i]
        }
        max = Math.max(max, sum)
    }
    return max
};

console.log(maxSubArray1([-2,1,-3,4,-1,2,1,-5,4]))