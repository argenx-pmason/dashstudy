import { useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import {
  Checkbox,
  Box,
  FormControlLabel,
  Grid,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableBody,
} from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

function Donut(props) {
  // Tooltip.positioners.myCustomPositioner = function (elements, eventPosition) {
  //   // A reference to the tooltip model
  //   return {
  //     x: 0,
  //     y: 0,
  //     xAlign: "right",
  //     yAlign: "bottom",
  //   };
  // };
  const { iss, parentInfo } = props,
    chartRef = useRef(),
    // [info, setInfo] = useState(""),
    [title, setTitle] = useState(""),
    [labels, setLabels] = useState([]);

  // status processing
  const status = iss.reduce((acc, s) => {
      acc[s.status] = {
        count: (acc[s.status]?.count || 0) + 1,
        labels: [
          ...(acc[s.status]?.labels || []),
          { title: s.title, status: s.status, type: s.type },
        ],
      };
      return acc;
    }, {}),
    statusKeys = Object.keys(status),
    statusValues = statusKeys.map((k) => status[k].count),
    [showStatus, setShowStatus] = useState(true),
    handleChangeStatus = (event) => {
      setShowStatus(event.target.checked);
    };
  // console.log(status, statusKeys, statusValues);

  // type processing
  const type = iss.reduce((acc, s) => {
      acc[s.type] = {
        count: (acc[s.type]?.count || 0) + 1,
        labels: [
          ...(acc[s.type]?.labels || []),
          { title: s.title, status: s.status, type: s.type },
        ],
      };
      return acc;
    }, {}),
    typeKeys = Object.keys(type),
    typeValues = typeKeys.map((k) => type[k].count),
    [showType, setShowType] = useState(false),
    handleChangeType = (event) => {
      setShowType(event.target.checked);
    };
  // console.log(type, typeKeys, typeValues);

  // status by type processing
  const statusByType = iss.reduce((acc, s) => {
      acc[s.status + " - " + s.type] = {
        count: (acc[s.status + " - " + s.type]?.count || 0) + 1,
        labels: [
          ...(acc[s.status + " - " + s.type]?.labels || []),
          { title: s.title, status: s.status, type: s.type },
        ],
      };
      return acc;
    }, {}),
    statusByTypeKeys = Object.keys(statusByType),
    statusByTypeValues = statusByTypeKeys.map((k) => statusByType[k].count),
    [showStatusByType, setShowStatusByType] = useState(false),
    handleChangeStatusByType = (event) => {
      setShowStatusByType(event.target.checked);
    };
  // console.log(statusByType, statusByTypeKeys, statusByTypeValues);
  // console.log(statusKeys, statusValues);
  // define parameters for doughnut graph
  const data = {
      labels: statusKeys,
      // labels: [],
      datasets: [
        {
          label: "Status",
          data: statusValues,
          backgroundColor: [
            statusKeys.length > 0 && statusKeys[0].includes("Ok")
              ? "rgba(235, 243, 217, 1)"
              : "rgba(0, 0, 255, 0.2)",
            statusKeys.length > 1 && statusKeys[1].includes("Ok")
              ? "rgba(235, 243, 217, 0.5)"
              : "rgba(0, 0, 255, 1)",
            statusKeys.length > 2 && statusKeys[2].includes("Ok")
              ? "rgba(235, 243, 217, 1)"
              : "rgba(0, 0, 255, 0.5)",
            statusKeys.length > 3 && statusKeys[3].includes("Ok")
              ? "rgba(235, 243, 217, 0.5)"
              : "rgba(0, 0, 255, 0.25)",
            statusKeys.length > 4 && statusKeys[4].includes("Ok")
              ? "rgba(235, 243, 217, 1)"
              : "rgba(0, 0, 255, 0.75)",
            statusKeys.length > 5 && statusKeys[5].includes("Ok")
              ? "rgba(235, 243, 217, 0.5)"
              : "rgba(0, 0, 255, 0.2)",
          ],
          borderColor: ["gray", "gray", "gray", "gray", "gray", "gray"],
          borderWidth: 1,
          hidden: !showStatus,
        },
        {
          label: "Output Type",
          data: typeValues,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: ["gray", "gray", "gray", "gray", "gray", "gray"],
          borderWidth: 1,
          hidden: !showType,
        },
        {
          label: "Status by Output Type",
          data: statusByTypeValues,
          backgroundColor: [
            "rgba(116, 0, 184, 0.2)",
            "rgba(105, 48, 195, 0.2)",
            "rgba(94, 96, 206, 0.2)",
            "rgba(83, 144, 217, 0.2)",
            "rgba(78, 168, 222, 0.2)",
            "rgba(72, 191, 227, 0.2)",
            "rgba(86, 207, 225, 0.2)",
            "rgba(100, 223, 223, 0.2)",
            "rgba(114, 239, 221, 0.2)",
            "rgba(128, 255, 219, 0.2)",
          ],
          borderColor: ["gray"],
          borderWidth: 1,
          hidden: !showStatusByType,
        },
      ],
    },
    options = {
      circumference: 180,
      rotation: 270,
      cutout: "50%",
      spacing: 2,
      responsive: true,
      layoutPosition: "bottom",
      // legend: { display: false },
      legend: false,
      title: {
        display: true,
        text: "Status of CRO oversight SharePoint list",
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          // position: "myCustomPositioner",
          callbacks: {
            title: function (arg) {
              const { dataIndex, datasetIndex, formattedValue } = arg[0];
              let title;
              if (datasetIndex === 0) title = statusKeys[dataIndex];
              else if (datasetIndex === 1) title = typeKeys[dataIndex];
              else if (datasetIndex === 2) title = statusByTypeKeys[dataIndex];
              // console.log(datasetIndex, dataIndex, arg);
              setTitle(title);
              return title + " - " + formattedValue;
            },
            label: function (arg) {
              const { dataIndex, datasetIndex } = arg;
              let key, info, labels;
              // console.log(statusKeys, dataIndex, datasetIndex);
              if (datasetIndex === 0) {
                key = statusKeys[dataIndex];
                info = status[key];
                labels = info.labels.filter((r) => r.status === key);
              } else if (datasetIndex === 1) {
                key = typeKeys[dataIndex];
                info = type[key];
                labels = info.labels.filter((r) => r.type === key);
              } else if (datasetIndex === 2) {
                key = statusByTypeKeys[dataIndex];
                info = statusByType[key];
                labels = info.labels.filter(
                  (r) => r.status + " - " + r.type === key
                );
              }
              // console.log(key, info, labels);
              const showThisMany = 10,
                multiline = labels
                  .map((r, i) => {
                    if (i < showThisMany) return r.title;
                    else if (i === showThisMany) {
                      const remaining = labels.length - showThisMany;
                      return remaining + " more items...";
                    } else return null;
                  })
                  .filter((r) => r !== null);
              setLabels(multiline);
              return "";
            },
          },
        },
      },
    };

  // // display debuging info
  // useEffect(() => {
  //   console.log("info=" + info);
  //   console.log(chartRef.current);
  // }, [info]);

  return (
    <>
      <Grid container>
        <Grid item xs={3}>
          <Box sx={{ height: "200px" }}>
            <Doughnut
              options={options}
              data={data}
              ref={chartRef}
              height="200px"
              style={{ height: "200px", width: "400px" }}
              onClick={(e) => {
                const { current } = chartRef,
                  elementAtEvent = getElementAtEvent(current, e),
                  { datasetIndex, index } =
                    elementAtEvent && elementAtEvent.length > 0
                      ? elementAtEvent[0]
                      : { datasetIndex: null, index: null };
                // setInfo("datasetIndex=" + datasetIndex + ", index=" + index);
                let filterValue1,
                  filterField1,
                  filterValue2,
                  filterField2,
                  combinedValue = [];
                if (datasetIndex === 0) {
                  filterField1 = "Status";
                  filterValue1 =
                    statusKeys[index] === "Not checked"
                      ? ""
                      : statusKeys[index];
                } else if (datasetIndex === 1) {
                  filterField1 = "Type_";
                  filterValue1 = typeKeys[index];
                } else if (datasetIndex === 2) {
                  combinedValue = statusByTypeKeys[index].split(" - ");
                  filterField1 = "Status";
                  filterValue1 =
                    combinedValue[0] === "Not checked" ? "" : combinedValue[0];
                  filterField2 = "Type_";
                  filterValue2 = combinedValue[1];
                }
                // console.log(statusByTypeKeys,combinedValue,
                //   filterField1,
                //   filterValue1,
                //   filterField2,
                //   filterValue2
                // );
                if (parentInfo.splistmessage.split("]").length > 1) {
                  if (combinedValue && combinedValue.length > 1) {
                    window.open(
                      parentInfo.splisturl +
                        "?FilterField1=" +
                        filterField1 +
                        "&FilterValue1=" +
                        filterValue1 +
                        "&FilterType1=Choice" +
                        "?FilterField2=" +
                        filterField2 +
                        "&FilterValue2=" +
                        filterValue2 +
                        "&FilterType2=Choice",
                      "_blank"
                    );
                  } else
                    window.open(
                      parentInfo.splisturl +
                        "?FilterField1=" +
                        filterField1 +
                        "&FilterValue1=" +
                        filterValue1 +
                        "&FilterType1=Choice",
                      "_blank"
                    );
                } else alert(parentInfo.splistmessage);
              }}
              // onHover={(e) => {
              //   console.log(e);
              // }}
            />
          </Box>
        </Grid>
        <Grid item xs={9}>
          {title > " " ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="none">
                      <b>{title}</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {labels.map((row, i) => (
                    <TableRow
                      key={"row" + i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        sx={{ fontSize: 9 }}
                      >
                        {row}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showStatus}
                onChange={handleChangeStatus}
                size="small"
              />
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontFamily: "system-ui",
                fontSize: "0.9em",
              },
            }}
            label="Status"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showType}
                onChange={handleChangeType}
                size="small"
              />
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontFamily: "system-ui",
                fontSize: "0.9em",
              },
            }}
            label="Output Type"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showStatusByType}
                onChange={handleChangeStatusByType}
                size="small"
              />
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                fontFamily: "system-ui",
                fontSize: "0.9em",
              },
            }}
            label="Status by Output Type"
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Donut;
