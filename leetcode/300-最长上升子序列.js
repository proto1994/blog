/**
 * 
 * 
 * 
给定一个无序的整数数组，找到其中最长上升子序列的长度。
示例:

输入: [10,9,2,5,3,7,101,18]
输出: 4 
解释: 最长的上升子序列是 [2,3,7,101]，它的长度是 4。
说明:
可能会有多种最长上升子序列的组合，你只需要输出对应的长度即可。
你算法的时间复杂度应该为 O(n2) 。
进阶: 你能将算法的时间复杂度降低到 O(n log n) 吗?
*/


/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    if (!nums.length) return 0
    var dp = [],
        len = nums.length
    for (let i = 0; i < len; i++) {
        dp[i] = 1
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[j] + 1, dp[i])
            }
        }
    }
    // console.log(Math.max.apply(null, dp))
    return Math.max.apply(null, dp)
};

lengthOfLIS([1,3,6,7,9,4,10,5,6])