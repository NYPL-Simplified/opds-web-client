import * as React from "react";
import Curve from "./Curve";
const seedrandom = require("seedrandom");

export interface BookCoverProps {
  style?: any;
  text: string;
}

export default class BookCover extends React.Component<BookCoverProps, any> {
  render() {
    let cellStyle = Object.assign({
      display: "table-cell",
      verticalAlign: "middle",
      backgroundColor: "#eee",
      textAlign: "center",
      padding: "5px",
      color: "#888",
      fontWeight: "bold"
    }, this.props.style);

    // calculate font size
    // decrease size as max word length increases
    // decrease size as word count grows beyond 3
    // but minimum size is 15 regardless
    let words = this.props.text.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let baseFontSize = parseInt((this.props.style || {}).fontSize || "45px");
    let fontSize = Math.max(15, baseFontSize - maxLength * 2 - Math.max(0, wordCount - 3) * 2);
    let lineHeight = fontSize + 2;

    let points = this.pointsFromText(130, 180);

    let contentStyle = {
      fontSize: fontSize + "px",
      lineHeight: lineHeight + "px",
    };

    let parts = this.props.text.replace("\n", "`\n`").split("`").map((part, i) => {
      if (part === "\n") {
        return <br key={i} />;
      } else {
        return <span key={i}>{part}</span>;
      }
    })

    // text is split so that "More" always appears on its own line
    return (
      <div style={cellStyle}>
        <div style={contentStyle}>
            { parts }
        </div>
      </div>
    );
  }

  pointsFromText(width, height) {
    let padding = 20;
    let size = Math.round(Math.min(width, height)/2) - padding;
    let center = [width/2, height/2].map(Math.round);

    let chars = this.props.text.toLowerCase().replace(/\W/, "").slice(0, 20).split("");
    // let points = chars.map((char, i) => {
    //   let int = char.charCodeAt(0) - 80;
    //   let angle = random(Math.PI, char) + i/2;
    //   let radius = size * (int/22);
    //   let x = center[0] + Math.cos(angle) * radius;
    //   let y = center[1] + Math.sin(angle) * radius;
    //   return [x, y];
    // });

    let points = chars.map((char, i) => randomPoint(char + i, width, height));

    // let proximity = 75;
    // let points = chars.reduce((result, char, i) => {
    //   return addPoint(result, proximity, char + i, width, height);
    // }, []);

    points.push(points[0]);
    points.push(points[1]);

    return points;
  }
}

export function seededRandomHue(seed) {
  return Math.round(360 * seedrandom(seed)());
}

function random(max, seed) {
  return Math.round(seedrandom(seed)() * max);
}

function randomPoint(seed, width, height) {
  return [
    Math.round(width * seedrandom(seed + "_x")()),
    Math.round(height * seedrandom(seed + "_y")())
  ];
}

function addPoint(points, proximity, seed, width, height) {
  let newPoint;

  if (points.length > 0) {
    let last = points.slice(-1)[0];
    newPoint = nearbyPoint(last, proximity, seed, width, height);
  } else {
    newPoint = randomPoint(seed, width, height);
  }

  points.push(newPoint);

  return points;
}


function nearbyPoint(previous, proximity, seed, width, height) {
  return [
    nearbyNumber(previous[0], proximity, width, seed + "_x"),
    nearbyNumber(previous[1], proximity, height, seed + "_y"),
  ];
}

function nearbyNumber(num, proximity, max, seed) {
  let padding = 0;
  let nearby = withinBounds(num + 2 * random(proximity, seed) - proximity, padding, max - padding, 50, seed);

  if (nearby === num) {
    nearby += random(1, seed) ? 1 : -1;
  }

  return nearby;
}

function withinBounds(num, min, max, wobble = 50, seed) {
  // narrow lower and upper bounds by random offset
  let offset = Math.round(seedrandom(seed)() * wobble);
  return Math.min(Math.max(min + offset, num), max - offset);
}