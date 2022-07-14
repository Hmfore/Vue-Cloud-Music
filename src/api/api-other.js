// 用于获取图片的api
import { get, post } from "../request";
//获取轮播图
export const getBanner = () => get("/banner");
//获取热搜
export const getHotSearch = () => get("/search/hot/detail");
//获取搜索建议
export const getSuggest = ({ type, keywords }) =>
  get("/search/suggest", { type, keywords });

//搜索页
export const search = ({ limit, offset, type, keywords }) =>
  get("/cloudsearch", { limit, offset, type, keywords });
