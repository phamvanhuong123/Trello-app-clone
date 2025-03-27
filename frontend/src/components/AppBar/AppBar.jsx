import { useState } from "react";
import { Box, Button, InputAdornment, SvgIcon, Tooltip, Typography } from "@mui/material";
import ModeSelect from "components/ModeSelect";
import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as trelloLogo } from "assets/trello.svg";
import Workspaces from "./Menus/Workspaces";
import Recent from "./Menus/Recent";
import Started from "./Menus/Starred";
import Template from "./Menus/Templates";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddIcon from "@mui/icons-material/Add";
import Avata from "../Avata";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function AppBar() {
  const [searchValue,setSearchValue] = useState('');
  return (
    <>
      <Box
        sx={{
          height: (theme) => theme.trello.appBarHeight,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          overflowX: "auto",
          px: 2,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#2c3e50" : "#1565c0",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <AppsIcon sx={{ color: "white" }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SvgIcon
              sx={{ color: "white", fontSize: "1.8rem" }}
              component={trelloLogo}
              inheritViewBox
            />
            <Typography
              variant="span"
              sx={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              Trello
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Workspaces />
            <Recent />
            <Started />
            <Template />
            <Button
              startIcon={<AddIcon />}
              sx={{ color: "white" }}
              variant="outlined"
            >
              Create
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
          <TextField
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{color : 'white'}} />
                  </InputAdornment>
                ),
                endAdornment :(
                  <InputAdornment onClick={()=>{setSearchValue('')}} position="end">
                    <CloseIcon  sx={{color : searchValue ?'white' : 'transparent',fontSize : "16px",cursor : 'pointer'}}  />
                  </InputAdornment>
                )
              },
            }}
            id="outlined-search"
            label="Search...."
            variant="outlined"
            type="text"
            size="small"
            value={searchValue}
            onChange={e =>{setSearchValue(e.target.value)}}
            sx={{
              minWidth: 100,
              maxWidth : 170,
              '& label' : {color : 'white'},
              '& input' : {color : 'white'},
              '& label.Mui-focused' : {color : 'white'},
              '& .MuiOutlinedInput-root' : {
                px : 1,
                '& fieldset' : {borderColor : 'white'},
                '&:hover fieldset' : {borderColor : 'white'},
                '&.Mui-focused fieldset' : {borderColor : 'white'},
              
              }
            }}
          />
          <ModeSelect />
          <Tooltip sx={{ color: "action.active" }}>
            <Badge color="error" variant="dot">
              <NotificationsNoneIcon
                sx={{ cursor: "pointer", color: "white" }}
              />
            </Badge>
          </Tooltip>
          <Tooltip sx={{ color: "action.active" }}>
            <HelpOutlineIcon
              sx={{ cursor: "pointer", color: "white" }}
            />
          </Tooltip>
          <Avata />
        </Box>
      </Box>
    </>
  );
}
export default AppBar;
