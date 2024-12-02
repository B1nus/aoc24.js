const fs = require('node:fs');
const data = fs.readFileSync('2.txt', 'utf8');

count = 0;
lines = data.split('\n').filter((x) => x.length > 0);
lines.forEach((line) => {
  nums_ = line.split(' ').map(Number);
  for (let j = 0; j < nums_.length; j ++) {
    passed = true;
    nums = nums_.slice(0);
    nums.splice(j, 1);
    i = 2;
    while (i < nums.length) {
      if (!((nums[i] > nums[i - 1] && nums[i - 1] > nums[i - 2]) || (nums[i] < nums[i - 1] && nums[i - 1] < nums[i - 2]))) {
        passed = false;
        break;
      }
      if (Math.abs(nums[i] - nums[i - 1]) > 3 || nums[i] == nums[i-1] || Math.abs(nums[i - 1] - nums[i - 2]) > 3 || nums[i-1] == nums[i-2]) {
        passed = false;
        break;
      }
      i += 1;
    }
    if (passed) {
      count += 1;
      break;
    }
  }
});
console.log(count);
