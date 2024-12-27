export const fetchUser = async (token: string): Promise<any | null> => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };