import { useEffect } from "react";
import "./App.css";
import { InputFile } from "./components/input-file";
import { ProgressBar } from "./components/progressbar";
import { Section } from "./components/section";
import { VideoPlayer } from "./components/video-player/video-player.component";
import { useUploadStore } from "./stores/upload.store";
import { useVideoStore } from "./stores/videos.store";
import { VBox } from "./components/vbox";

function App() {
  const { progress, uploading, uploaded, startUpload, video, reset } =
    useUploadStore();
  const { videos, loadVideos } = useVideoStore();

  const handleVideoUpload = (file: File | null) => {
    if (!file) return;
    startUpload(file);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    if (progress === 100 && uploaded) {
      reset();
      loadVideos();
    }
  }, [progress, uploaded]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
      <Section title="Home">
        <p>Hello, people.</p>
        <p>
          This is a mini application research
          <br /> about video streaming route.
        </p>

        <VBox>
          <InputFile onSelectFile={handleVideoUpload} selectedFileName={video?.name} />

          {uploading && <ProgressBar value={progress} />}
          {uploaded && (
            <VideoPlayer url={`http://localhost:3001/watch/${video?.name}`} />
          )}
        </VBox>
      </Section>
      {videos?.length > 0 && (
        <Section title="Uploaded Videos">
          <VBox>
            {videos.map((video) => (
              <div key={video}>
                <h4>{video}</h4>
                <VideoPlayer url={`http://localhost:3001/watch/${video}`} />
              </div>
            ))}
          </VBox>
        </Section>
      )}
    </div>
  );
}

export default App;
