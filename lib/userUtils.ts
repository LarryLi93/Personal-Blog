export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  
  const STORAGE_KEY = 'blog_visitor_id';
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    userId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
};

export const hasVisitedInSession = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return sessionStorage.getItem('has_visited_session') === 'true';
};

export const markSessionVisited = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  sessionStorage.setItem('has_visited_session', 'true');
};
