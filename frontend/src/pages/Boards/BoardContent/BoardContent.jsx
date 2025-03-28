import Box from "@mui/material/Box";

import ListColumns from "./ListColumns/ListColumns";

function BoardContent() {
  return (
    <>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34497e" : "#1976d2",
          height: (theme) => theme.trello.boarContentHeght,
          width: "100%",
          padding: "10px 0",
        }}
      >
       
          <ListColumns />
        </Box>

    </>
  );
}
export default BoardContent;
