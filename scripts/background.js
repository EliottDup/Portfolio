var canvas = document.getElementById("canvas");
var c = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

let mousePos = { x: -1000, y: -1000 };
let lastMousePos = { x: -1000, y: -1000 };
let mousePosSpeed = { x: 0, y: 0 };

let points = [];
let lines = [];

let color = "blueviolet";

let outerborder = 100;

// let screensizeMult = window.innerWidth / 1080;
let screensizeMult = 1;

let voronoi = false;
if (canvas.innerHTML == "voronoi") voronoi = true;
canvas.innerHTML = "";

//Classes 'n funcs
function Vector(x, y) {
  return { x: x, y: y };
}

function compareVector(v1, v2) {
  return v1.x == v2.x && v1.y == v2.y;
}

function pointIsOnScreen(v1) {
  return !(v1.x < 0 || v1.y < 0 || v1.x > innerWidth || v1.y > innerHeight);
}

function triangle(p1, p2, p3) {
  return { v1: p1, v2: p2, v3: p3 };
}

function compareTriangle(t1, t2) {
  if (t1.v1 != t2.v1) {
    return false;
  }
  if (t1.v2 != t2.v2) {
    return false;
  }
  if (t1.v3 != t2.v3) {
    return false;
  }
  return true;
}

function triSharesEdgesWithSuperTri(tri, superTri) {
  if (
    compareVector(tri.v1, superTri.v1) ||
    compareVector(tri.v1, superTri.v2) ||
    compareVector(tri.v1, superTri.v3) ||
    compareVector(tri.v2, superTri.v1) ||
    compareVector(tri.v2, superTri.v2) ||
    compareVector(tri.v2, superTri.v3) ||
    compareVector(tri.v3, superTri.v1) ||
    compareVector(tri.v3, superTri.v2) ||
    compareVector(tri.v3, superTri.v3)
  ) {
    return false;
  }
  return true;
}

function getTriEdges(tri) {
  return [
    { v1: tri.v1, v2: tri.v2 },
    { v1: tri.v2, v2: tri.v3 },
    { v1: tri.v3, v2: tri.v1 },
  ];
}

function Tris2lines(tris) {
  let lines = [];
  for (let i = 0; i < tris.length; i++) {
    let edges = getTriEdges(tris[i]);
    for (let j = 0; j < 3; j++) {
      if (!edgeIsInList(edges[j], lines) && edgeIsOnScreen(edges[j])) {
        lines.push(edges[j]);
      }
    }
  }
  return lines;
}

function getVoronoiLines(tris, centers) {
  let edges = [];

  for (let i = 0; i < tris.length; i++) {
    let neighbors = getTriNeighbors(i, tris);

    for (let j = 0; j < neighbors.length; j++) {
      edges.push({
        v1: centers[i].position,
        v2: centers[neighbors[j]].position,
      });
    }
  }

  return edges;
}

function compareEdge(e1, e2) {
  return (
    (compareVector(e1.v1, e2.v1) && compareVector(e1.v2, e2.v2)) ||
    (compareVector(e1.v2, e2.v1) && compareVector(e1.v1, e2.v2))
  );
}

function edgeIsInList(edge, list) {
  for (let i = 0; i < list.length; i++) {
    if (compareEdge(edge, list[i])) {
      return true;
    }
  }
  return false;
}

function edgeIsOnScreen(edge) {
  return pointIsOnScreen(edge.v1) || pointIsOnScreen(edge.v2);
}

function getEdgeCenter(e) {
  let x = (e.v1.x + e.v2.x) / 2;
  let y = (e.v1.y + e.v2.y) / 2;
  return Vector(x, y);
}

function trisShareEdge(tri1, tri2) {
  let edges1 = getTriEdges(tri1);
  let edges2 = getTriEdges(tri2);
  if (edgeIsInList(edges1[0], edges2)) return true;
  if (edgeIsInList(edges1[1], edges2)) return true;
  if (edgeIsInList(edges1[2], edges2)) return true;
  return false;
}

function getTriNeighbors(index, tris) {
  let result = [];
  tri = tris[index];
  triEdges = getTriEdges(tri);

  for (let i = 0; i < tris.length; i++) {
    if (!compareTriangle(tri, tris[i])) {
      if (trisShareEdge(tri, tris[i])) result.push(i);
    }
  }
  return result;
}

function getCircumcenters(tris) {
  let result = [];
  for (let i = 0; i < tris.length; i++) {
    result.push({ position: getCircumcenter(tris[i]) });
  }
  return result;
}

// random generators
function randomInt(max) {
  return Math.round(Math.random() * max);
}

function randomFloat(max) {
  return Math.random() * max;
}

