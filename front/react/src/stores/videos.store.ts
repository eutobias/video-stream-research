import { create } from "zustand";
import { videoService } from "../services/videos.service";

type VideosStoreProps = {
  videos: string[];
};

type VideosStoreActions = {
  loadVideos: () => void;
};
type VideosStoreState = VideosStoreProps & VideosStoreActions;

export const useVideoStore = create<VideosStoreState>((set) => ({
  videos: [],
  loadVideos: async () => {    
    const data = await videoService.list();
    set({ videos: data })
  },
}));
