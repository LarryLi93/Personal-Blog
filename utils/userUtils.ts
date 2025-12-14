// 用户ID管理工具
const USER_ID_KEY = 'blog_visitor_id';

/**
 * 获取或创建用户唯一ID
 * 使用localStorage存储，确保同一浏览器同一用户只被统计一次
 */
export const getOrCreateUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // 生成新的用户ID
    userId = generateUniqueId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
};

/**
 * 生成唯一ID
 */
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * 检查用户是否是第一次访问（今天）
 */
export const isFirstVisitToday = (): boolean => {
  const lastVisitKey = 'blog_last_visit_date';
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem(lastVisitKey);
  
  if (lastVisit !== today) {
    localStorage.setItem(lastVisitKey, today);
    return true;
  }
  
  return false;
};