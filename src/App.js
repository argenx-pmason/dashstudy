import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Tooltip,
  Typography,
  Chip,
  Link,
  Avatar,
  Button,
  Popover,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
// import Button from "@mui/material-next/Button";
import Select from "react-select";
import Highcharts from "highcharts";
// import Sunburst from "highcharts/modules/sunburst";
import Treemap from "highcharts/modules/treemap";
import HighchartsReact from "highcharts-react-official";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { LicenseInfo } from "@mui/x-data-grid-pro";
import all from "./test/all.json"; // /argx-113/cidp/argx-113-1802/testrun1/qc_adam
// import all from "./test/all2.json"; // /argx-117/hv/argx-117-1901/mad5_tables
// import all from "./test/all3.json"; // /argx-113/x-ind/argx-113-0000/generic_adam
// import all from "./test/all4.json"; // /argx-113/mg/argx-113-9031/ma2022
// import all from "./test/all5.json"; // /argx-113/sjogren/argx-113-0000/generic_adam
// import all from "./test/all6.json"; // /argx-113/mg/argx-113-9031/iss_20220131/qc_tlf
import localiss from "./test/iss.json";
import localstudies from "./test/dash-study-files.json";

const App = () => {
  LicenseInfo.setLicenseKey(
    "5b931c69b031b808de26d5902e04c36fTz00Njk0NyxFPTE2ODg4MDI3MDM3MjAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
  );
  // Sunburst(Highcharts);
  Treemap(Highcharts);
  const { href, protocol, host } = window.location,
    mode = href.startsWith("http://localhost") ? "local" : "remote",
    urlPrefix = protocol + "//" + host,
    [windowDimension, detectHW] = useState({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    }),
    detectSize = () => {
      calcSectionSizes();
      detectHW({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      });
    },
    topSpace = 350,
    [sectionSizes, setSectionSizes] = useState([topSpace, 200, 200]),
    calcSectionSizes = () => {
      const section2 = Math.floor((windowDimension.winHeight - topSpace) / 2),
        section3 = Math.floor((windowDimension.winHeight - topSpace) / 2);
      setSectionSizes([topSpace, section2, section3]);
    },
    logViewerPrefix =
      "https://xarprod.ondemand.sas.com/lsaf/filedownload/sdd:/general/biostat/tools/logviewer/index.html?log=",
    fileViewerPrefix =
      "https://xarprod.ondemand.sas.com/lsaf/filedownload/sdd:/general/biostat/tools/fileviewer/index.html?file=",
    webDavPrefix =
      "https://xarprod.ondemand.sas.com/lsaf/filedownload/sdd%3A//",
    [report1a, setReport1a] = useState(null),
    [colsReport1a, setColsReport1a] = useState(null),
    [report2, setReport2] = useState(null),
    [colsReport2, setColsReport2] = useState(null),
    [outputLogReport, setOutputLogReport] = useState(null),
    [colsOutputLogReport, setColsOutputLogReport] = useState(null),
    [info, setInfo] = useState(null),
    [cro, setCro] = useState(null),
    [graph1, setGraph1] = useState(null),
    [graph2, setGraph2] = useState(null),
    loadFiles = (url) => {
      fetch(url).then(function (response) {
        response.text().then(function (text) {
          const json = JSON.parse(text);
          setSourceData(json);
        });
      });
    },
    [sourceData, setSourceData] = useState(null),
    // popover support
    [popAnchorEl, setPopAnchorEl] = useState(null),
    handlePopClick = (event) => {
      setPopAnchorEl(event.currentTarget);
    },
    handlePopClose = () => {
      setPopAnchorEl(null);
    },
    popOpen = Boolean(popAnchorEl),
    popId = popOpen ? "simple-popover" : undefined,
    [studyList, setStudyList] = useState(null),
    [selectedStudy, setSelectedStudy] = useState(null),
    selectStudy = (e) => {
      console.log(e);
      setSelectedStudy(e.value);
      handlePopClose();
    },
    studyListFile =
      "/general/biostat/jobs/dashboard/dev/metadata/dash-study-files.json",
    [iss, setIss] = useState(null);

  // load a study if we are in remote mode and have selected a study
  useEffect(() => {
    if (!selectedStudy || mode !== "remote") return;
    loadFiles(webDavPrefix + selectedStudy);
    // eslint-disable-next-line
  }, [selectedStudy]);

  // get list of all studies we have JSON built for
  useEffect(() => {
    if (mode === "local") {
      const lsafsearch = localstudies["SASTableData+LSAFSEARCH"],
        tempStudyList = lsafsearch.map((r) => {
          const shorter = r.path
            .replace("/clinical/", "")
            .replace("/biostat/staging", "")
            .replace("/documents/meta/dashstudy.json", "");
          return {
            value: r.path,
            label:
              shorter +
              " ... [" +
              r.dateLastModified +
              "] ... (" +
              r.lastModifiedBy +
              ")",
          };
        });
      setStudyList(tempStudyList);
      return;
    }
    fetch(webDavPrefix + studyListFile).then(function (response) {
      response.text().then(function (text) {
        const json = JSON.parse(text);
        const lsafsearch = json["SASTableData+LSAFSEARCH"],
          tempStudyList = lsafsearch.map((r) => {
            const shorter = r.path
              .replace("/clinical/", "")
              .replace("/biostat/staging", "")
              .replace("/documents/meta/dashstudy.json", "");
            return {
              value: r.path,
              label:
                shorter +
                " ... [" +
                r.dateLastModified +
                "] ... (" +
                r.lastModifiedBy +
                ")",
            };
          });
        setStudyList(tempStudyList);
        // if a study wasnt passed in on the URL, then just pick the first available study to show
        if (href.split("?").length === 1)
          loadFiles(webDavPrefix + tempStudyList[0].value);
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    calcSectionSizes();
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
    // eslint-disable-next-line
  }, [windowDimension]);

  // do this when we get new data provided on URL
  useEffect(() => {
    console.log(`Running in ${mode} mode from ${urlPrefix}`);
    // read in data to use, if remote
    if (mode === "remote") {
      // console.log("webDavPrefix", webDavPrefix, "href", href, "mode", mode);
      if (href.split("?").length > 1) {
        const file1 = href.split("?")[1].split("=")[1];
        loadFiles(webDavPrefix + file1);
      }
    } else setSourceData(all);
    // eslint-disable-next-line
  }, [href]);

  useEffect(() => {
    console.log("sourceData", sourceData);
    if (!sourceData) return;
    const tempReport1a = sourceData.report1.map((r, id) => {
        const headerFails = r.headercheck ? r.headercheck.split(" ")[0] : null,
          headerPasses = r.headercheck ? r.headercheck.split(" ")[2] : null;
        return {
          id: id,
          headerFails: headerFails,
          headerPasses: headerPasses,
          ...r,
        };
      }),
      tempReport2 = sourceData.report2.map((r, id) => {
        return { id: id, ...r };
      }),
      tempOutputLogReport = sourceData.outputlogreport.map((r, id) => {
        return { id: id, ...r };
      });
    setReport1a(tempReport1a);
    setColsReport1a([
      { field: "sas_program", headerName: "SAS program", width: 125 },
      {
        field: "sasprog_exist",
        headerName: "Program file exists",
        width: 90,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { path } = row;
          // console.log(value, row, cellValues);
          if (value === "Yes") {
            return (
              <Chip
                size="small"
                variant="outlined"
                color="info"
                onClick={() => {
                  window.open(fileViewerPrefix + path, "_blank");
                }}
                label={"View"}
              />
            );
          } else
            return (
              <Chip
                variant="outlined"
                size="small"
                color="error"
                label={"Missing"}
              />
            );
        },
      },
      { field: "jobname", headerName: "Job file", width: 125 },
      {
        field: "manifestname",
        headerName: "Manifest",
        width: 125,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value) {
            return (
              <Chip
                size="small"
                variant="outlined"
                color="info"
                onClick={() => {
                  window.open(fileViewerPrefix + value, "_blank");
                }}
                label={"View"}
              />
            );
          } else
            return (
              <Chip
                variant="outlined"
                size="small"
                color="error"
                label={"Missing"}
              />
            );
        },
      },
      { field: "err", headerName: "Errors", width: 30 },
      { field: "war", headerName: "Warnings", width: 30 },
      { field: "un", headerName: "Uninitialized", width: 30 },
      { field: "note", headerName: "Notes", width: 30 },
      { field: "headerFails", headerName: "Header Fail", width: 30 },
      { field: "headerPasses", headerName: "Header Pass", width: 30 },
    ]);

    setReport2(tempReport2);
    setColsReport2([
      { field: "section", headerName: "SAP section" },
      {
        field: "type",
        headerName: "Type",
        width: 30,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value) {
            let icon = "";
            if (value === "Table") icon = "📄";
            else if (value === "Listing") icon = "📜";
            else if (value === "Figure") icon = "📊";
            else if (value === "Dataset") icon = "💿";
            else icon = "❔";
            return (
              <Tooltip title={value}>
                <Avatar
                  variant="square"
                  sx={{ bgcolor: "white", width: 16, height: 16 }}
                >
                  {icon}
                </Avatar>
              </Tooltip>
            );
          }
        },
      },
      {
        field: "output",
        headerName: "Output",
        width: 300,
        renderCell: (cellValues) => {
          const { value, row } = cellValues;
          if (value) {
            return (
              <Tooltip title={row.Title}>
                <Typography sx={{ fontSize: 12 }}>{value}</Typography>
              </Tooltip>
            );
          }
        },
      },
      // { field: "logcheck", headerName: "logcheck" },
      // { field: "pathtxt", headerName: "" },
      // { field: "pathpdf", headerName: "" },
      {
        field: "pathtxt",
        headerName: "txt",
        width: 25,
        renderCell: (cellValues) => {
          // console.log(cellValues);
          const { value } = cellValues;
          // console.log(value);
          if (value) {
            const fileName = value.split("/").pop();
            return (
              <>
                <Tooltip title={`Open ${fileName} in File Viewer`}>
                  <Link href={`${fileViewerPrefix}${value}`} target="_blank">
                    💻
                  </Link>
                </Tooltip>
                <Tooltip title={`Open ${fileName} as plain text`}>
                  <Link href={`${webDavPrefix}${value}`} target="_blank">
                    📃
                  </Link>
                </Tooltip>
              </>
            );
          } else
            return (
              <Tooltip title={`No text or SVG file available`}>
                <Avatar sx={{ bgcolor: "white", width: 12, height: 12 }}>
                  🚫
                </Avatar>
              </Tooltip>
            );
        },
      },
      {
        field: "pathpdf",
        headerName: "pdf",
        width: 25,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value) {
            const fileName = value.split("/").pop();
            return (
              <>
                <Tooltip title={`Open ${fileName} in File Viewer`}>
                  <Link href={`${fileViewerPrefix}${value}`} target="_blank">
                    💻
                  </Link>
                </Tooltip>
                <Tooltip title={`Open ${fileName} on a new tab`}>
                  <Link href={`${webDavPrefix}${value}`} target="_blank">
                    📰
                  </Link>
                </Tooltip>
              </>
            );
          } else
            return (
              <Tooltip title={`No PDF file available`}>
                <Avatar sx={{ bgcolor: "white", width: 12, height: 12 }}>
                  🚫
                </Avatar>
              </Tooltip>
            );
        },
      },
      {
        field: "pathlog",
        headerName: "log",
        width: 25,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value) {
            const fileName = value.split("/").pop();
            return (
              <>
                <Tooltip title={`Open ${fileName} in Log Viewer`}>
                  <Link href={`${logViewerPrefix}${value}`} target="_blank">
                    🧾
                  </Link>
                </Tooltip>
              </>
            );
          } else
            return (
              <Tooltip title={`No log available`}>
                <Avatar sx={{ bgcolor: "white", width: 12, height: 12 }}>
                  🚫
                </Avatar>
              </Tooltip>
            );
        },
      },
      { field: "err", headerName: "Errors", width: 30 },
      { field: "war", headerName: "Warnings", width: 30 },
      { field: "un", headerName: "UnInitialized", width: 30 },
      { field: "note", headerName: "Notes", width: 30 },
      {
        field: "dateLastModifiedlog",
        headerName: "Last modification (log)",
        width: 140,
      },
      { field: "programmer", headerName: "Programmer" },
      { field: "Reviewer", headerName: "Reviewer" },
      { field: "qcstatus", headerName: "QC status" },
    ]);
    const tempInfo = sourceData.info[0];
    setInfo(tempInfo);

    // get iss info if there is a splist on lsaf
    if (mode === "local") setIss(localiss);
    else {
      if (tempInfo.SPLISTONLSAF === "yes" && tempInfo.SPLISTISS) {
        console.log("loading SPLISTISS", tempInfo);
        fetch(webDavPrefix + tempInfo.SPLISTISS).then(function (response) {
          response.text().then(function (text) {
            if (text.includes("HTTP Status 404 – Not Found")) {
              console.log("splist was not found: ", tempInfo.SPLISTISS);
              setIss(null);
              return;
            }
            const modifiedText = text
              .replace("var embeddedData =", "")
              .replace("];", "]");
            // console.log("modifiedText", modifiedText);
            const json = JSON.parse(modifiedText);
            // console.log(json);
            if (json) setIss(json);
          });
        });
      }
    }

    const title0 = sourceData.info[0].study,
      title1 = "|" + sourceData.info[0].REVENT,
      title2a = "|" + sourceData.info[0].REPATH.split("/").pop(),
      title2 = title1 !== title2a ? title2a : "",
      title = title0 + title1 + title2;
    // console.log(title0, title1, title2a, title2, title);
    document.title = title;
    setCro(sourceData.croosdocs);
    let lastLog;
    const tempOutputLogReport2 = tempOutputLogReport.map((row) => {
      if (row.path) {
        lastLog = row.col1;
        row.col1 = [row.col1];
        return row;
      } else {
        row.col1 = [lastLog, row.col1];
        return row;
      }
    });
    setOutputLogReport(tempOutputLogReport2);
    setColsOutputLogReport([
      {
        field: "col1",
        headerName: "Log output",
        renderCell: (cellValues) => {
          // console.log(cellValues);
          const { value, row } = cellValues,
            { path } = row;
          if (path) {
            return (
              <>
                <Link href={`${logViewerPrefix}${path}`} target="_blank">
                  {value}
                </Link>
              </>
            );
          } else return null;
        },
      },
      { field: "col2", headerName: "Messages", width: 300, flex: 1 },
      // { field: "err", headerName: "Err", width: 30 },
      // { field: "war", headerName: "War", width: 30 },
      // { field: "un", headerName: "un", width: 30 },
      // { field: "note", headerName: "Note", width: 30 },
    ]);

    // Programs/Outputs Bar Chart
    const categories1 = Object.keys(sourceData.graph1),
      prog1 = sourceData.graph1["Programs"],
      out1 = sourceData.graph1["Outputs"],
      series1 = [
        {
          name: "Completed",
          data: [prog1.cleanprograms, out1.cleanoutputs],
        },
        {
          name: "Issues",
          data: [prog1.issueprograms, out1.issueoutputs],
        },
        {
          name: "Expected",
          data: [
            prog1.expectedprograms - prog1.issueprograms - prog1.cleanprograms,
            out1.createdoutputs,
          ],
        },
      ];
    setGraph1({
      chart: {
        type: "bar",
        height: 200,
      },
      accessibility: {
        enabled: false,
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: categories1,
      },
      colors: ["green", "orange", "red"],
      yAxis: {
        min: 0,
        title: {
          text: "Percent",
        },
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        series: {
          groupPadding: 0.05,
          pointPadding: 0,
          stacking: "percent",
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: series1,
    });

    // eslint-disable-next-line
  }, [sourceData]);

  // CRO Oversight graph
  useEffect(() => {
    if (iss) {
      const typeValues = iss
          .map((item) => item.type)
          .filter((value, index, self) => self.indexOf(value) === index),
        pureStatusValues = iss
          .map((item) => item.status)
          .filter((value, index, self) => self.indexOf(value) === index),
        statusValues = iss
          .map((item) => item.type + "|" + item.status)
          .filter((value, index, self) => self.indexOf(value) === index),
        data2Parents1 = typeValues.map((v, id) => {
          return {
            name: v,
            parent: "top",
            id: "p|" + id,
            color: Highcharts.getOptions().colors[id],
          };
        }),
        data2Parents2 = statusValues.map((v, id) => {
          const split = v.split("|"),
            t = split[0],
            s = split[1],
            typeIndex = "p|" + typeValues.indexOf(t),
            splitIndex = typeIndex + "|" + pureStatusValues.indexOf(s);
          return { name: s, parent: typeIndex, id: splitIndex };
        }),
        data2Detail = iss.map((r, id) => {
          r.id = id + "";
          r.parent =
            "p|" +
            typeValues.indexOf(r.type) +
            "|" +
            pureStatusValues.indexOf(r.status);
          r.value = 1;
          r.name = r.title;
          return r;
        }),
        data2 = [
          // { id: "top", name: "All" },
          ...data2Parents1,
          ...data2Parents2,
          ...data2Detail,
        ];
      setGraph2({
        chart: {
          type: "treemap",
          height: 200,
        },
        accessibility: {
          enabled: false,
        },
        title: {
          text: null,
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          headerFormat: "",
          pointFormat: "<b>{point.name}</b> ({point.value})",
        },
        // colors: ["transparent"].concat(Highcharts.getOptions().colors),
        series: [
          {
            data: data2,
            type: "treemap",
            name: "Top",
            layoutAlgorithm: "squarified",
            animationLimit: 1000,
            allowDrillToNode: true,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            levels: [
              {
                level: 1,
                dataLabels: {
                  enabled: true,
                },
                borderWidth: 3,
                levelIsConstant: false,
              },
              {
                level: 1,
                dataLabels: {
                  style: {
                    fontSize: "14px",
                  },
                },
              },
            ],
          },
        ],
      });
    }
  }, [iss]);

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} sx={{ ml: 3, mt: 3 }}>
          {info && info.retext && (
            <>
              <Button
                size="small"
                variant="outlined"
                color="info"
                disabled
                sx={{ mr: 2 }}
              >
                {"Status report created on " +
                  info.statusReportCreateDate +
                  " at " +
                  info.statusReportCreateTime}
              </Button>
              {studyList && (
                <Button
                  aria-describedby={popId}
                  size="small"
                  variant="contained"
                  color="info"
                  sx={{ mr: 3 }}
                  onClick={handlePopClick}
                >
                  Choose Study
                </Button>
              )}
              <Popover
                id={popId}
                open={popOpen}
                anchorEl={popAnchorEl}
                onClose={handlePopClose}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
              >
                <Box
                  sx={{
                    maxHeight: 600,
                    height: 600,
                    width: 800,
                    maxWidth: 800,
                  }}
                >
                  <Select
                    placeholder="Enter text to search"
                    options={studyList}
                    value={selectedStudy}
                    onChange={selectStudy}
                    menuIsOpen={true}
                    maxMenuHeight={550}
                    // size={20}
                    // pageSize={25}
                  />
                </Box>
              </Popover>
              <Tooltip title={"View the root directory with File Viewer"}>
                <Button
                  size="small"
                  variant="contained"
                  color="info"
                  sx={{ mr: 3 }}
                  onClick={() =>
                    window.open(fileViewerPrefix + info.REPATH, "_blank")
                  }
                >
                  {info.retext}
                </Button>
              </Tooltip>
            </>
          )}
          {info && info.splisturl && (
            <Tooltip
              title={
                info.splistmessage.split("]").length > 1
                  ? "View the " + info.splistmessage.split("]")[1].slice(0, -1)
                  : info.splistmessage
              }
            >
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={() => {
                  if (info.splistmessage.split("]").length > 1)
                    window.open(info.splisturl, "_blank");
                  else alert(info.splistmessage);
                }}
                sx={{ mr: 3 }}
              >
                Sharepoint List
              </Button>
            </Tooltip>
          )}
          {cro &&
            cro.map((row, id) => (
              <Tooltip
                key={"cro" + id}
                title={
                  row.name === "<missing>"
                    ? "Missing the " + row.doc + " document"
                    : "Download the document: " +
                      row.name +
                      " last modified on " +
                      row.dateLastModified
                }
              >
                <Button
                  size="small"
                  variant="contained"
                  color={row.name === "<missing>" ? "error" : "info"}
                  onClick={() => {
                    if (row.name === "<missing>") return;
                    const fileName = row.path.split("/").pop(),
                      fileType = fileName.split(".")[1];
                    if (fileType === "xlsx")
                      window.open(fileViewerPrefix + row.path, "_blank");
                    else window.open(webDavPrefix + row.path, "_blank");
                  }}
                  sx={{ mr: 3 }}
                >
                  {row.doc}
                </Button>
              </Tooltip>
            ))}
        </Grid2>
        {/* <Grid2 item xs={6}>
          <Tooltip title="Reduce size of font">
            <IconButton
              onClick={() => {
                console.log("clicked");
              }}
              // sx={{ backgroundColor: buttonBackground }}
            >
              <Remove />
            </IconButton>
          </Tooltip>
        </Grid2> */}
        <Grid2 item xs={6}>
          {graph1 && (
            <HighchartsReact highcharts={Highcharts} options={graph1} />
          )}
        </Grid2>
        <Grid2 item xs={6}>
          {graph2 && info.EVENTTYPE === "crooversight" && (
            <HighchartsReact highcharts={Highcharts} options={graph2} />
          )}
          {(!graph2 || info.EVENTTYPE !== "crooversight") && (
            <Chip
              sx={{ mt: 6, ml: 12 }}
              color="info"
              label="No CRO Oversight Information is available"
            />
          )}
        </Grid2>

        <Grid2 item xs={6}>
          <Container
            sx={{
              height: sectionSizes[1],
              maxHeight: sectionSizes[1],
              // width: windowDimension.winWidth / 2 - 50,
              // minWidth: windowDimension.winWidth / 2 - 50,
            }}
          >
            {report1a && (
              <DataGridPro
                rows={report1a}
                columns={colsReport1a}
                density="compact"
                rowHeight={42}
                hideFooter={true}
                sx={{
                  fontSize: "0.8em",
                  "& .note": {
                    backgroundColor: "#e6f7ff",
                    color: "#0000ff",
                  },
                  "& .amber": {
                    backgroundColor: "#fff5e6",
                    color: "#0000ff",
                  },
                  "& .red": {
                    backgroundColor: "#ffe6e6",
                    color: "#0000ff",
                  },
                }}
                getCellClassName={(params) => {
                  if (params.field === "err" && params.value > 0) {
                    return "red";
                  } else if (params.field === "war" && params.value > 0) {
                    return "amber";
                  } else if (params.field === "un" && params.value > 0) {
                    return "note";
                  } else if (params.field === "note" && params.value > 0) {
                    return "note";
                  } else if (
                    params.field === "headerFails" &&
                    params.value > 0
                  ) {
                    return "red";
                  } else if (
                    params.field === "logcheck" &&
                    params.value !== "clean"
                  ) {
                    return "amber";
                  } else return;
                  // return params.value >= 15 ? "hot" : "cold";
                }}
              />
            )}
          </Container>
        </Grid2>
        <Grid2 item xs={6}>
          <Container
            sx={{
              height: sectionSizes[1],
              maxHeight: sectionSizes[1],
              // width: windowDimension.winWidth / 2 - 50,
              // minWidth: windowDimension.winWidth / 2 - 50,
            }}
          >
            {outputLogReport && (
              <DataGridPro
                treeData
                getTreeDataPath={(row) => row.col1}
                rows={outputLogReport}
                columns={colsOutputLogReport}
                density="compact"
                rowHeight={30}
                hideFooter={true}
                sx={{
                  fontSize: "0.8em",
                }}
              />
            )}
          </Container>
        </Grid2>
        <Grid2 item xs={12}>
          <Box
            sx={{
              // border: 2,
              // m: 1,
              // fontSize: fontSize,
              height: sectionSizes[2],
              maxHeight: sectionSizes[2],
              width: windowDimension.winWidth - 50,
              minWidth: windowDimension.winWidth - 50,
              // overflow: "auto",
            }}
          >
            {report2 && (
              <DataGridPro
                rows={report2}
                columns={colsReport2}
                density="compact"
                rowHeight={42}
                hideFooter={true}
                sx={{
                  fontSize: "0.8em",
                  "& .note": {
                    backgroundColor: "#e6f7ff",
                    color: "#0000ff",
                  },
                  "& .amber": {
                    backgroundColor: "#fff5e6",
                    color: "#0000ff",
                  },
                  "& .red": {
                    backgroundColor: "#ffe6e6",
                    color: "#0000ff",
                  },
                }}
                getCellClassName={(params) => {
                  if (params.field === "err" && params.value > 0) {
                    return "red";
                  } else if (params.field === "war" && params.value > 0) {
                    return "amber";
                  } else if (params.field === "un" && params.value > 0) {
                    return "note";
                  } else if (params.field === "note" && params.value > 0) {
                    return "note";
                  } else return;
                }}
              />
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default App;
