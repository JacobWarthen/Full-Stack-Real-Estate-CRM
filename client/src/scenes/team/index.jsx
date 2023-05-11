import { Box, Typography, useTheme } from "@mui/material";
import {Button, IconButton} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {useState} from 'react'
import Modal from "./Modal"
import './Modal.css'
import { useEffect } from "react";
import ProgressBar from "../../components/ProgressBar"

const Team = ({task, getData}) => {
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);
  const colors = tokens(theme.palette.mode);
  const[tasks, setTasks] = useState(task);
  const [mode, setMode] = useState(null)
  const [data, setData] = useState(null)


  const apiRef = useGridApiRef();

  console.log('task: ', task)

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const newRows = task.map((task) => ({
      id: task.id,
      name: task.title,
      status: task.status,
      priority: task.progress,
      date: task.date,
      user_email: task.user_email
    }));
    setRows(newRows);
  }, [task]);


  
  const deleteItem = async (id) => {
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${id}`, {
        method: 'DELETE'
      })
      console.log('response: ', response)
      if(response.status === 200){
        getData()
      }
    } catch(err){
      console.error(err)
    }
  }

  console.log('rows: ', rows)

  const columns = [
    { field: "id", headerName: "ID", hide: true},
    {field: 'user_email', hide: true},
    {field: 'date', hide: true},
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      renderCell: (params) => (
        <ProgressBar progress={params.value} />
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => setShowModal(true) & setMode('edit') & setData(params.row)}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "3px 20px",
            margin: "0 65px",
          }}
          >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => deleteItem(params.id)}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "3px 20px",
            margin: "0 65px",
          }}
        >
          Delete
          </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="LEADS" subtitle="Manage active leads" />
        <Box display="flex" paddingLeft={"800px"}>
          <Button onClick={() => setShowModal(true) & setMode('create') & setData(null)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add New Lead
            </Button>
          </Box>
        <Box display="flex" alignItems="center">
        {showModal && <Modal mode={mode} task={task} singleTask={data} setShowModal={setShowModal} getData={getData} />}
        </Box>
      </Box>
      <Box
        m="15px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid apiRef={apiRef} checkboxSelection rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;