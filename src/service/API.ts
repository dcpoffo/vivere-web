/* eslint-disable */
import axios from 'axios'

export const useAPI = () => {

  //const baseURL = "http://127.0.0.1:3333";
  //vivere-web-backend.vercel.app
  const baseURL = "https://vivere-web-backend.vercel.app";

  const get = (url: string) => {
    return axios.get(baseURL + url)
  }

  const post = (url: string, data: any) => {
    return axios.post(baseURL + url, data)
  }

  const put = (url: string, data: any) => {
    return axios.put(baseURL + url, data)
  }

  const _delete = (url: string) => {
    return axios.delete(baseURL + url)
  }

  return { get, post, put, _delete }

}