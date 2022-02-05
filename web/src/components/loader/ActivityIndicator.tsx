import styled from "styled-components";

const Container = styled.div`
  color: white;
  font-size: 32px;
  text-align: center;
`;

export default function ActivityIndicator() {
  return (
    <Container>Loading...</Container>
  )
}

// export default function Web3Button({ label, handleClick }) {
//   return (
//     <button onClick={handleClick}>{label}</button>
//   )
// }
