import React, { useState } from 'react';

import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';

export default function PDF(props: { url: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf">
      <Document file={'https://cors-anywhere.herokuapp.com/' + props.url} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <span>
        Page {pageNumber} of {numPages}
      </span>
    </div>
  );
}