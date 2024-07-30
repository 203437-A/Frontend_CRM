import axios from 'axios';

const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
        console.error("No refresh token found in localStorage");
        return null;
    }

    console.log("Attempting to refresh token with refresh token:", refreshToken);

    try {
        const response = await axios.post('api/login/refresh/', { refresh: refreshToken }, {
            headers: { 'Content-Type': 'application/json' } 
        });
        console.log("Token refreshed successfully:", response.data);
        const newAccessToken = response.data.access;
        localStorage.setItem('token', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        return null;
    }
};

export { refreshAuthToken };
