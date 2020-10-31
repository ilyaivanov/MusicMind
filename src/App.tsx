import React from "react";
import "./App.css";
import * as u from "./utils";
import GoButton from "./GoButton";

interface State {
  windowDimensions: u.Vector2;
  cameraPosition: u.Vector2;
  scale: number;
  spaceIsPressed: boolean;
  image: string;
}

class App extends React.Component<any, State> {
  state = {
    windowDimensions: u.vector(window.innerWidth, window.innerHeight),
    cameraPosition: u.vector(0, 0),
    scale: 1,
    spaceIsPressed: false,
    image: "",
  };

  isListening = false;

  onResize = () =>
    this.setState({
      windowDimensions: u.vector(window.innerWidth, window.innerHeight),
    });

  getMousePosition = (e: MouseEvent): u.Vector2 =>
    u.vector(e.clientX, e.clientY);

  onMouseMove = (e: MouseEvent) => {
    if (this.state.spaceIsPressed && this.isListening && e.buttons == 1) {
      const shift = u.vector(
        -e.movementX / this.state.scale,
        -e.movementY / this.state.scale
      );
      this.setState({
        cameraPosition: u.add(this.state.cameraPosition, shift),
      });
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
    //regular delta is 100 or -100, so our step is always 10%
    // other apps do not do this like that.
    // They probably scale "scale factor" not always by 10%
    // Checkout Figma for example
    const nextScale =
      this.state.scale + this.state.scale * 0.1 * (-e.deltaY / 100);
    const mousePosition = this.getMousePosition(e);
    const currentMouseWorldPosition = u.add(
      this.state.cameraPosition,
      u.multiply(mousePosition, 1 / this.state.scale)
    );
    const nextMouseWorldPosition = u.add(
      this.state.cameraPosition,
      u.multiply(mousePosition, 1 / nextScale)
    );
    const diff = u.difference(
      currentMouseWorldPosition,
      nextMouseWorldPosition
    );
    const nextCameraPosition = u.add(this.state.cameraPosition, diff);

    this.setState({
      scale: nextScale,
      cameraPosition: nextCameraPosition,
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
    const scaledWindowDimensions = u.divide(
      this.state.windowDimensions,
      this.state.scale
    );

    return (
      <div
        onMouseDown={() => (this.isListening = true)}
        onMouseUp={() => (this.isListening = false)}
        className={u.cn({ "space-is-pressed": this.state.spaceIsPressed })}
      >
        <div className="menu" onClick={() => this.setState({ scale: 1 })}>
          {Math.round(this.state.scale * 100)}%
        </div>
        <svg
          style={{ backgroundColor: "#E9E9E9" }}
          viewBox={`${this.state.cameraPosition.x} ${this.state.cameraPosition.y} ${scaledWindowDimensions.x} ${scaledWindowDimensions.y}`}
          xmlns="http://www.w3.org/2000/svg"
        ><defs>
          <rect id="rect" x="25%" y="25%" width="50%" height="50%" rx="15"/>
          <clipPath id="clip">
            <use xlinkHref="#rect"/>
          </clipPath>
        </defs>

          <circle cx="150" cy="150" r="20" style={{ fill: "pink" }} />
          {this.state.image && (
            <image
              x={400}
              y={50}
              href={this.state.image}
              clipPath="url(#clip)"
              height="180"
              width="320"
            />
          )}
        </svg>

        <GoButton onImageFound={(image) => this.setState({ image })} />
      </div>
    );
  }
}

export default App;
