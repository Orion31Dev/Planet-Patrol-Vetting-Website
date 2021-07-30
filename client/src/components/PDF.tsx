import React, { useState } from 'react';

import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';

export default function PDF(props: { url: string }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  function changePage(by: number) {
    if (pageNumber + by > numPages || numPages + by < 0) return;
    setPageNumber(pageNumber + by);
  }

  return (
    <div className="pdf">
      <Document file={'/proxy/' + props.url} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={pageNumber} renderTextLayer={false} />
      </Document>
      <div className="controls">
        <div className="btn" onClick={() => changePage(1)}>{'<'}</div>
        <div className="page-num">{pageNumber} of {numPages}</div>
        <div className="btn" onClick={() => changePage(-1)}>{'>'}</div>
      </div>
    </div>
  );
}
