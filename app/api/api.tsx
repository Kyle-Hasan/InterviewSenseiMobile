import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

import { Navigator, router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
const baseURL = process.env.EXPO_PUBLIC_API_URL;



interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _isRefreshRequest?: boolean;
    _retry?:boolean
}

const api:AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type':'Application/json'
    }
})


api.interceptors.request.use(function (config) {
    debugger
    const token = SecureStore.getItem("accessToken") ;
    if (token) {
        config.headers["Cookie"] = `accessToken=${token};`;
      }
    return config;
  }, function (error) {
   
    return Promise.reject(error);
  });


api.interceptors.response.use(function(response) {

    return response
}, async function (error) {
    const originalRequest = error.config as CustomAxiosRequestConfig
    console.log(error)
    if(error.response.data.message.includes("Bad Token") && !originalRequest._retry && !originalRequest._isRefreshRequest) {
        try{
        originalRequest._retry = true
        const newAccessToken = await refreshToken();
        SecureStore.setItem('accessToken',newAccessToken);
        return api(originalRequest)
        }
        catch(refreshError) {
            console.error("Refresh failed", error)
        }
    }
    else if(originalRequest._isRefreshRequest) {
        router.push('/Login')
    }
    return Promise.reject(error)
})

const refreshToken = async ()=> {
    api.defaults.headers.common['Authorization'] = `Bearer ${SecureStore.getItem("refreshToken")}`
    const response = await api.get(baseURL+'/users/refresh', {
        headers: {
            'Content-Type' :'Application/json'
        },
        _isRefreshRequest:true
    } as CustomAxiosRequestConfig)
    const newAccessToken = response.data
    return newAccessToken;
}



  const authApi = {
        login:(credentials: {username:string, password:string}) => {
            console.log(baseURL)
            return axios.post(baseURL+'/Auth/login',credentials,  {
                headers: {
                    'Content-Type':'Application/json'
                }
            })

        },

        signup:(signupData: {email:string, username:string, password:string}) => {
            return axios.post(baseURL+'/Auth/signup',signupData,  {
                headers: {
                    'Content-Type':'Application/json'
                }
            })
        }
  }

  export {authApi}
  export default api