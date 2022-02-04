import styled from "styled-components";

interface IAtkDefIconProps {
  size?: string;
}

const getPixelFromSize = (size?: string) => {
  if (!size || size === "default") {
    return 18;
  }
  if (size === "small") {
    return 15;
  }
  return 30;
}

const AtkDefIcon = styled.img<IAtkDefIconProps>`
  width: auto;
  height: ${props => getPixelFromSize(props.size)}px;
  margin: 0 4px;
`;

AtkDefIcon.defaultProps = {
  size: "default"
}

export default AtkDefIcon;
