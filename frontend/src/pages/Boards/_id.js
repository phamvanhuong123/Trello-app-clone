import {
  Container
} from "@mui/material";

import AppBar from "components/AppBar";
import BoardBar from 'pages/Boards/BoarBar/index'
import BoardContent from "./BoardContent/index";
function Board(){
    return(
        <Container
      disableGutters
      maxWidth="false"
      sx={{ height: "100vh" }}
    >
      <AppBar/>
      <BoardBar/>
      <BoardContent/>
    </Container>
    )
}
export default Board