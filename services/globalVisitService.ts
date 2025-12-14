import { incrementVisitCount, getVisitCount } from './visitService';
import { getOrCreateUserId } from '../utils/userUtils';

let visitCountInitialized = false;
let currentVisitCount: number | null = null;
let initPromise: Promise<number> | null = null;

// 订阅者列表
const subscribers: ((count: number) => void)[] = [];

/**
 * 订阅访问人数变化
 */
export const subscribeToVisitCount = (callback: (count: number) => void) => {
  subscribers.push(callback);
  
  // 如果已经有计数，立即调用回调
  if (currentVisitCount !== null) {
    callback(currentVisitCount);
  }
  
  // 返回取消订阅函数
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

/**
 * 通知所有订阅者访问人数已更新
 */
const notifySubscribers = (count: number) => {
  subscribers.forEach(callback => callback(count));
};

/**
 * 初始化访问人数 - 只在第一次调用时增加计数（基于用户ID去重）
 */
export const initializeVisitCount = async (): Promise<number> => {
  // 如果已经在初始化中，返回同一个Promise
  if (initPromise) {
    return initPromise;
  }

  // 如果已经初始化过，直接返回当前计数
  if (visitCountInitialized) {
    return currentVisitCount || 0;
  }

  // 创建初始化Promise
  initPromise = (async () => {
    try {
      console.log('Initializing visit count...');
      // 获取或创建用户ID
      const userId = getOrCreateUserId();
      // 使用用户ID增加访问人数
      currentVisitCount = await incrementVisitCount(userId);
      visitCountInitialized = true;
      console.log('Visit count initialized to:', currentVisitCount);
      
      // 通知所有订阅者
      notifySubscribers(currentVisitCount);
      
      return currentVisitCount;
    } catch (error) {
      console.error('Failed to initialize visit count:', error);
      currentVisitCount = 0;
      visitCountInitialized = true;
      
      // 通知所有订阅者
      notifySubscribers(currentVisitCount);
      
      return 0;
    } finally {
      // 清理Promise引用
      initPromise = null;
    }
  })();

  return initPromise;
};

/**
 * 获取当前访问人数
 */
export const getCurrentVisitCount = async (): Promise<number> => {
  if (currentVisitCount !== null) {
    return currentVisitCount;
  }

  try {
    currentVisitCount = await getVisitCount();
    return currentVisitCount;
  } catch (error) {
    console.error('Failed to get visit count:', error);
    return 0;
  }
};