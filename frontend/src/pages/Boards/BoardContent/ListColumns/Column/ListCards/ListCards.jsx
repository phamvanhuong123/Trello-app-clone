
import Box from "@mui/material/Box";
import Card from "./Card/Card";



function ListCards({cards}){
    return <>
    <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: "0 5px",
          m: "0 5px",
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: (theme) =>
            `calc(${theme.trello.boarContentHeght}
                        - ${theme.spacing(4)}
                        - ${theme.trello.columnHeaderHeight}
                        - ${theme.trello.columnFooterHeight})`,
        }}
      >
        {cards.map(card => <Card key={card._id} card={card}/> ) }
        
        {/* <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/>
        <Card cardMediaHide/> */}
        
     
        
        
      </Box>
    </>
}
export default ListCards;