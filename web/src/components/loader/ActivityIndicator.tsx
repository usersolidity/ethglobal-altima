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