function generateRandomVector(multiplier = 1) {
  let x = Math.random() * 2 - 1;
  let y = Math.random() * 2 - 1;

  let magnitude = Math.sqrt(x * x + y * y);

  return { x: (x / magnitude) * multiplier, y: (y / magnitude) * multiplier };
}

//drawing functions
function drawDot(pos, radius, color, alpha) {
  c.beginPath();
  c.globalAlpha = alpha;
  c.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
  c.fillStyle = color;
  c.fill();
  c.globalAlpha = 1;
}

function drawLine(pos1, pos2, color, width, alpha = 1) {
  c.beginPath();
  c.globalAlpha = alpha;
  c.moveTo(pos1.x, pos1.y);
  c.lineTo(pos2.x, pos2.y);
  c.lineWidth = width;
  c.strokeStyle = color;
  c.stroke();
  c.globalAlpha = 1;
}

function drawTriangle(tri, color, width) {
  drawLine(tri.v1, tri.v2, color, width);
  drawLine(tri.v2, tri.v3, color, width);
  drawLine(tri.v3, tri.v1, color, width);
}

function drawAllDots(dots, col, mousePosition) {
  for (let i = 0; i < dots.length; i++) {
    let pos = dots[i].position;
    let size = calculateMouseFalloffMult(pos, mousePosition, 300) * 4 + 2;
    drawDot(pos, size, col, 0.75);
  }
}

// Mathy stuff
function getCircumcenter(tri) {
  let A = tri.v1;
  let B = tri.v2;
  let C = tri.v3;
  let D = (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) * 2;
  let x =
    (1 / D) *
    ((A.x ** 2 + A.y ** 2) * (B.y - C.y) +
      (B.x ** 2 + B.y ** 2) * (C.y - A.y) +
      (C.x ** 2 + C.y ** 2) * (A.y - B.y));
  let y =
    (1 / D) *
    ((A.x ** 2 + A.y ** 2) * (C.x - B.x) +
      (B.x ** 2 + B.y ** 2) * (A.x - C.x) +
      (C.x ** 2 + C.y ** 2) * (B.x - A.x));

  return Vector(x, y);
}

function distance(p1, p2) {
  // return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function BowyerWatson(pointsList) {
  //create supertri
  let supertri = triangle(
    Vector(-innerWidth, -innerHeight),
    Vector(4 * innerWidth, -innerHeight),
    Vector(-innerWidth, 4 * innerHeight)
  );

  // add super triangle
  triangulation = [];
  triangulation.push(supertri);

  for (let i = 0; i < pointsList.length; i++) {
    //for each point
    let pos = pointsList[i].position;
    let badTriangles = [];
    for (let j = 0; j < triangulation.length; j++) {
      //for each triangle
      let tri = triangulation[j];
      let circumCenter = getCircumcenter(tri);
      let dist = distance(circumCenter, tri.v1);
      if (distance(pos, circumCenter) < dist) {
        // if point is inside of circumcenter
        badTriangles.push(tri);
      }
    }
    let polygon = [];
    for (let j = 0; j < badTriangles.length; j++) {
      let tri = badTriangles[j];
      // for each endge in tri, if no other triangle in badtriangles shares that edge: add edge to polygon
      let edges = getTriEdges(tri);
      let otherEdges = [];
      for (let k = 0; k < badTriangles.length; k++) {
        if (k != j) {
          // add all edges to otheredges list to compare.
          let tmp = getTriEdges(badTriangles[k]);

          otherEdges.push(tmp[0]);
          otherEdges.push(tmp[1]);
          otherEdges.push(tmp[2]);
        }
      }

      for (let k = 0; k < edges.length; k++) {
        if (!edgeIsInList(edges[k], otherEdges)) {
          polygon.push(edges[k]);
        }
      }
    }
    for (let j = 0; j < badTriangles.length; j++) {
      for (let k = 0; k < triangulation.length; k++) {
        if (compareTriangle(badTriangles[j], triangulation[k])) {
          triangulation.splice(k, 1);
          k--;
        }
      }
    }
    for (let j = 0; j < polygon.length; j++) {
      p1 = pos;
      p2 = polygon[j].v1;
      p3 = polygon[j].v2;
      triangulation.push(triangle(p1, p2, p3));
    }
  }
  for (let i = 0; i < triangulation.length; i++) {
    if (!triSharesEdgesWithSuperTri(triangulation[i], supertri)) {
      triangulation.splice(i, 1);
      i--;
    }
  }
  return triangulation;
}

function calculateMouseFalloffMult(pointpos, mousepos, range) {
  dist = distance(pointpos, mousepos);
  return smoothstep(range, 0, dist);
}

