export const generateChunkName = (filename: string, index: number) => {
  return `${filename}_part_${index}.chunk`;
};
