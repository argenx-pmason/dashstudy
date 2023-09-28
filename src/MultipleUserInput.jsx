import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { updateJsonFile } from "./utility";
import { DataGridPro } from "@mui/x-data-grid-pro";

const MultipleUserInput = (props) => {
  const {
      open,
      setOpen,
      userJson,
      userJsonFile,
      rowToCheck,
      setUserJson,
      // idClickedOn,
      access,
      mode,
      user,
      reviewSection,
      colsReviewSection,
    } = props,
    { output } = rowToCheck,
    [comment, setComment] = useState(""),
    // handleChange = (e, key, field, id) => {
    //   // eslint-disable-next-line
    //   const obj = eval(key);
    //   console.log(e, key, obj, id);
    //   obj[id][field] = e.target.value;
    //   obj[id].ok = e.target.value ? true : false;
    // },
    handleClose = () => {
      setOpen(false);
    },
    save = (ok) => {
      // save choice the user made to a corresponding JSON file on server
      console.log("save> userJsonFile", userJsonFile);
      console.log("save> userJson", userJson);
      console.log("save> user", user);
      console.log("save> comment", comment);
      const newContentToSave = reviewSection.map((r) => {
        return {
          output: output,
          issuenr: r.issuenr,
          col2: r.col2,
          id: r.id,
          ok: r.ok === "1" ? true : r.ok === "0" ? false : null,
          line: r.line,
          user: user,
          comment: comment,
          datetime: new Date().toUTCString(),
        };
      });
      console.log("save> newContentToSave", newContentToSave);
      console.log("save> reviewSection", reviewSection);
      console.log("save> mode", mode);

      const idsForNew = newContentToSave.map((r) => r.id),
        allButNew = userJson
          ? userJson.filter((row) => !idsForNew.includes(row.id))
          : [],
        newJsonContent = [...allButNew, ...newContentToSave];
      console.log("allButNew", allButNew, "newJsonContent", newJsonContent);
      setUserJson(newJsonContent);
      updateJsonFile(userJsonFile, newJsonContent);
      setOpen(false);
    };

  useEffect(() => {
    if (!userJson) return;
    userJson.forEach((row) => {
      // console.log("1) userJson> props", props);
      // console.log("2) userJson> row", row);
      // console.log("3) userJson> reviewSection", reviewSection);
      // apply the things marked in userJson to the reviewSection
      if (userJson !== null && userJson.length > 0) {
        reviewSection.forEach((r) => {
          const uj = userJson.filter(
            (uj) => uj.output === output && uj.issuenr === r.issuenr
          );
          if (uj.length > 0) {
            r.ok = uj[0].ok === "-1" ? "-1" : uj[0].ok ? "1" : "0";
          }
        });
      }
    });
    // eslint-disable-next-line
  }, [userJson, reviewSection, output]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"sd"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Approve messages (if OK)</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Enter a comment to apply to all the selected rows for <b>{user}</b>.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Enter an explanation."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} sx={{ height: 500 }}>
              <DataGridPro
                rows={reviewSection}
                columns={colsReviewSection}
                density="compact"
                editMode="row"
                autoHeight={true}
                rowHeight={30}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={save}
            variant={"contained"}
            disabled={access !== null && access.length > 0 && !Boolean(user)}
            color={"success"}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default MultipleUserInput;
