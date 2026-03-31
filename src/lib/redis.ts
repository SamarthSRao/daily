export const saveState = async (key: string, data: any) => {
  const serialized = JSON.stringify(data);
  // Always update local storage first for instant feedback/resilience
  localStorage.setItem(key, serialized);

  try {
    const res = await fetch(`/api/redis?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: serialized,
    });
    if (!res.ok) {
      console.error(`Failed to sync to Redis proxy: ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    console.error("Failed to sync to Redis proxy (network error)", e);
  }
};

export const loadState = async (key: string, defaultValue: any) => {
  try {
    const res = await fetch(`/api/redis?key=${key}`);
    if (res.ok) {
      const data = await res.json();
      if (data !== null && data !== undefined) {
        // Update local cache if we got remote data
        localStorage.setItem(key, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {
    console.error("Failed to load from Redis proxy", e);
  }

  // Fallback to localStorage if the proxy is down or has no data
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};