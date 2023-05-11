import { useState } from 'react'
import {useCookies} from 'react-cookie'
import './Modal.css'

const Modal = ({mode, setShowModal, getData, task, singleTask}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const editMode = mode === 'edit' ? true : false
  const [data, setData] = useState({
    user_email: editMode ? singleTask.user_email : cookies.Email,
    title: editMode ? singleTask.name : null,
    progress: editMode ? singleTask.priority : 50,
    date: editMode ? singleTask.date : new Date(), 
    status: editMode ? singleTask.status : 'New'
  })

  console.log('data: ', singleTask)


  const postData = async (e) => {
    e.preventDefault()
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos`, {
        method: "POST", 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      })
      if(response.status === 200){
        console.log('Worked')
        setShowModal(false)
        getData()
      }
    } catch(err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    console.log('changing!', e)
    const {name, value} = e.target
    setData(data => ({
      ...data, 
      [name] : value
    }))
  }


  const editData = async(e) => {
    e.preventDefault()
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${singleTask.id}`, {
        method: 'PUT', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      if(response.status === 200){
        setShowModal(false)
        getData()
      }
    } catch(err) {
      console.error(err)
    }
  }


    return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            {/* <h3>Let's {mode} your task</h3> */}
            <h3>Add a new lead</h3>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
          <label>Name</label>
          <form>
            <input 
              required 
              maxLength={30}
              placeholder="Name"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
            <br/>
            <label>Status</label>
            <select
              required
              name="status"
              className="select"
              value={data.status}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
            <br/>
            <label>Drag to select priority</label>
            <input 
              required
              type="range"
              id="range"
              min="0"
              max="100"
              name="progress"
              value={data.progress}
              onChange={handleChange}
            />
            <br/>
            <input className={mode} type="submit" onClick={editMode ? editData: postData}/>
          </form>

        </div>
        
      </div>
    )
  }
  
  export default Modal