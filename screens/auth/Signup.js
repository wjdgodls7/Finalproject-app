import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from "react-apollo-hooks";
import { CREATE_ACCOUNT } from "./AuthQueries";
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const FBContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-color: ${props => props.theme.lightGreyColor};
  border-style: solid;
`;
const GGContainer = styled.View`
margin-top: 20px;`;

export default ({ navigation }) => {
  const fNameInput = useInput("");
  const lNameInput = useInput("");
  const emailInput = useInput(navigation.getParam("email", ""));
  const usernameInput = useInput("");
  const [loading, setLoading] = useState(false);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: usernameInput.value,
      email: emailInput.value,
      firstName: fNameInput.value,
      lastName: lNameInput.value
    }
  });
  const handleSingup = async () => {
    const { value: email } = emailInput;
    const { value: fName } = fNameInput;
    const { value: lName } = lNameInput;
    const { value: username } = usernameInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("That email is invalid");
    }
    if (fName === "" || lName === "") {
      return Alert.alert("I need your name");
    }
    if (username === "") {
      return Alert.alert("Invalid username");
    }
    try {
      setLoading(true);
      const {
        data: { createAccount }
      } = await createAccountMutation();
      if (createAccount) {
        Alert.alert("Account created", "Log in now!");
        navigation.navigate("Login", { email });
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Username taken.", "Log in instead");
      navigation.navigate("Login", { email });
    } finally {
      setLoading(false);
    }
  };
  const FBlogIn = async () => {
    try {
      setLoading(true);
      await Facebook.initializeAsync({
        appId: '2733777443554055',
      });
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', "email"],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`);
        const { email, first_name, last_name } = await response.json();
        updateFormData(email, first_name, last_name)
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
  const GGLogIn = async () => {
    try {
      setLoading(true);
      const result = await Google.logInAsync({
        androidClientId: "279164621755-lr72g7uhmf7mjeudc8noiuk9td7ddscl.apps.googleusercontent.com",
        iosClientId: "279164621755-la27utrs44j9bmm53ro23r77dgm9cchk.apps.googleusercontent.com",
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        const user = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${result.accessToken}` }
        });
        const { email, family_name, given_name } = await user.json();
        updateFormData(email, family_name, given_name);
        const data = await user.json();
        console.log(data);
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    } finally {
      setLoading(false);
    }
  };
  const updateFormData = (email, firstName, lastName) => {
    emailInput.setValue(email);
    fNameInput.setValue(firstName);
    lNameInput.setValue(lastName);
    const [username] = email.split("@");
    usernameInput.setValue(username);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...fNameInput}
          placeholder="First name"
          autoCapitalize="words"
        />
        <AuthInput
          {...lNameInput}
          placeholder="Last name"
          autoCapitalize="words"
        />
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthInput
          {...usernameInput}
          placeholder="Username"
          returnKeyType="send"
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleSingup} text="Sign up" />
        <FBContainer>
          <AuthButton loading={loading} onPress={FBlogIn} text="Connect Facebook" />
        </FBContainer>
        <GGContainer>
          <AuthButton loading={loading} onPress={GGLogIn} text="Connect Google" />
        </GGContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};