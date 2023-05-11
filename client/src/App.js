import { useState, useCallback, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import {useCookies} from 'react-cookie'
import Auth from "./components/Auth";
import "./components/Auth.css";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const [cookies, setCookies, removeCookie] = useCookies({})
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const[tasks, setTasks] = useState([])

  const getData = useCallback(async () => {
    try{
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`)
      const json = await response.json()
      setTasks(json)
    } catch (err) {
      console.error(err)
    }
  }, [userEmail])

  useEffect(() => {
    if(authToken){
      getData()
    }}
    , [authToken, getData])


  return (
    <div className="app">
        {!authToken && 
        <>
        <div className="testingAuth">
          <Auth/>
        </div>
        </>
        }
        {authToken && 
            <>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                  <Sidebar isSidebar={isSidebar} />
                  <main className="content">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/team" element={<Team task={tasks} getData={getData} />} />
                      <Route path="/contacts" element={<Contacts />} />
                      <Route path="/calendar" element={<Calendar />} />
                    </Routes>
                  </main>
                </div>
              </ThemeProvider>
            </ColorModeContext.Provider>
            </>
          }
      </div>
  );
}

export default App;
