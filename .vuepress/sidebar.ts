import {SidebarConfig4Multiple} from "vuepress/config";

import programmingShareSideBar from "./sidebars/programmingShareSideBar";

// @ts-ignore
export default {
    "/编程分享/": programmingShareSideBar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;
