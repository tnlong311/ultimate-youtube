import React, { useState, useEffect } from 'react';
import useGoogleSheets from 'use-google-sheets';
import getEmbedLink from 'consts';
import './Home.css'

const Home = () => {
  const [count, setCount] = useState(0)
  const [id, setId] = useState("i73MjkMZp6g")
  const [start, setStart] = useState(0)

  const { data, loading, error, refetch } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
  });

  const Sheet = () => {
    const addCount = () => {
      setCount(count+1)
    }
  
    const desCount = () => {
      if (count !== 0) {
        setCount(count-1)
      }
    }
  
    const getLinkData = (e) => {
      refetch()
      if (e === 0) {
        desCount()
      } else {
        addCount()
      }
  
      if (error) {
        console.log(error)
      } else {
        const sheet_data = data[0]["data"]
  
        // console.log(sheet_data)
  
        let link_cell = sheet_data[count]["Link"]
  
        if (link_cell.length !== 0) {
          let link_data = link_cell.split('be/')[1].split('?t=')
  
          if (link_data[0] !== undefined) {
            setId(link_data[0])
          }
  
          if (link_data[1] !== undefined) {
            setStart(link_data[1])
          }
  
          console.log(getEmbedLink(id, start))
        }
      }
      
      return;
    }
  
    const NextButton = () => {
      return (
      <div>
        <button onClick={() => getLinkData(1)}>Next video</button>
      </div>
      )
    }

    const BackButton = () => {
      return (
      <div className='px-4'>
        <button onClick={() => getLinkData(0)}>Previous video</button>
      </div>
      )
    }
  
    return (
      <div className='d-flex w-100 justify-content-center mt-4'>
        <BackButton></BackButton>
        <NextButton></NextButton>
      </div>
    )
  }

  return (
    <div id="vid-container" className='d-flex flex-column justify-content-center align-items-center w-100 my-auto'>
      <iframe src={getEmbedLink(id, start)} title="YouTube video player" 
      frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen classname=''></iframe>
      <Sheet></Sheet>
    </div>
  )
}

export default Home