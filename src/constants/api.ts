// 专门存放与后端通信的 URL 常量及辅助函数
// 统一定义基础域名，方便后续替换或根据环境切换
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 列表、创建帖子等无需路径参的接口
export const POSTS_URL = `${BASE_URL}/posts`;

// 需要 id 参数的接口使用函数形式，避免字符串拼接错误
export const postUrl = (id: number | string) => `${BASE_URL}/posts/${id}`;

// 也可以根据实际需要继续补充 —— 例如评论、用户等
// export const COMMENTS_URL = `${BASE_URL}/comments`;
// export const commentUrl = (id: number | string) => `${BASE_URL}/comments/${id}`;

// CRUD 操作封装
export type PostPayload = {
  title?: string;
  body?: string;
  userId?: number;
};

export const postsApi = {
  // 读取全部帖子
  list: async () => fetch(POSTS_URL).then(res => res.json()),

  // 读取单个帖子
  get: async (id: number | string) => fetch(postUrl(id)).then(res => res.json()),

  // 新增帖子
  create: async (data: PostPayload) =>
    fetch(POSTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // 全量更新帖子（PUT）
  update: async (id: number | string, data: PostPayload) =>
    fetch(postUrl(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // 局部更新帖子（PATCH）
  patch: async (id: number | string, data: Partial<PostPayload>) =>
    fetch(postUrl(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // 删除帖子
  remove: async (id: number | string) =>
    fetch(postUrl(id), {
      method: 'DELETE',
    }).then(res => res.ok),
};

// 更新默认导出，集中暴露工具
export default {
  POSTS_URL,
  postUrl,
  postsApi,
}; 
