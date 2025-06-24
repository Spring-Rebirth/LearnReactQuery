// 专门存放与后端通信的接口封装
// 统一定义基础域名，方便后续替换或根据环境切换
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 帖子URL生成函数，可选ID
const postUrl = (id?: number | string) =>
  id ? `${BASE_URL}/posts/${id}` : `${BASE_URL}/posts`;

// 类型定义
export type PostPayload = {
  title?: string;
  body?: string;
  userId?: number;
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// 帖子接口封装
export const postsApi = {
  // 分页获取帖子列表
  list: async ({ pageParam = 1 }: { pageParam: number }): Promise<Post[]> => {
    const response = await fetch(`${postUrl()}?_page=${pageParam}&_limit=10`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  },

  // 获取所有帖子
  listAll: async (): Promise<Post[]> => {
    const response = await fetch(postUrl());
    if (!response.ok) {
      throw new Error('Failed to fetch all posts');
    }
    return response.json();
  },

  // 获取单个帖子
  get: async (id: number | string): Promise<Post> => {
    const response = await fetch(postUrl(id));
    if (!response.ok) {
      throw new Error(`Failed to fetch post ${id}`);
    }
    return response.json();
  },

  // 创建帖子
  create: async (data: PostPayload): Promise<Post> => {
    const response = await fetch(postUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return response.json();
  },

  // 全量更新帖子
  update: async (id: number | string, data: PostPayload): Promise<Post> => {
    const response = await fetch(postUrl(id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update post ${id}`);
    }
    return response.json();
  },

  // 局部更新帖子
  patch: async (id: number | string, data: Partial<PostPayload>): Promise<Post> => {
    const response = await fetch(postUrl(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to patch post ${id}`);
    }
    return response.json();
  },

  // 删除帖子
  remove: async (id: number | string): Promise<boolean> => {
    const response = await fetch(postUrl(id), {
      method: 'DELETE',
    });
    return response.ok;
  },
}; 
