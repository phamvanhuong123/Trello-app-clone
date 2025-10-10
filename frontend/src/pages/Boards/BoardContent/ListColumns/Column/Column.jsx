import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Cloud from "@mui/icons-material/Cloud";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import AddCard from "@mui/icons-material/AddCard";

import Button from "@mui/material/Button";
import Attachment from "@mui/icons-material/Attachment";
import ListCards from "./ListCards/ListCards";
import CloseIcon from "@mui/icons-material/Close";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextField } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import { createNewCardApi, deleteColumnDetailAPIs } from "apis";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from "reduxStore/activeBoard/activeBoardSlice";
function Column({ column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dispatch = useDispatch();

  const board = useSelector(selectCurrentActiveBoard);
  const dndKitColumnStyle = {
    // Nếu sử dụng Transform như doc thì sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    // touchAction : "none", // Dành cho senser default dạng pointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao phải là 100% vì nếu không sẽ bị lỗi lúc kéo column ngắn qua một column dài rất khó chịu và {...listener} phải BOX
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const orderCard = column.cards;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitile, setNewCardTitle] = useState("");

  const toggleOpenNewCard = () => {
    setOpenNewCardForm(!openNewCardForm);
  };
  const addNewCard = async () => {
    if (!openNewCardForm) return;

    const newCardData = {
      title: newCardTitile,
      columnId: column._id,
    };
    //Call api create newCard and restate board

    const createdCard = await createNewCardApi({
      ...newCardData,
      boardId: board._id,
    })
      .then()
      .catch(() => {
        toast.error("THêm thất bại");
      });
    console.log("createdCard : ", createdCard);

    // Cật nhật lại state Board

    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard?.data.columnId
    );
    if (columnToUpdate) {
      // Nếu card là rỗng thì column mặc định sẽ có một card-placeorder
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard?.data];
        columnToUpdate.cardOrderIds = [createdCard?.data?._id];
      } else {
        columnToUpdate.cards.push(createdCard?.data);
        columnToUpdate.cardOrderIds.push(createdCard?.data?._id);
      }
    }
    // setboard(newBoard);
    dispatch(updateCurrentActiveBoard(newBoard));
    setNewCardTitle("");
    toggleOpenNewCard();
  };

  // Xoá một column
  const confirm = useConfirm();
  const handleDeleteColumn = async () => {
    confirm({
      title: "Delete Column",
      description:
        "This action will delete your column and card. Are you sure?",

      allowClose: false,
      dialogProps: { maxWidth: "xs" },
      cancellationButtonProps: { color: "inherit" },
      confirmationButtonProps: { color: "secondary", variant: "outlined" },
    })
      .then(() => {
        // Xoá column trên UI
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);
        newBoard.columnOrderIds = newBoard.columnOrderIds.map(
          (c) => c !== column._id
        );
        //  setboard(newBoard)
        dispatch(updateCurrentActiveBoard(newBoard));

        deleteColumnDetailAPIs(column._id).then((res) => {
          toast.success(res?.message);
        });
      })
      .catch();
    //=> "confirm" | "cancel" | "natural" | "unmount"
  };
  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          maxWidth: "300px",
          minWidth: "300px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          // height : (theme) => theme.trello.boarContentHeght,
          ml: 2,
          borderRadius: "7px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trello.boarContentHeght} - ${theme.spacing(4)})`,
        }}
      >
        {/* Box column Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            {column.title}
          </Typography>
          <Box>
            <Tooltip title="More">
              <KeyboardArrowDownIcon
                sx={{ color: "primary.main", cursor: "pointer" }}
                id="basic-button-workspaces"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>

            <Menu
              id="basic-menu-workspaces"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
            >
              <MenuItem
                onClick={toggleOpenNewCard}
                sx={{
                  "&:hover": {
                    color: "success.light",
                    "& .add-icon": { color: "success.light" },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCard className="add-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Coppy</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  "&:hover": {
                    color: "warning.dark",
                    "& .delete-icon": { color: "warning.dark" },
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteIcon className="delete-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this coloumn</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/*column ListCard */}
        <ListCards cards={orderCard} />

        {/* Box column Footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 1,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={toggleOpenNewCard} startIcon={<AddCard />}>
                Add new Card
              </Button>
              <Tooltip title="sss">
                <Attachment />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                borderRadius: "6px",
                height: "fit-content",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "#333643" : "#EBECF0",
                display: "flex",

                gap: 1,
              }}
            >
              <TextField
                id="outlined-enter"
                label="Card title..."
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                type="text"
                size="small"
                sx={{
                  "& label": { color: "text.primary" },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                  "& .MuiOutlinedInput-input": { borderRadius: 1 },
                }}
                value={newCardTitile}
                onChange={(e) => {
                  setNewCardTitle(e.target.value);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  data-no-dnd="true"
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: "none",
                    border: "0.5px solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                  onClick={addNewCard}
                  disabled={newCardTitile ? false : true}
                >
                  Add
                </Button>
                <CloseIcon
                  data-no-dnd
                  onClick={() => {
                    toggleOpenNewCard();
                    setNewCardTitle("");
                  }}
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}
export default Column;
