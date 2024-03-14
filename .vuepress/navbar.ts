import {NavItem} from "vuepress/config";

export default [
    {
        text: "开始阅读",
        link: '/directory'
    },
    {
        text: "编程分享",
        link: '/编程分享/',
        items: [
            {
                text: "工具推荐", link: "/编程分享/#工具推荐",
            },
        ]
    },
    {
        text: "作者",
        link: '/author'
    },
    {
        text: "哔哩哔哩",
        link: 'https://space.bilibili.com/495003013'
    },
] as NavItem[];