function smoothstep(min, max, value) {
  var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

//other
function displacestuff(pointslist, displacementvector) {
  let list = pointslist;
  for (let i = 0; i < list.length; i++) {
    list[i].position.x += displacementvector.x;
    list[i].position.y += displacementvector.y;
  }
  return list;
}

function displacestuffmultipletimes(pointslist) {
  let newList = pointslist;
  let l1 = displacestuff(newList, Vector(-innerWidth, 0));
  let l2 = displacestuff(newList, Vector(innerWidth, 0));
  let l3 = displacestuff(newList, Vector(0, -innerHeight));
  let l4 = displacestuff(newList, Vector(0, innerHeight));
  return newList.concat(l1).concat(l2).concat(l3).concat(l4);
}

window.addEventListener("mousemove", (e) => {
  let xPos = e.clientX;
  let yPos = e.clientY;
  if (mousePos.x != -1000) {
    mousePosSpeed.x = xPos - mousePos.x;
    mousePosSpeed.y = yPos - mousePos.y;
  }
  mousePos = Vector(xPos, yPos);
});

function MainLoop() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  requestAnimationFrame(MainLoop);
  //clear frame
  c.clearRect(0, 0, innerWidth, innerHeight);

  //update mouse
  if (lastMousePos.x != -1000) {
    mousePosSpeed.x = mousePos.x - lastMousePos.x;
    mousePosSpeed.y = mousePos.y - lastMousePos.y;
  }
  lastMousePos = mousePos;
  //calculate delaunay
  let lines;
  let pointsToDraw;
  let tris = BowyerWatson(points.concat({ position: mousePos }));
  if (voronoi) {
    let centers = getCircumcenters(tris);
    lines = getVoronoiLines(tris, centers);
    pointsToDraw = centers;
  } else {
    lines = Tris2lines(tris);
    pointsToDraw = points;
  }
  //drawLines
  for (let i = 0; i < lines.length; i++) {
    let size =
      calculateMouseFalloffMult(getEdgeCenter(lines[i]), mousePos, 300) * 3 + 1;

    drawLine(lines[i].v1, lines[i].v2, color, size, 0.5);
  }

  //drawDots
  if (voronoi) {
    drawAllDots(pointsToDraw, "black", mousePos);
    drawAllDots(pointsToDraw, color, mousePos);
  } else {
    drawAllDots(
      [{ position: mousePos }].concat(pointsToDraw),
      "black",
      mousePos
    );
    drawAllDots([{ position: mousePos }].concat(pointsToDraw), color, mousePos);
  }

  // drawDot(mousePos, 6, color, 0.75);
  for (let i = 0; i < points.length; i++) {
    let pos = points[i].position;
    let vel = points[i].velocity;
    let extraV = points[i].extraStartVelocity;

    //update Dots position
    points[i].position = {
      x: pos.x + vel.x + Math.max(Math.min(extraV.x, 1), -1),
      y: pos.y + vel.y + Math.max(Math.min(extraV.y, 1), -1),
    };
    if (points[i].position.x < -outerborder) {
      points[i].position.x = innerWidth + outerborder;
    }
    if (points[i].position.x > innerWidth + outerborder) {
      points[i].position.x = -outerborder;
    }
    if (points[i].position.y < -outerborder) {
      points[i].position.y = innerHeight + outerborder;
    }
    if (points[i].position.y > innerHeight + outerborder) {
      points[i].position.y = -outerborder;
    }

    points[i].extraStartVelocity.x +=
      ((mousePosSpeed.x *
        calculateMouseFalloffMult(points[i].position, mousePos, 100)) /
        100) *
      0;
    points[i].extraStartVelocity.y +=
      ((mousePosSpeed.y *
        calculateMouseFalloffMult(points[i].position, mousePos, 100)) /
        100) *
      0;

    points[i].extraStartVelocity.y *= 0.98;
    points[i].extraStartVelocity.x *= 0.98;
    if (
      points[i].extraStartVelocity.x < 0.01 &&
      points[i].extraStartVelocity.y < 0.01
    ) {
      points[i].extraStartVelocity = Vector(0, 0);
    }
  }
}

function setup(pointCount, maxVelocity) {
  for (let i = 0; i < pointCount; i++) {
    let xPos = randomInt(window.innerWidth + 2 * outerborder) - outerborder;
    let yPos = randomInt(window.innerHeight + 2 * outerborder) - outerborder;
    let pointVel = generateRandomVector(
      randomFloat(maxVelocity * screensizeMult)
    );

    points.push({
      position: { x: xPos, y: yPos },
      velocity: pointVel,
      extraStartVelocity: { x: pointVel.x * 5, y: pointVel.y * 5 },
    });
  }
}

setup(100, 0.4);
MainLoop();
