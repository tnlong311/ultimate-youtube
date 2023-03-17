import React, { useState, useEffect } from 'react';
import useGoogleSheets from 'use-google-sheets';
import { getEmbedLink, pageNumRegex } from 'consts';
import './Home.css'

const Home = () => {
  const [count, setCount] = useState(-1)
  const [formCount, setFormCount] = useState(-1)

  const [tag, setTag] = useState('Offense')
  const [note, setNote] = useState('This is an empty note')
  const [id, setId] = useState('i73MjkMZp6g')
  const [start, setStart] = useState(0)

  const { data, loading, error, refetch } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEET_ID,
  });

  useEffect(() => {
    setFormCount(count)
  }, [count])

  const addCount = () => {
    setCount(count+1)
    console.log("count: " + count)
  }

  const desCount = () => {
    if (count > 0) {
      setCount(count-1)
    }
  }
  
  
  const getLinkData = () => {
    refetch()

    if (error) {
      console.log(error)
    } else {
      const sheet_data = data[0]['data']

      let link_cell = sheet_data[count]['Link']
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

      let tag_str = sheet_data[count]['Tag']
      if (tag_str !== undefined) {
        setTag(tag_str)
      }

      let note_str = sheet_data[count]['Focus']
      if (note_str !== undefined) {
        setNote(note_str)
      }
    }
    
    return;
  }

  const handleNext = () => {
    addCount()
    getLinkData()
  }

  const handleBack = () => {
    desCount()
    getLinkData()
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    
    if(pageNumRegex.test(formCount)) {
      setCount(parseInt(formCount))
      console.log('count after: ' + count)
      getLinkData()
    } else {
      setFormCount(count)
    }
  }

  const NextButton = () => {
    return (
    <div>
      <button type='button' className='next-button btn btn-outline-primary' onClick={() => handleNext()}>
        &raquo;</button>
    </div>
    )
  }

  const BackButton = () => {
    return (
      <button type='button' className='next-button btn btn-outline-secondary' onClick={() => handleBack()}>
        &laquo;</button>
    )
  }

  const Tag = () => {
    return (
      <div>{'#' + tag.toLowerCase()}</div>
    )
  }

  const Note = () => {
    return (
      <div className='note-section'>
        <button className='note-placeholder btn btn-info'>Hint</button>
        <div className='note-block px-2 mx-2'>{note}</div>
      </div>
      
    )
  }

  return (
    <div id='vid-container' className='d-flex flex-column justify-content-center align-items-center'>
      <div id='screen-container' className='d-flex flex-column container w-75 my-auto'>

        <iframe src={getEmbedLink(id, start)} title='YouTube video player' 
        frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' 
        allowfullscreen='true'></iframe>

        <div className='d-flex w-100 justify-content-between align-items-center py-2 px-5'>
          <Tag></Tag>
          <div  className='d-flex justify-content-center align-items-center'>
            <BackButton></BackButton>
            <form onSubmit={(e) => onFormSubmit(e)}>
              <input 
              key='orderForm'
              type='text' 
              id='orderInput'
              className='mx-2 text-center'
              value={formCount}
              onChange={(e) => setFormCount(e.target.value)}
              />
            </form>
            <NextButton></NextButton>
          </div>
          <Note></Note>
        </div>

      </div>
    </div>
  )
}

export default Home