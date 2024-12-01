const fs = require('node:fs');



const data = fs.readFile('1.txt', 'utf8', (err, data) => {
  lines = data.split('\n');
  lines = lines.filter((line) => line.length > 0);
  left = lines.flatMap((x) => Number(x.split('   ')[0]));
  right = lines.flatMap((x) => Number(x.split('   ')[1]));

  sum = 0;
  left.forEach((l) => {
    right.forEach((r) => {
      if (l == r) {
        sum += l;
      }
    })
  });
  console.log(sum);
});

