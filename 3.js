const fs = require("node:fs");
const data = fs.readFileSync("3.txt", "utf8");

i = 0;
SoP = 0;
while (i != -1) {
  i = data.indexOf("mul(", i + 1);
  comma = data.indexOf(",", i + 1);
  end = data.indexOf(")", comma + 1);
  lhs = Number(data.slice(i + 4,comma));
  rhs = Number(data.slice(comma + 1,end));
  if (!isNaN(lhs) && !isNaN(rhs)) {
    SoP += lhs * rhs;
  }
}

console.log(SoP);

