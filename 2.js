const fs = require('node:fs');
const data = fs.readFileSync('2.txt', 'utf8');

count = 0;
lines = data.split('\n').filter((x) => x.length > 0);
lines.forEach((line) => {
  i = 2;
  count += 1;
  nums = line.split(' ').map(Number);
  if (nums.length > 1) {
    while (i < nums.length) {
      if (!((nums[i] > nums[i - 1] && nums[i - 1] > nums[i - 2]) || (nums[i] < nums[i - 1] && nums[i - 1] < nums[i - 2]))) {
        count -= 1;
        break;
      }
      if (Math.abs(nums[i] - nums[i - 1]) > 3 || Math.abs(nums[i - 1] - nums[i - 2]) > 3 || nums[i] == nums[i-1] || nums[i-1] == nums[i-2]) {
        count -= 1;
        break;
      }
      i += 1;
    }
  }
});
console.log(count);
