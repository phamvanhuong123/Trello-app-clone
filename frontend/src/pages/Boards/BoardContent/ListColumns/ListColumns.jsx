import Box from "@mui/material/Box";

import Column from "./Column/Column";
import Button from "@mui/material/Button";
import { NoteAdd } from "@mui/icons-material";
import {SortableContext ,horizontalListSortingStrategy} from '@dnd-kit/sortable';
function ListColumns({columns}) {

  return (
    //  //item sẽ phải được lưu dưới dạng ["id_1", "id_2", "id_3"] chứ không phải [id:"id_1",id:"id_2",id:"id_3"]
    // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
    <SortableContext items={columns?.map(c => c._id)}  strategy={horizontalListSortingStrategy} >
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
        {columns?.map((column) => <Column key={column?._id} column={column}/>)}
        {/* <Column />
        <Column />
        <Column /> */}
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
    </SortableContext>
  );
}
export default ListColumns;
