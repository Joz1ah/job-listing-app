import { FC, useRef, useEffect } from "react";

type VideoProps = {
  src: string;
  className?: string;
};

const Video: FC<VideoProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
    }
  }, []);

  return (
    <video ref={videoRef} className={className} autoPlay muted loop playsInline>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
