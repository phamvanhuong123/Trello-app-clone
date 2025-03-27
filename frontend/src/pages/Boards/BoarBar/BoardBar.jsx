import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

function BoardBar() {
  const menus = {
    color: "white",
    bgcolor: "transparent",
    paddingX: "5px",
    borderRadius: "4px",
    ".MuiSvgIcon-root": {
      color: "white",
    },
    "&:hover": {
      bgcolor: "transparent",
    },
  };
  return (
    <>
      <Box
        sx={{
          height: (theme) => theme.trello.boardBarHeight,
          width: "100%",
          border: "1px solid #fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
         
          overflowX: "auto",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34497e" : "#1976d2"
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Chip
            icon={<SpaceDashboardIcon />}
            label="Clone Trello app"
            clickable
            sx={menus}
          />
          <Chip
            icon={<VpnLockIcon />}
            label="Public/Private Workspace"
            clickable
            sx={menus}
          />
          <Chip
            icon={<AddToDriveIcon />}
            label="Add to Google drive"
            clickable
            sx={menus}
          />
          <Chip icon={<BoltIcon />} sx={menus} label="Automation" clickable />
          <Chip icon={<FilterListIcon />} sx={menus} label="Filter" clickable />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<GroupAddIcon />}
            sx={{
              fontWeight: 600,
              color : 'white',
              borderColor : 'white'
            }}
            variant="outlined"
          >
            Invite
          </Button>
          <AvatarGroup
            max={5}
            total={10}
            sx={{
              gap : '10px',
              ".MuiAvatar-root": {
                width : 34,
                height : 34,
                border : "none"
                
              },
            }}
          >
            <Tooltip title="Remy Sharp">
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar
                alt="Trevor Henderson"
                src="/static/images/avatar/5.jpg"
              />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  );
}
export default BoardBar;
