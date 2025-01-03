import { useGetUserInfoQuery,akazaApiAccount } from 'api/akaza/akazaAPI';
import { useDispatch } from 'react-redux';

export const getUserInfo = async (): Promise<any | null> => {
  const dispatch = useDispatch();
    try {
      const { data: userInfo, error, isLoading } = useGetUserInfoQuery(null)
      if (isLoading) {
        console.log("Loading user info...");
        return null; // No display, just process the logic
      }
    
      if (error) {
        console.error("Error fetching user info:", error);
        return null;
      }
    
      if (userInfo) {
        dispatch(akazaApiAccount.util.resetApiState());
        return userInfo
        //const processedData = processUserInfo(userInfo); 
        //console.log("Processed Data:", processedData);
      }

      return null; 

    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };
