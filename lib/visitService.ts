const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface VisitCountResponse {
  count: number;
}

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
    return 10012;
  }
};

export const incrementVisitCount = async (userId?: string): Promise<number> => {
  try {
    const url = userId 
      ? `${API_BASE_URL}/api/visit-count/increment?user_id=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/api/visit-count/increment`;
    
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Failed to increment visit count: ${response.status}`);
    }
    const data: VisitCountResponse = await response.json();
    return data.count;
  } catch (error) {
    console.error('Error incrementing visit count:', error);
    return 10012;
  }
};
