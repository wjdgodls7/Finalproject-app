import React from "react";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import styles from "../styles";

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`;


const Text = styled.Text`
  color: ${styles.navyColor};
  font-weight: 600;
  font-size:15px;
`;

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("Upload", { photo: navigation.getParam("photo") })}>
    <Text>Next</Text>
  </Container>
));