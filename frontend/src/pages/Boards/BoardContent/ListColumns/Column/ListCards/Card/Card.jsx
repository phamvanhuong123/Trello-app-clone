import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Attachment from "@mui/icons-material/Attachment";
import {Card as MuiCard} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Comment from "@mui/icons-material/Comment";
import Group from "@mui/icons-material/Group";
function Card ({cardMediaHide}){
    if (cardMediaHide){
        return <MuiCard
            sx={{
                cursor: "pointer",
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
            }}
            >
            <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
                <Typography>Card 1</Typography>
            </CardContent>
            </MuiCard>
       
    }
    
    return<>
        <MuiCard
            sx={{
                boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
                overflow: "unset",
            }}
            >
            <CardMedia
                sx={{ height: 140 }}
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&"
            />
            <CardContent sx={{ p: 1.5,"&:last-child": { p: 1.5 } }}>
                <Typography component="div">Unt Pham</Typography>
            </CardContent>
            <CardActions sx={{ p: "0 4px 8px 4px" }}>
                <Button startIcon={<Group />} sx={{ fontWeight: "bold" }}>
                20
                </Button>
                <Button startIcon={<Comment />} sx={{ fontWeight: "bold" }}>
                15
                </Button>
                <Button startIcon={<Attachment />} sx={{ fontWeight: "bold" }}>
                10
                </Button>
            </CardActions>
        </MuiCard>
    </>
}
export default Card