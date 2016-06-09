export default class Curve {
  points: any[];
  paths: any[];

  constructor(points) {
    this.points = [];
    this.paths = [];

    points.forEach(point => {
      this.addPoint(point);
    });
  }

  addPoint(point) {
    // add midpoint if end point exists
    let end = this.points.pop();

    if (end) {
      let mid = this.midpoint(end, point);
      this.points.push(end, mid, point);
    } else {
      this.points.push(point);
    }

    return this;
  }

  generatePaths() {
    this.paths = [];
    let i = 1;

    while (i + 2 <= this.points.length - 2) {
      this.paths.push(this.points.slice(i, i + 3));
      i += 2;
    }

    return this.paths;
  }

  midpoint(p1, p2) {
    return [
      Math.round((p2[0] + p1[0]) / 2),
      Math.round((p2[1] + p1[1]) / 2)
    ];
  }
}