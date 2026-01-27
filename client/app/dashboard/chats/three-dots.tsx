import { TypeAnimation } from "react-type-animation";

export const ThreeDots = () => {
  return (
    <TypeAnimation
      sequence={[".", 300, "..", 300, "...", 300]}
      wrapper="span"
      cursor={false}
      repeat={Infinity}
      style={{
        fontSize: "1.25rem",
        display: "inline-block",
        letterSpacing: "2px",
      }}
    />
  );
};
