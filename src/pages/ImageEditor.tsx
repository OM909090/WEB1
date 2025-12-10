import { EditorLayout } from '@/components/editor/EditorLayout';
import { Helmet } from 'react-helmet-async';

const ImageEditor = () => {
  return (
    <>
      <Helmet>
        <title>Image Editor - PixelForge AI</title>
        <meta name="description" content="Edit your images with AI-powered tools. Apply filters, adjust colors, and let AI assist your creative workflow." />
      </Helmet>
      <EditorLayout mode="image" />
    </>
  );
};

export default ImageEditor;
