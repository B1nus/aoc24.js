const fs = require("node:fs");
const data = fs.readFileSync("13.txt", "utf8");

const paragraphs = data.split('\n\n');

function gcd(a, b) {
  if (b == 0) { return a }
  return gcd(b, a % b);
}

// Find the numbers a and b such that ax + by = 1. Return x and y.
//
// I "borrowed" some code from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-47.php
function extended_euclid(a, b) {
  a = +a;
  b = +b;
  if (a !== a || b !== b) {
    return [NaN, NaN, NaN];
  }

  if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) {
    return [Infinity, Infinity, Infinity];
  }
  // Checks if a or b are decimals
  if ((a % 1 !== 0) || (b % 1 !== 0)) {
    return false;
  }
  var signX = (a < 0) ? -1 : 1,
    signY = (b < 0) ? -1 : 1,
    x = 0,
    y = 1,
    u = 1,
    v = 0,
    q, r, m, n;
  a = Math.abs(a);
  b = Math.abs(b);

  while (a !== 0) {
    q = Math.floor(b / a);
    r = b % a;
    m = x - u * q;
    n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }
  return [b, signX * x, signY * y];
}

function get_diophantine(a, b, c) {
  const d = gcd(a, b)
  if (c % d == 0) {
    a /= d;
    b /= d;
    c /= d;

    let [_, x, y] = extended_euclid(a, b);

    // Return one solution
    return {
      x0: x * c,
      y0: y * c,
      a: a,
      b: b,
    };
  } else {
    return null;
  }
}

function diophantine_solution(diophantine, n) {
  return [diophantine.x0 - diophantine.b * n, diophantine.y0 + diophantine.a * n];
}

// Find all solutions where both x and y are positive.
function all_positive(diophantine) {
  if (diophantine == null) { return new Set };
  var n = Math.ceil(- diophantine.y0 / diophantine.a);
  var solutions = new Set;
  val = diophantine_solution(diophantine, n);
  while (val[0] >= 0 && val[1] >= 0) {
    solutions.add(val[0].toString().concat(',').concat(val[1].toString()));
    n += 1;
    val = diophantine_solution(diophantine, n);
  }
  return solutions;
}

var count = 0;
paragraphs.forEach(paragraph => {
  let lines = paragraph.split('\n');
  let ax = Number(lines[0].slice(12, 14));
  let ay = Number(lines[0].slice(18, 20));
  let bx = Number(lines[1].slice(12, 14));
  let by = Number(lines[1].slice(18, 20));
  let price_str = lines[2].slice(9, lines[2].length).split(', ');
  let x = Number(price_str[0]);
  let y = Number(price_str[1].slice(2, price_str[1].length));

  let x_solutions = all_positive(get_diophantine(ax, bx, x));
  let y_solutions = all_positive(get_diophantine(ay, by, y));

  let same = x_solutions.intersection(y_solutions);
  x_solutions.forEach
  

  if (same.size > 0) {
    var min = 0xFFFFFFFFFFFFFFFF;
    same.forEach(solution => {
      const [a, b] = solution.split(',').map(Number);
      const cost = a * 3 + b;
      if (cost < min) { min = cost; }
    })
    count += min;
  }
});
console.log(count);
