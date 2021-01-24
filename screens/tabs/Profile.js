import React from "react";
import styled from "styled-components/native";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text`
justify-content: center;
  align-items: center;`;

export default () => (
  <View>
    <Text>Profile</Text>
  </View>
);