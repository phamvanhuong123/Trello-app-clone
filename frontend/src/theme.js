// import { cyan, deepOrange, orange, teal } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  trello: {
    appBarHeight: "60px",
    boardBarHeight: "58px",
  },
  colorSchemes: {
    dark: {
      // palette: {
      //   primary: cyan,
      //   secondary: deepOrange,
      // },
    },
    light: {
      // palette: {
      //   primary: teal,
      //   secondary: orange,
      // },
    },
  },
  components: {
    MuiCssBaseline : {
      styleOverrides : {
        body : {
          '*::-webkit-scrollbar' : {
            width : '6px',
            height : '6px'
          },
          '*::-webkit-scrollbar-thumb' : {
            backgroundColor : '#bdc3c7',
            borderRadius : '10px'
          },
          '*::-webkit-scrollbar-thumb:hover' :{
            backgroundColor : '#00b894',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({theme})=>({
          // color: theme.palette.primary.main
        }),
      },
    }
    ,
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color: theme.palette.primary.main,

          fontSize: "0.875rem",
          // "& .MuiOutlinedInput-notchedOutline": {
          //   borderColor: theme.palette.primary.light,
          // },
          // ":hover": {
          //   "& .MuiOutlinedInput-notchedOutline": {
          //     borderColor: theme.palette.primary.main,
          //   },
          // },
          '& fieldset' : {borderWidth : '1px !important'},
          '&:hover fieldset' : {borderWidth : '2px !important'},
          '&.Mui-focused fieldset' : {borderWidth : '2px !important'}
        }),
      },
    },
  },
});
export default theme;
