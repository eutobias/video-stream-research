import { create } from "zustand";
import { Chunks, generateFileChunks } from "../lib";
import { uploadService } from "../services/upload.service";

type UploadStoreProps = {
  video: File | null;
  chunks: Chunks[];
  uploading: boolean;
  uploaded: boolean;
  progress: number;
};

type UploadStoreActions = {
  startUpload: (file: File) => void;
  uploadChunk: () => void;
  reset: () => void;
};

type UploadStoreState = UploadStoreProps & UploadStoreActions;

const INITIAL_PROPS = {
  video: null,
  chunks: [],
  uploading: false,
  uploaded: false,
  progress: 0,
};

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  ...INITIAL_PROPS,
  startUpload: (file) => {
    const chunks = generateFileChunks(file);

    set(() => ({
      video: file,
      chunks,
      uploading: true,
    }));
    get().uploadChunk();
  },
  uploadChunk: async () => {
    const { chunks } = get();
    if (chunks.length === 0)
      return set(() => ({
        progress: 100,
        uploading: false,
        uploaded: true,
      }));

    const chunk = chunks[0];
    const progress = (chunk.index / chunk.totalChunks) * 100;

    await uploadService.upload(chunk);

    chunks.shift();
    set(() => ({
      chunks,
      progress,
    }));
    get().uploadChunk();
  },
  reset: () => {
    console.log("reset")
    set((state) => ({ ...state, ...INITIAL_PROPS }));
  },
}));
