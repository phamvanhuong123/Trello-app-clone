import { Box, Container } from "@mui/material";

import AppBar from "components/AppBar/AppBar";
import BoardBar from "pages/Boards/BoarBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mapOrder } from "utils/sort";

// import { mockData } from "apis/mock-data";
import { useEffect, useState } from "react";
import {
  fetchBoardDetailsAPIs,
  createNewColumnApi,
  createNewCardApi,
  updateBoardDetailsAPIs,
  updateColumnDetailsAPIs,
} from "apis/index";
import { genratePlaceholderCard } from "utils/formatter";
import { isEmpty } from "lodash";
function Board() {
  const [board, setboard] = useState(null);

  useEffect(() => {
    const boardId = "68a085e73594206b22a61834";
    // call api
    fetchBoardDetailsAPIs(boardId).then((board) => {
      // Xắp xếp thứ tự column ở đây
      board.data.columns = mapOrder(
        board?.data.columns,
        board?.data.columnOrderIds,
        "_id"
      );
      // Xử lí kéo thả vào một column rỗng
      board.data.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [genratePlaceholderCard(column)];
          column.cardOrderIds = [genratePlaceholderCard(column)._id];
        } else {
          // Xắp xếp thứ tự card ở đây
          column.cards = mapOrder(column.cards, column.cardOrderIds, "_id");
        }
      });
      setboard(board.data);
    });
  }, []);

  //Call api create newColumn and restate board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnApi({
      ...newColumnData,
      boardId: board._id,
    });

    // Khi tạo một column mới thì chưa có card, nên cần thêm một Card rỗng
    createdColumn.data.cards = [genratePlaceholderCard(createdColumn.data)];
    createdColumn.data.cardOrderIds = [
      genratePlaceholderCard(createdColumn.data)._id,
    ];

    // Cật nhật lại state Board
    // Phía frontend phải tự state lại bên phía frontend thay gọi lại api fetchBoardDetailsAPIs.
    // Cách này tuỳ thuộc vào từng dự án, có nơi backend sẽ trả về toàn bộ board mới luôn dù đây có là api tạo column hay tạo card đi nữa => trong trường hợp này FE làm nhàn hơn

    const newBoard = { ...board };
    newBoard.columns.push(createdColumn.data);

    newBoard.columnOrderIds.push(createdColumn?.data?._id);
    setboard(newBoard);
  };
  //Call api create newCard and restate board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardApi({
      ...newCardData,
      boardId: board._id,
    });
    console.log("createdCard : ", createdCard);
    // Cật nhật lại state Board

    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard?.data.columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard?.data);
      columnToUpdate.cardOrderIds.push(createdCard?.data?._id);
    }
    setboard(newBoard);
  };

  // Di chuyển column
  const moveColumns = (dndOrderedColumn) => {
    // Update chuẩn dữ liệu cho state board
    const dndOrderedColumnIds = dndOrderedColumn.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumn;
    newBoard.columnOrderIds = dndOrderedColumnIds;

    setboard(newBoard);

    // Gọi api update board
    updateBoardDetailsAPIs(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  // Khi di chuyển card trong cùng column
  // CHỉ cần gọi API để cật nhật mảng cardOderIDs trong column chứa nó
  const moveCardSameColumn = (dndOrderedCard, dndOrderedCardIds, columnId) => {
    // Update chuẩn dữ liệu cho state board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCard;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    // Gọi api Update board
    updateColumnDetailsAPIs(columnId, {cardOrderIds : dndOrderedCardIds})
  };
  if(!board){
    return <Box>Loading....</Box>
  }
  return (
    <Container disableGutters maxWidth="false" sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardSameColumn={moveCardSameColumn}
      />
    </Container>
  );
}
export default Board;
