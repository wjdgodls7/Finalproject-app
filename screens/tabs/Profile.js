import React from "react";
import { gql } from 'apollo-boost';
import { useQuery } from "react-apollo-hooks";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../../components/Loader";
import UserProfile from '../../components/UserProfile';

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

export default () => {
  const { loading, data } = useQuery(ME);

  return <ScrollView>{loading ? <Loader /> : data && data.me && <UserProfile{...data.me} />}</ScrollView>;
}