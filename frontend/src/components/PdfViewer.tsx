const PdfViewer = ({ url } : { url: string }) => {
  return (
    <iframe src={'https://docs.google.com/gview?url=' + url + '&embedded=true'} 
    style={{ width: '100%', height: '100%' }} />
  );
};
export default PdfViewer;