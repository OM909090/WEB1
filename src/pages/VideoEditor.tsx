import { VideoEditorLayout } from '@/components/editor/VideoEditorLayout';
import { Helmet } from 'react-helmet-async';

const VideoEditor = () => {
  return (
    <>
      <Helmet>
        <title>Video Editor - PixelForge AI</title>
        <meta name="description" content="Edit your videos with AI-powered tools. Trim, cut, add effects, and import from YouTube or local files." />
      </Helmet>
      <VideoEditorLayout />
    </>
  );
};

export default VideoEditor;
