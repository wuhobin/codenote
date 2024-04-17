import {SidebarConfig4Multiple} from "vuepress/config";

import programmingShareSideBar from "./sidebars/programmingShareSideBar";
import interviewTopicSideBar from "./sidebars/interviewTopicSideBar";

// @ts-ignore
export default {
    "/编程分享/": programmingShareSideBar,
    "/面试专题/": interviewTopicSideBar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;
