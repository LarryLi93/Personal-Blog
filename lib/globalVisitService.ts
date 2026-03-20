import { incrementVisitCount, getVisitCount } from './visitService';
import { getOrCreateUserId, hasVisitedInSession, markSessionVisited } from './userUtils';

let visitCountInitialized = false;
let currentVisitCount: number | null = null;
let initPromise: Promise<number> | null = null;

const subscribers: ((count: number) => void)[] = [];

export const subscribeToVisitCount = (callback: (count: number) => void) => {
  subscribers.push(callback);
  
  if (currentVisitCount !== null) {
    callback(currentVisitCount);
  }
  
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };
};

const notifySubscribers = (count: number) => {
  subscribers.forEach(callback => callback(count));
};

export const initializeVisitCount = async (): Promise<number> => {
  if (initPromise) {
    return initPromise;
  }

  if (visitCountInitialized) {
    return currentVisitCount || 10012;
  }

  initPromise = (async () => {
    try {
      // 检查当前会话是否已访问过
      if (hasVisitedInSession()) {
        currentVisitCount = await getVisitCount();
        notifySubscribers(currentVisitCount);
        return currentVisitCount;
      }
      
      const userId = getOrCreateUserId();
      currentVisitCount = await incrementVisitCount(userId);
      visitCountInitialized = true;
      markSessionVisited();
      
      notifySubscribers(currentVisitCount);
      return currentVisitCount;
    } catch (error) {
      console.error('Failed to initialize visit count:', error);
      currentVisitCount = 10012;
      notifySubscribers(currentVisitCount);
      return 10012;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
};

export const getCurrentVisitCount = async (): Promise<number> => {
  if (currentVisitCount !== null) {
    return currentVisitCount;
  }

  try {
    currentVisitCount = await getVisitCount();
    return currentVisitCount;
  } catch (error) {
    console.error('Failed to get visit count:', error);
    return 10012;
  }
};
