import {
  Container
} from "@mui/material";

import AppBar from "components/AppBar/AppBar";
import BoardBar from 'pages/Boards/BoarBar/BoardBar'
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "apis/mock-data";
function Board(){

    return(
        <Container
      disableGutters
      maxWidth="false"
      sx={{ height: "100vh" }}
    >
      <AppBar />
      <BoardBar board={mockData?.board}/>
      <BoardContent board={mockData?.board}/>
    </Container>
    )
}
export default Board