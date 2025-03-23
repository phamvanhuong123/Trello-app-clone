import { Box } from "@mui/material";

function BoardContent() {
  return (
    <>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34497e" : "#1976d2",
          height: (theme) =>
            `calc(100% - ${theme.trello.boardBarHeight} - ${theme.trello.appBarHeight})`,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        Board Content1
      </Box>
    </>
  );
}
export default BoardContent;
