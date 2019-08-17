import AsyncStorage from '@react-native-community/async-storage';
import { create } from 'apisauce';

const api = create({
    baseURL: 'http://192.168.1.102:3000',
});

api.addAsyncRequestTransform(request => async () => {
     const token = await AsyncStorage.getItem('@CodeApi:Token');

     if (token) request.headers['authorization'] = `Bearer ${token}`;
});

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;