import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import PieChartIcon from '../Assets/PieChart.svg'
import BarChartIcon from '../Assets/BarChart.svg'
import LineChartIcon from '../Assets/LineChart.svg'
import PieChart from './PieChart';
import BarGraph from './BarGraph';

const FileUpload = ({ onFileUpload }) => {
  // Specify file extensions
  const acceptedFileTypes = ['.xlsx', '.csv']; 
  //user's dataset related use state variables
  const [fileLoaded, setFileLoaded] = useState(false);
  const [enteredDataJSON, setEnteredDataJSON] = useState([]);
  const [inputDataVariables, setInputDataVariables] = useState(['']);
  //pie chart use state variables
  const [selectedPieChartVarible, setSelectedPieChartVarible] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [pieChartTitle, setPieChartTitle] = useState('')
  //bar graph use state variables
  const [selectedBarGraphVaribleX, setSelectedBarGraphVaribleX] = useState(null);
  const [selectedBarGraphVaribleY, setSelectedBarGraphVaribleY] = useState(null);
  const [barGraphDataX, setBarGraphtDataX] = useState(null);
  const [barGraphDataY, setBarGraphtDataY] = useState(null);
  const [barGraphTitle, setBarGraphTitle] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    // Ensure only one file is uploaded
    if (acceptedFiles.length === 1) {
      const fileToParse = acceptedFiles[0];
      // Parse data from uploaded file to JSON object
      parseCsvFile(fileToParse);
      onFileUpload(fileToParse);
    } else {
      alert('Please upload only one file.');
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.join(','), // Specify accepted file types
    maxFiles: 1 // Ensure only one file is accepted
  });

  //perform csv to JSON parse when file is uploaded
  const parseCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const csv = reader.result;
      // Parse CSV string to JSON using papaparse
      Papa.parse(csv, {
        header: true,
        complete: (results) => {
          //set variable for json data which is used to send to server upon request
          setEnteredDataJSON(results.data);
          //grab the variables from user's dataset
          const dataVariables = getAllKeys(results.data);
          setInputDataVariables(dataVariables);
          //update view to show user graphing options
          setFileLoaded(true);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    };
    reader.readAsText(file);
  };

  //retrieve variables from user's dataset
  function getAllKeys(arrayOfObjects) {
    let keys = [];
    arrayOfObjects.forEach(obj => {
      keys = keys.concat(Object.keys(obj));
    });
    // Remove duplicate variables if there are any
    return [...new Set(keys)];
  }

  useEffect(() => {
    // Update the pieChartData when the user selects a variable
    selectedPieChartVarible && setPieChartData(countOccurrencesByKey());
  }, [selectedPieChartVarible]);

  useEffect(() => {
    // Update the pieChartData when the user selects a variable
    selectedBarGraphVaribleX && setBarGraphtDataX(getValuesFromVariable(selectedBarGraphVaribleX))
    console.log('selectedBarGraphVaribleX updated to: ', selectedBarGraphVaribleX)
  }, [selectedBarGraphVaribleX]);

  useEffect(() => {
    // Update the pieChartData when the user selects a variable
    selectedBarGraphVaribleY && setBarGraphtDataY(getValuesFromVariable(selectedBarGraphVaribleY))
    console.log('selectedBarGraphVaribleY updated to: ', selectedBarGraphVaribleY)
  }, [selectedBarGraphVaribleY]);

  const setBarGraphVariables = ( variableSelected ) => {
    if(!selectedBarGraphVaribleX) {
      setSelectedBarGraphVaribleX(variableSelected);
    } else {
      !selectedBarGraphVaribleY && setSelectedBarGraphVaribleY(variableSelected);
    }
  } ;

  const clearBarGraphSelection = () => {
    setSelectedBarGraphVaribleX(null);
    setSelectedBarGraphVaribleY(null);
    setBarGraphtDataX(null);
    setBarGraphtDataY(null);
  };

  function countOccurrencesByKey() {
    const result = [];
    // Iterate over the JSON object
    enteredDataJSON.forEach(item => {
      const keyValue = item[selectedPieChartVarible];
      let found = false;
      // Check if the key value already exists in the result array
      for (let i = 0; i < result.length; i++) {
        if (result[i].name === keyValue) {
          // If the key value exists, increment its count
          result[i].value++;
          found = true;
          break;
        }
      }
      // If the key value is not found in result, add it with count 1
      if (!found) {
        result.push({ value: 1, name: keyValue });
      }
    });
    return result;
  }

  function getValuesFromVariable( variable ){
    const result = [];
    // Iterate over the JSON object
    enteredDataJSON.forEach(item => {
      result.push(item[variable]);
    })
    return result;
  }

  return (
    <>
      {fileLoaded ? <>
        <h2 className='chart-generation-heading'>Select a Variable from your data to display in Pie Chart</h2>
        <h3 className='chart-generation-subheading'>* This pie chart displays counts of recurring values within a variable. For numeric value displays use the bar graph.</h3>
        <div className='graph-type-container'>
          <img src={PieChartIcon} alt='pie chart icon'></img>
          <div>
            <input typeof='text' className='graph-title-input' placeholder='Optionally enter a title here' value={pieChartTitle} onChange={(e) => setPieChartTitle(e.target.value)}></input>
            <div className='graph-selection-container'>
              {inputDataVariables.map((dataVariable, index) => (
                <div className='variable-select-button' key={index} onClick={() => setSelectedPieChartVarible(dataVariable)} 
                  style={selectedPieChartVarible === dataVariable ? {  backgroundColor: '#63E6BE', borderColor: '#63E6BE' } : {}}>{dataVariable}</div>
              ))}
            </div> 
          </div>
        </div>
        {pieChartData && <PieChart dataset={pieChartData} chartTitle={pieChartTitle}></PieChart>}
        <h2 className='chart-generation-heading'>Select an X and Y Variable from your data to display in Bar Graph</h2>
        <h3 className='chart-generation-subheading'>* X typically represents the associated name or entity, Y is required to be numeric values.</h3>
        <div className='graph-type-container-xy'>
          <img src={BarChartIcon} alt='bar chart icon'></img>
          <div>
            <input typeof='text' className='graph-title-input' placeholder='Optionally enter a title here' value={barGraphTitle} onChange={(e) => setBarGraphTitle(e.target.value)}></input>
            <div className='graph-selection-container'>
            {inputDataVariables.map((dataVariable, index) => (
              <div className='variable-select-button' key={index}  onClick={() => setBarGraphVariables(dataVariable)}
                style={(selectedBarGraphVaribleX === dataVariable ? { backgroundColor: '#B197FC', borderColor: '#B197FC' } : 
                    (selectedBarGraphVaribleY === dataVariable ? { backgroundColor: '#FFD43B', borderColor: '#FFD43B' } : {}))}
                >{dataVariable}</div>
            ))}
          </div>
          </div>
          <div className='legend-xy'>
            <div style={{backgroundColor: '#B197FC'}}>X</div>
            <div style={{backgroundColor: '#FFD43B'}}>Y</div>
          </div>
        </div>
        {(barGraphDataX && barGraphDataY) && <>
          <button className='clear-button' onClick={()=> clearBarGraphSelection()}>Clear Selection</button>
          <BarGraph datasetX={barGraphDataX} datasetY={barGraphDataY} chartTitle={barGraphTitle}></BarGraph>
        </>}
        <h2 className='chart-generation-heading'>Select X and Y Variables from your data to display in Line Graph</h2>
        <h3 style={{textAlign: 'center', color: 'red'}}>Line graphs coming soon...</h3>
        <div className='graph-type-container'>
          <img src={LineChartIcon} alt='line graph icon'></img>
          <div className='graph-selection-container'>
            {inputDataVariables.map((dataVariable, index) => (
              <div className='variable-select-button' key={index}>{dataVariable}</div>
            ))}
          </div>
        </div>
      </> : <>
        <div className='file-drop-conatiner' {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop your .xlsx or .csv file here, or click anywhere to open file browser.</p>
        </div>
      </>}
      
    </>
  );
};

export default FileUpload;
