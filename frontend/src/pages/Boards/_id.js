import {
  Container
} from "@mui/material";

import AppBar from "components/AppBar/AppBar";
import BoardBar from 'pages/Boards/BoarBar/BoardBar'
import BoardContent from "./BoardContent/BoardContent";
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