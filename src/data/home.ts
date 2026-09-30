// 首页展示素材接口；不写入作品 Schema。之后替换 src 即可，位置仍由 token 控制。
export const homePresentation: {
  backgroundWord: string;
  folderLabel: string;
  stickers: { src?: string; alt: string; placeholder: string }[];
} = {
  backgroundWord: 'welcome',
  folderLabel: 'Portfolio',
  stickers: [
    { alt: '圆形贴纸占位', placeholder: '01' },
    { alt: '小贴纸占位', placeholder: '02' },
  ],
};
