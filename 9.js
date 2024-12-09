const fs = require("node:fs");
const data = fs.readFileSync("9.txt", "utf8").trim();

function parse_data(data) {
  var files = [];
  var pos = 0;
  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    if (i % 2 == 0) {
      files.push({pos:pos,len:Number(c),num:Math.floor(i/2)});
    }
    pos += Number(c);
  }
  return files;
}

function compact_files(files) {
  var i = files.length - 1;
  outer: while (i > 1) {
    for (let j = 0; j < i; j++) {
      if (files[j + 1].pos - (files[j].pos + files[j].len - 1) > files[i].len) {
        files.splice(j + 1, 0, {pos:files[j].pos + files[j].len,len:files[i].len,num:files[i].num});
        files.splice(i + 1, 1);
        continue outer;
      }
    }
    i -= 1;
  }
  return files;
}

var files = parse_data(data);
draw(files);
files = compact_files(files);
draw(files);
console.log(checksum(files));

function draw(files) {
  var index = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    process.stdout.write('.'.repeat(file.pos - index));
    process.stdout.write(file.num.toString().repeat(file.len));
    index = file.pos + file.len;
  };
  process.stdout.write("\n");
}

function checksum(files) {
  return files
    .map(file => (file.len / 2 * (file.pos + file.pos + file.len - 1)) * file.num)
    .reduce((partialSum, a) => partialSum + a, 0);
}
