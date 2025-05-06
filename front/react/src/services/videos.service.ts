export const videoService = {
  list: async () => {
    const response = await fetch("http://localhost:3001/videos");
    return response.json();
  },
};
