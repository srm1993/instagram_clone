import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Register from "./Component/Register";
import Login from "./Component/Login";
import AddProfile from "./Component/AddProfile";
import DashBoard from "./Component/DashBoard";
import UploadPost from "./Component/UploadPost";
import UploadReel from "./Component/UploadReel";
import ViewReels from "./Component/ViewReels";
import Chat from "./Component/Chat";
function App(){
  let isLoggedIn=localStorage.getItem("user")?true:false;
  return(
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addProfile" element={<AddProfile />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/uploadPost" element={<UploadPost />} />
        <Route path="/uploadReel" element={<UploadReel />} />
        <Route path="/viewReels" element={<ViewReels />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;