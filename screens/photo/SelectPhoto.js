import React, { useState, useEffect } from "react";
import { Image, ScrollView, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import Loader from "../../components/Loader";
import constants from "../../constants";

const View = styled.View`
  flex: 1;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [selected, setSelected] = useState([]);
  const [allPhotos, setAllPhotos] = useState();

  const changeSelected = photo => {
    setSelected(photo);
    console.log(selected);
  };

  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync();
      const [firstPhoto] = assets;
      setSelected(firstPhoto);
      setAllPhotos(assets);
      navigation.navigate("PhotoTabs", { photo: firstPhoto })
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);

    }
  };

  const askPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
        getPhotos();
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);

  navigation.navigate("PhotoTabs", { photo: selected });

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
          <View>
            {hasPermission ? (
              <>
                <Image
                  style={{ width: constants.width, height: constants.height / 1.7 }}
                  source={{ uri: selected.uri }}
                />
                {/* <Button onPress={handleSelected}>
                  <Text>Next</Text>
                </Button> */}
                <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {allPhotos.map(photo => (
                    <TouchableOpacity
                      key={photo.id}
                      onPress={() => changeSelected(photo)}
                    >
                      <Image
                        source={{ uri: photo.uri }}
                        style={{
                          width: constants.width / 3,
                          height: constants.height / 6,
                          opacity: photo.id === selected.id ? 0.5 : 1
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : null}
          </View>
        )}
    </View>
  );
};