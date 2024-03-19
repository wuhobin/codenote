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
                text: "入门必看-学习路线", link: "/编程分享/#入门必看-学习路线",
            },
            {
                text: "资源推荐", link: "/编程分享/#资源推荐",
            },
            {
                text: "技术分享", link: "/编程分享/#技术分享",
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
