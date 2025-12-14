// 后端API地址，根据实际情况修改
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface VisitCountResponse {
  count: number;
}

/**
 * 获取当前访问人数
 */
export const getVisitCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/visit-count`);
    if (!response.ok) {
      throw new Error('Failed to fetch visit count');
    }
    const data: VisitCountResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error fetching visit count:', error);
    return 0;
  }
};

/**
 * 增加访问人数并返回新的计数（基于用户ID去重）
 */
export const incrementVisitCount = async (userId?: string): Promise<number> => {
  try {
    const url = userId 
      ? `${API_BASE_URL}/api/visit-count/increment?user_id=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/api/visit-count/increment`;
    
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to increment visit count: ${response.status} ${response.statusText}`);
    }
    const data: VisitCountResponse = await response.json();
    console.log('Visit count response:', data);
    return data.count;
  } catch (error) {
    console.error('Error incrementing visit count:', error);
    return 0;
  }
};

