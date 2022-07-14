import { get } from "@/request";
//收藏mv
export const subVideo = ({ type, t, id }) => {
  if (type === "v") {
    return get("/video/sub", { t, id, timestamp: Date.now() });
  } else if (type === "mv") {
    return get("/mv/sub", { mvid: id, t, timestamp: Date.now() });
  } else {
    return { code: 404 };
  }
};
//获取收藏的mv
export const getSubMv = () => get("/mv/sublist", { timestamp: Date.now() });
