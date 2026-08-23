// 🛡️ 本文件由 XingHuiSama 控制台自动生成，请勿手动修改
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "title": "燕云十六声",
    "description": "苍生无言 侠为其声",
    "cover": "https://img.cdn1.vip/i/6a8b5be0cf3de_1787517920.webp",
    "id": "album_1787517930257",
    "photos": [
      {
        "url": "https://img.cdn1.vip/i/6a8b54626a1d2_1787516002.webp",
        "caption": ""
      },
      {
        "url": "https://img.cdn1.vip/i/6a8b549770e70_1787516055.webp"
      },
      {
        "url": "https://img.cdn1.vip/i/6a8b54d4b0564_1787516116.webp"
      }
    ],
    "date": "2026-08-23"
  }
];