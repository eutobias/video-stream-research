import { Chunks } from "../lib";

export const uploadService = {
  upload: async (chunk: Chunks) => {
    const formData = new FormData();
    formData.append("file", chunk.file, chunk.name);
    formData.append("index", chunk.index.toString());
    formData.append("total", chunk.totalChunks.toString());
    formData.append("name", chunk.name);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });
    return response.json();
  },
};
