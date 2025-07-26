import logo from './logo.svg';
import './App.css';
import { use, useState,useEffect } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';



function App() {
  const [allTask,setAllTask]=useState([])
  const [task,setTask]=useState("")
  const [heading,setHeading]=useState("")
  const [editId,setEditId]=useState(null)
  const [editMode,setEditMode]=useState(false)
  const addTask=(event)=>{
    event.preventDefault();
    const newTask={"heading":heading,"task":task}
    if(editMode){
      axios.put(`http://localhost:5000/${editId}` , newTask).
      then((res)=>{
        setEditMode(false);
        setEditId(null);
        setHeading("");
        setTask("");
        axios.get("http://localhost:5000").then(res=>{
          setAllTask(res.data);
        }).catch(error=>{
        console.log(error);
      })

      })
    }else{
    console.log(newTask)
    axios.post("http://localhost:5000",newTask).then((res)=>{
        console.log(res)
        axios.get("http://localhost:5000").then(res=>{
        setAllTask(res.data)
        setTask("")  
        setHeading("")
      })
    })
    .catch(error=>{
      console.log(error)
    })}
  }
  useEffect(()=>{
    axios.get("http://localhost:5000").then(res=>{
      setAllTask(res.data)
      console.log(res)
    }).catch(error=>{
      console.log(error)
    })
  },[])

  const deleteTask=(id)=>{
    axios.delete(`http://localhost:5000/${id}`).then(()=>{
      axios.get("http://localhost:5000").then(res=>{
        setAllTask(res.data)
      })
    })
  }
  const editTask = (item) => {
  setHeading(item.heading);
  setTask(item.task);
  setEditId(item._id);
  setEditMode(true);
 };

  return (
    <div className="App">
      <h1>Google Keep</h1>
      <form onSubmit={addTask}>
         <TextField id="outlined-basic" label="Enter your heading here" variant="outlined" onChange={(event)=>setHeading(event.target.value)} value={heading} />
          <TextField id="filled-basic" label="Enter your Task here" variant="filled" onChange={(event)=>setTask(event.target.value)} value={task} />
          <Button variant="contained" type="submit">
            {editMode ? "Update" : "Submit"}
          </Button>
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
    {allTask.map((item) => (
      <Card key={item._id} sx={{ width: 300 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            {item.heading}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.task}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="outlined" onClick={() => deleteTask(item._id)}>
            Delete
          </Button>
          <Button size="small" variant="outlined" onClick={() => editTask(item)}>
            Edit
          </Button>
        </CardActions>
      </Card>
    ))}
  </div>
      
    </div>
  );
}

export default App;
