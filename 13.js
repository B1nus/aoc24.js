const fs = require("node:fs");
const data = fs.readFileSync("13.txt", "utf8");
// For greater precision. Maybe I should've written it myself. I just wasn't up for doing that today.
const Decimal = require("decimal.js");

const paragraphs = data.split('\n\n');

// Quite devious of the puzzle creator to make it seem like there are more
// than one solution to each price.
//
// "The least expensive" actually just means "The only solution".

var cost = Decimal(0);
paragraphs.forEach(paragraph => {
  let lines = paragraph.split('\n');
  const [ax, ay] = lines[0].split('X+')[1].split(', Y+').map(Decimal);
  const [bx, by] = lines[1].split('X+')[1].split(', Y+').map(Decimal);
  const [x, y] = lines[2].split('X=')[1].split(', Y=').map(n => { return Decimal(n).plus(Decimal(10000000000000)); });

  // Make button A and B into lines in standard notation.
  const [a1, b1, c1] = [ay, ax.negated(), 0];
  const [a2, b2, c2] = [by, bx.negated(), by.mul(x).sub(bx.mul(y))];
  // Find the intersections x position.
  const x_upper = b1.mul(c2).sub(b2.mul(c1));
  const x_lower = a2.mul(b1).sub(a1.mul(b2));
  const x_ = x_upper.div(x_lower);
  // Calculate the button presses.
  const a = x_.div(ax);
  const b = x.sub(x_).div(bx);
  // Check if it is actually possible
  if (a.mod(1) == 0 && b.mod(1) == 0) {
    cost = cost.add(a.mul(3).add(b));
  }
});
console.log(cost);
