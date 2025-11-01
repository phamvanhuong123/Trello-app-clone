import { Box, Container } from "@mui/material";

import AppBar from "components/AppBar/AppBar";
import BoardBar from "pages/Boards/BoarBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";

// import { mockData } from "apis/mock-data";
import { useEffect } from "react";
import {
  
  updateBoardDetailsAPIs,
  updateColumnDetailsAPIs,
  moveCardDifferentColumnApi,
 
} from "apis/index";

import { cloneDeep } from "lodash";
import { fetchBoardDetailApi, updateCurrentActiveBoard,selectCurrentActiveBoard } from "reduxStore/activeBoard/activeBoardSlice";
import { useDispatch, useSelector } from "react-redux";
import {useParams} from 'react-router-dom'
function Board() {
  const dispatch = useDispatch();

  const board = useSelector(selectCurrentActiveBoard);

  const {boardId} = useParams();
  console.log(boardId)
  useEffect(() => {
    
    // call api
    dispatch(fetchBoardDetailApi(boardId))
  }, [dispatch,boardId]); 

 
 

  // Di chuyển column
  const moveColumns = (dndOrderedColumn) => {
    // Update chuẩn dữ liệu cho state board
    const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;

    // setboard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard))
    // Gọi api update board
    updateBoardDetailsAPIs(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  // Khi di chuyển card trong cùng column
  // CHỉ cần gọi API để cật nhật mảng cardOderIDs trong column chứa nó
  const moveCardSameColumn = (dndOrderedCard, dndOrderedCardIds, columnId) => {
    // Update chuẩn dữ liệu cho state board
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCard;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    // Gọi api Update board
    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPIs(columnId, { cardOrderIds: dndOrderedCardIds });
  };
  // Khi di chuyển card khác column
  // b1 : Cật nhật lại mảng cardOrderIds của column ban đầu đang kéo => xoá card._id trong đó và card
  // b2 : Cật nhật lại mảng cardOrderIds của column đã kéo card tới => thêm card._id vào đúng vị trí và card
  // b3 : Cật nhật lại columnId của card đang kéo
  const moveCardDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumn
  ) => {
    const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;

    // setboard(newBoard);
     dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lí bên backend

    // Xử lí frontend gửi lên card rỗng (Khi kéo column không còn card thì sẽ là PlaceholderCard)
    let prevCardOrderIds = dndOrderedColumn.find(
      (c) => prevColumnId === c._id
    )?.cardOrderIds;
    if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];
    moveCardDifferentColumnApi({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumn.find((c) => nextColumnId === c._id)
        ?.cardOrderIds,
    });
  };

  // Xoá card and hoặc column
 

  console.log(board)
  if (!board) {
    return <Box>Loading....</Box>;
  }

  return (

    <Container disableGutters maxWidth="false" sx={{ height: "100vh" }}>
    

      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        moveCardSameColumn={moveCardSameColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
        
      />
    </Container>
  )
}
export default Board;
