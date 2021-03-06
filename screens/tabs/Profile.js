import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../Fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../../components/UserProfile";

export const ME = gql`{ 
      me{
        user{
         id
      avatar
      username
      fullName
      isFollowing
      isSelf
      bio
         postCount
         followingCount
         followersCount
        }
        posts{
          id
          likeCount
          commentCount
          files{
            id
            url
          }
        }
      }
   }
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(ME);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={refresh} />
    }>
      {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} />}
    </ScrollView>
  );
};