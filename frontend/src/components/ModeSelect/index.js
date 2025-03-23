import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useColorScheme,
} from "@mui/material";

function ModeSelect() {
  const { mode, setMode } = useColorScheme();
  const modeSelect = localStorage.getItem("mui-mode");
  const handleChange = (event) => {
    setMode(event.target.value);
    console.log(event.target.value);
  };
  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-select-dark-light-mode" sx={{'&.MuiFormLabel-root' : {color : 'white'}}} >Mode</InputLabel>
        <Select
          defaultValue={modeSelect}
          labelId="demo-select-dark-light-mode"
          id="select-dark-light-mode"
          value={mode}
          label="Mode"
          onChange={handleChange}
          sx={{
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {borderColor: "white"},
            "&:hover .MuiOutlinedInput-notchedOutline": {borderColor: "white",},
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: "white",},
            ".MuiSvgIcon-root" : {color : 'white'}
          }}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
export default ModeSelect;
