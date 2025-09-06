import Box from "@mui/material/Box";

import Column from "./Column/Column";
import Button from "@mui/material/Button";
import { NoteAdd } from "@mui/icons-material";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ListColumns({ columns, createNewColumn, createNewCard }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitile, setNewColumnTitle] = useState("");
  const toggleOpenNewColumn = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };
  const addNewColumn = async () => {
    if (!newColumnTitile) {
      // console.error("Khong co gia tri")
      return;
    }
    // Tạo dữ liệu để gọi api
    const newColumnData = {
      title: newColumnTitile,
    };
    // Goi api o day
    await createNewColumn(newColumnData);
    toggleOpenNewColumn();
    setNewColumnTitle("");
  };
  return (
    //  //item sẽ phải được lưu dưới dạng ["id_1", "id_2", "id_3"] chứ không phải [id:"id_1",id:"id_2",id:"id_3"]
    // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": {
            m: 2,
          },
        }}
      >
        {columns?.map((column) => (
          <Column
            key={column?._id}
            column={column}
            createNewCard={createNewCard}
          />
        ))}
        {/* <Column />
        <Column />
        <Column /> */}
        {/* Box add new column */}
        {!openNewColumnForm ? (
          <Box
            sx={{
              maxWidth: "250px",
              minWidth: "250px",
              ml: 2,
              borderRadius: "7px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
          >
            <Button
              startIcon={<NoteAdd />}
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1,
              }}
              onClick={toggleOpenNewColumn}
            >
              Add new Column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: 250,
              maxWidth: 250,
              mx: 2,
              p: 1,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <TextField
              id="outlined-enter"
              label="Enter column title....."
              variant="outlined"
              autoFocus
              type="text"
              size="small"
              sx={{
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
              value={newColumnTitile}
              onChange={(e) => {
                setNewColumnTitle(e.target.value);
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={addNewColumn}
                disabled={newColumnTitile ? false : true}
              >
                Add column
              </Button>
              <CloseIcon
                onClick={() => {
                  toggleOpenNewColumn();
                  setNewColumnTitle("");
                }}
                sx={{
                  color: "white",
                  cursor: "pointer",
                  "&:hover": { color: (theme) => theme.palette.warning.light },
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
}
export default ListColumns;
