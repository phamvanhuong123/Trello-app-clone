import Box from "@mui/material/Box";

import Column from "./Column/Column";
import Button from "@mui/material/Button";
import { NoteAdd } from "@mui/icons-material";

function ListColumns() {
  return (
    <>
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
        <Column />
        <Column />
        <Column />
        {/* Box add new column */}
        <Box
          sx={{
            maxWidth: "200px",
            minWidth: "200px",
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
              pl : 2.5,
              py : 1
            }}
          >
            Add new Column
          </Button>
        </Box>
      </Box>
    </>
  );
}
export default ListColumns;
