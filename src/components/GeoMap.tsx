import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./geoMap.css";

interface Props {
  onProvince: (province: string) => void;
  scale: number;
  height: number;
  weight: number;
  centerX: number;
  centerY: number;
  initMapColor: string;
  initStrokeColor: string;
}

const GeoMap = ({
  onProvince,
  scale,
  height,
  weight,
  centerX,
  centerY,
  initMapColor,
  initStrokeColor,
}: Props) => {
  const [province, setProvince] = useState("");
  const visited = ["山东", "新疆", "内蒙古", "北京"];
  useEffect(() => {
    let projection = d3
      .geoMercator()
      .scale(scale)
      .translate([-500, 700])
      .center([centerX, centerY]);

    let geoGenerator: any = d3.geoPath().projection(projection);

    function handleMouseover(this: any, e: any, d: any) {
      //   console.log(d.properties.name);
      //   setProvince(d.properties.name);
      d3.select(this).classed("stateSelected", true);
    }

    function handleMouseout(this: any, e: any, d: any) {
      d3.select(this).classed("stateSelected", false);
    }

    function handleClick(this: any, e: any, d: any) {
      //   console.log(d.properties.name);

      setProvince(d.properties.name);
      onProvince(d.properties.name);
    }

    function update(geojson: any) {
      let u = d3
        .select("#content g.map")
        .selectAll("path")
        .data(geojson.features);

      u.enter()
        .append("path")
        .attr("d", geoGenerator)
        .on("mouseover", handleMouseover)
        .on("click", handleClick)
        .on("mouseout", handleMouseout);
      // .attr("fill", (d) => {
      //   if (visited.includes(d.properties.name)) return "#3b813299";
      // });
    }

    // REQUEST DATA
    // https://geojson.cn/api/data/china.json
    d3.json("https://geojson.cn/api/data/china.json").then(function (json) {
      update(json);
    });
  }, []);

  return (
    <div id="content">
      <svg
        style={{
          border: "4px solid gray",
          borderRadius: "30px",
          height: height,
          width: weight,
          margin: "50px",
        }}
      >
        <g
          className="map"
          style={{ fill: initMapColor, stroke: initStrokeColor }}
        ></g>
      </svg>
    </div>
  );
};

export default GeoMap;
