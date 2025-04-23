type VideoPlayerProps = {
  url: string;
};

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <video id="videoPlayer" width="650" controls>
      <source src={url} type="video/mp4" />
    </video>
  );
};
