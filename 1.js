const fs = require('node:fs');

const data = fs.readFile('1.txt', 'utf8', (err, data) => {
  lines = data.split('\n');
  lines = lines.filter((line) => line.length > 0);
  left = lines.flatMap((x) => Number(x.split('   ')[0]));
  right = lines.flatMap((x) => Number(x.split('   ')[1]));

  left.sort((a,b) => a - b);
  right.sort((a,b) => a - b);
  
  sum = 0;
  left.forEach((l, li) => {
    sum += Math.abs(l - right[li]);
  });
  console.log(sum);
});

