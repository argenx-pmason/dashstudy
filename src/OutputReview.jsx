import React, { useEffect } from "react";
import {
  // Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // TextField,
} from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";

const UserInput = (props) => {
  const { open, setOpen, userJson,  } = props,
    handleClose = () => {
      setOpen(false);
    },
    colDef = [
      { field: "output", headerName: "Output", width: 120 },
      { field: "col2", headerName: "Message", flex: 1 },
      { field: "comment", headerName: "Comment", flex: 1 },
      { field: "user", headerName: "User Id", width: 90 },
      { field: "ok", headerName: "OK?", width: 40 },
    ];

  // TODO: add filter when we pass output in to only show that output
  console.log(props);

  useEffect(() => {
    if (!userJson) return;
    // const idToUse = userJson.filter((row) => row.id === idClickedOn);
    // if (idToUse && idToUse[0]) {
    //   // console.log(idToUse[0].comment, idToUse[0].user);
    //   setComment(idToUse[0].comment || comment);
    //   setUser(idToUse[0].user || user);
    // }
    // eslint-disable-next-line
  }, [userJson]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"sd"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Reviews of messages</DialogTitle>
        <DialogContent sx={{ height: 250 }}>
          <DataGridPro
            rows={userJson}
            columns={colDef}
            density={"compact"}
            sx={{ fontSize: "0.8em" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default UserInput;
