import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { cn } from "./classNames";

interface Vector2 {
  x: number;
  y: number;
}

const add = (v1: Vector2, v2: Vector2): Vector2 => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

const multiply = (v1: Vector2, val: number): Vector2 => ({
  x: v1.x * val,
  y: v1.y * val,
});
class App extends React.Component<any, any> {
  state = {
    x: window.innerWidth,
    y: window.innerHeight,
    cameraPosition: { x: 0, y: 0 },
    scale: 1,
    spaceIsPressed: true,
  };

  isListening = false;
  onResize = () => {
    this.setState({ x: window.innerWidth, y: window.innerHeight });
  };

  getMousePosition = (e: MouseEvent): Vector2 => ({
    x: e.clientX,
    y: e.clientY,
  });
  onMouseMove = (e: MouseEvent) => {
    if (this.state.spaceIsPressed && this.isListening && e.buttons == 1) {
      const shift = {
        x: -e.movementX / this.state.scale,
        y: -e.movementY / this.state.scale,
      };
      this.setState({ cameraPosition: add(this.state.cameraPosition, shift) });
    } else if (!this.isListening && e.buttons === 0) {
      this.isListening = false;
    }
  };
  onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") this.setState({ spaceIsPressed: true });
  };
  onKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") this.setState({ spaceIsPressed: false });
  };
  onMouseWheel = (event: Event) => {
    const e = event as WheelEvent;
    const scaleDiff = -e.deltaY / 1000;
    //regular delta is 100\-100
    //screenToWorld
    const mouseOnCanvas = add(
      this.state.cameraPosition,
      multiply(this.getMousePosition(e), scaleDiff)
    );
    this.setState({
      scale: this.state.scale + scaleDiff,
      cameraPosition: mouseOnCanvas,
    });
  };
  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("mousewheel", this.onMouseWheel);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("mousewheel", this.onMouseWheel);
  }

  render() {
    const width = this.state.x / this.state.scale;
    const height = this.state.y / this.state.scale;

    return (
      <div
        onMouseDown={() => (this.isListening = true)}
        onMouseUp={() => (this.isListening = false)}
        className={cn({ "space-is-pressed": this.state.spaceIsPressed })}
      >
        <div className="menu">{Math.round(this.state.scale * 100)}%</div>
        <svg
          viewBox={`${this.state.cameraPosition.x} ${this.state.cameraPosition.y} ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from(new Array(100)).map((_, i) => (
            <rect
              key={i}
              x={i * 50}
              y={i * 50}
              width="50"
              height="50"
              fill={i % 2 == 0 ? "red" : "blue"}
            />
          ))}
        </svg>
      </div>
    );
  }
}

export default App;
