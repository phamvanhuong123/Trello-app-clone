// import logo from './logo.svg';
import { Routes, Route, Navigate } from "react-router-dom";
import Board from "pages/Boards/_id";
import Page404 from "./pages/404/Page404";
import Auth from "./pages/Auth/Auth";
function App() {
  return (
    <Routes>
    {/* Redirect route */}
      <Route path="/" element={
        // Dùng replace giá trị true để nó thay thế route / , có thể hiểu là route / không còn nằm trong history của Browser 
        <Navigate to={'/boards/68a085e73594206b22a61834'} replace={true}/>}/>
      <Route path="/boards/:boardId" element={<Board />} />
      <Route path="/login" element={<Auth/>}/>
      <Route path="/register" element={<Auth/>}/>
      {/* Route 404 */}
      <Route path="*" element={<Page404/>}/> 
    </Routes>
  );
}

export default App;
