import './App.css';
import backgroundSVG from './pattern-randomized.svg'
import React, { useState } from 'react';
import FileUpload from './Components/FileUpload';


function App() {
  //useState variables
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  //run when file is uploaded
  const handleFileUpload = (files) => {
    setUploadedFiles(files);
    setFileUploaded(true);
  };

  return (
    <>
    <img className='backdrop' src={backgroundSVG}></img>
    <div className="content-container">
      <div className='heading-container'>
        <h1>Hi, Welcome to ShowMyData.</h1>
        <h2>{fileUploaded ? 'Success! Use the section below to generate your desired charts.' 
        : 'Drag and drop some data in a Comma Separated Value (.csv) file, JSON file or .txt (in JSON format) file to generate some charts.'}</h2>
      </div>
      <FileUpload onFileUpload={handleFileUpload} />
    </div>
    </>
  );
}

export default App;
