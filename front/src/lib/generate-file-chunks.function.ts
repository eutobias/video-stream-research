export type Chunks = {
  name: string;
  file: File;
  index: number;
  totalChunks: number;
}

export const generateFileChunks = (file: File): Chunks[] => {
  const chunkSize: number = 1024 * 1024 * 50; // 50 MB
  const totalChunks = Math.ceil(file.size / chunkSize);
  const chunks: Chunks[] = [];
  let offset = 0;
  while (offset < file.size) {
    const chunk:Chunks = {
        name: file.name,
        file: file.slice(offset, offset + chunkSize) as File,
        index: Math.floor(offset / chunkSize),
        totalChunks,
    };
    chunks.push(chunk);
    offset += chunkSize;
  }
  return chunks;
};
