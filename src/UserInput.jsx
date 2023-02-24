import React from "react";
import {
  FormControlLabel,
  FormControl,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { updateJsonFile } from "./utility";

const UserInput = (props) => {
  const { open, setOpen } = props,
    overridePrograms = true; // placeholder - to be removed

  const handleClose = () => {
      setOpen(false);
    },
    handleSave = () => {
      // save choice sthe user made to a corresponding JSON file on server
      console.log("saving");
      // create some JSON that we can specifically tie to this report, perhaps with date/time/directory
      updateJsonFile();
      setOpen(false);
    },
    changeOverridePrograms = () => {};

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"sd"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Manual Checks</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Carry out a manual review entering your decisions.
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <FormLabel id="radio-override">
                Override Programs/Outputs
              </FormLabel>
              <>
                list each program/output here with radio beside it showing
                current state and allowing override
              </>
              <RadioGroup
                aria-labelledby="radio-override"
                name="radio-override-group"
                value={overridePrograms}
                onChange={changeOverridePrograms}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label="Complete"
                />
                <FormControlLabel value="0" control={<Radio />} label="Issue" />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UserInput;
