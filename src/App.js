import React, { useState, useEffect, createRef } from "react";
import {
  Box,
  Container,
  Tooltip,
  Typography,
  Chip,
  Link,
  Avatar,
  Button,
  IconButton,
  Popover,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { QuestionMark, Done, Close } from "@mui/icons-material";
import UserInput from "./UserInput";
// import Button from "@mui/material-next/Button";
import Select from "react-select";
import Highcharts from "highcharts";
// import Sunburst from "highcharts/modules/sunburst";
// import Treemap from "highcharts/modules/treemap";
import More from "highcharts/highcharts-more";
import HighchartsReact from "highcharts-react-official";
import {
  DataGridPro,
  useGridApiRef,
  LicenseInfo,
  gridClasses,
} from "@mui/x-data-grid-pro";
import all from "./test/all.json"; // /argx-113/cidp/argx-113-1802/testrun1/qc_adam
// import all from "./test/all2.json"; // /argx-117/hv/argx-117-1901/mad5_tables
// import all from "./test/all3.json"; // /argx-113/x-ind/argx-113-0000/generic_adam
// import all from "./test/all4.json"; // /argx-113/mg/argx-113-9031/ma2022
// import all from "./test/all5.json"; // /argx-113/sjogren/argx-113-0000/generic_adam
// import all from "./test/all6.json"; // /argx-113/mg/argx-113-9031/iss_20220131/qc_tlf
import localiss from "./test/iss.json";
import localstudies from "./test/dash-study-files.json";
import localUserJson from "./test/user.json";
import { getJsonFile } from "./utility";

const App = () => {
  LicenseInfo.setLicenseKey(
    "5b931c69b031b808de26d5902e04c36fTz00Njk0NyxFPTE2ODg4MDI3MDM3MjAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
  );
  // Sunburst(Highcharts);
  // Treemap(Highcharts);
  More(Highcharts);
  const radialRef = createRef(),
    { href, protocol, host } = window.location,
    mode = href.startsWith("http://localhost") ? "local" : "remote",
    urlPrefix = protocol + "//" + host,
    apiRef = useGridApiRef(),
    [windowDimension, detectHW] = useState({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    }),
    detectSize = () => {
      calcSectionSizes();
      console.log("sectionSizes", sectionSizes);
      detectHW({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      });
    },
    [openUserInput, setOpenUserInput] = useState(false),
    topSpace = 350,
    gridFontSize = 0.6,
    [alternateLayout] = useState(true),
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
    webDavPrefix = "https://xarprod.ondemand.sas.com/lsaf/webdav/repo",
    [report1a, setReport1a] = useState(null),
    [colsReport1a, setColsReport1a] = useState(null),
    [report1b, setReport1b] = useState(null),
    [colsReport1b, setColsReport1b] = useState(null),
    [report2, setReport2] = useState(null),
    [colsReport2, setColsReport2] = useState(null),
    [outputLogReport, setOutputLogReport] = useState(null),
    [colsOutputLogReport, setColsOutputLogReport] = useState(null),
    [info, setInfo] = useState(null),
    [cro, setCro] = useState(null),
    [rowToCheck, setRowToCheck] = useState(null),
    [graph1, setGraph1] = useState(null),
    [graph2, setGraph2] = useState(null),
    // [graph3, setGraph3] = useState(null),
    loadFiles = (url) => {
      fetch(url).then(function (response) {
        response.text().then(function (text) {
          const json = JSON.parse(text);
          setSourceData(json);
        });
      });
    },
    [sourceData, setSourceData] = useState(null),
    [userJson, setUserJson] = useState(null), // holds info that a user has entered using the UserInput component to a JSON file
    [userJsonFile, setUserJsonFile] = useState(null), // filename of the JSON file for user.json where we store user comments to override data in dashboard
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
    [idClickedOn, setIdClickedOn] = useState(null),
    selectStudy = (e) => {
      // console.log(e);
      setSelectedStudy(e.value);
      const newUrl = href.split("?")[0] + "?file=" + e.value;
      document.title = e.label.split("/")[2];
      window.history.pushState({}, "Title", newUrl);
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

  useEffect(() => {
    if (alternateLayout && report1a && outputLogReport && report2) {
      const section2a = (report1a.length + 1) * 32,
        section2b = (outputLogReport.length + 1) * 22,
        section2 = Math.max(section2a, section2b),
        section3 = (report2.length + 1) * 32;
      setSectionSizes([topSpace, section3, section2]);
    } else calcSectionSizes();
    // eslint-disable-next-line
  }, [alternateLayout, report1a, outputLogReport, report2]);

  // get list of all studies we have JSON built for
  useEffect(() => {
    if (mode === "local") {
      const lsafsearch = localstudies["SASTableData+LSAFSEARCH"],
        tempStudyList = lsafsearch
          .map((r) => {
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
          })
          .filter((val) => {
            // console.log(val);
            const parts = val.value.split("/");
            if (parts.length > 7) return parts[7] !== "generic_adam";
            else return true;
          });
      setStudyList(tempStudyList);
      return;
    }
    fetch(webDavPrefix + studyListFile).then(function (response) {
      response.text().then(function (text) {
        const json = JSON.parse(text);
        const lsafsearch = json["SASTableData+LSAFSEARCH"],
          tempStudyList = lsafsearch
            .map((r) => {
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
            })
            .filter((val) => {
              // console.log(val);
              const parts = val.value.split("/");
              // console.log(parts);
              if (parts.length > 7) return parts[7] !== "generic_adam";
              else return true;
            });
        setStudyList(tempStudyList);
        console.log("href", href);
        // if a study wasn't passed in on the URL, then just pick the first available study to show
        if (href.split("?").length === 1) {
          setSelectedStudy(tempStudyList[0].value);
          loadFiles(webDavPrefix + tempStudyList[0].value);
        } else if (href.split("?").length > 1) {
          const file1 = href.split("?")[1].split("=")[1];
          console.log("file1", file1);
          setSelectedStudy(file1);
          loadFiles(webDavPrefix + file1);
        }
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

  // do this when sourceData changes
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
      tempReport1b = sourceData.report1
        .filter((r) => {
          return (
            r.headercheck !== "all clean" &&
            r.headercheck !== "" &&
            r.headerfailmess !== "All pass"
          );
        })
        .map((r, id) => {
          return { id: id, ...r };
        }),
      tempReport2 = sourceData.report2.map((r, id) => {
        return { id: id, ...r };
      }),
      tempOutputLogReport = sourceData.outputlogreport.map((r, id) => {
        return { id: id, ...r };
      });
    setReport1a(tempReport1a);
    setColsReport1a([
      {
        field: "sas_program",
        headerName: "SAS program",
        headerClassName: "header",
        width: 80,
        sortable: false,
      },
      {
        field: "sasprog_exist",
        headerName: "Program file exists",
        headerClassName: "header",
        width: 60,
        sortable: false,
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
                label={"Yes"}
                sx={{ fontSize: gridFontSize + 0.3 + "em" }}
              />
            );
          } else
            return (
              <Chip
                variant="outlined"
                size="small"
                color="error"
                label={"No"}
                sx={{ fontSize: gridFontSize + 0.3 + "em" }}
              />
            );
        },
      },
      {
        field: "jobname",
        headerName: "Job file",
        headerClassName: "header",
        width: 90,
        sortable: false,
      },
      {
        field: "logcheck",
        headerName: "Job log file",
        headerClassName: "header",
        width: 140,
        flex: 1,
        sortable: false,
      },
      {
        field: "headercheck",
        headerName: "Program header checks",
        headerClassName: "header",
        width: 100,
        sortable: false,
      },
      // {
      //   field: "manifestname",
      //   headerName: "Manifest",
      //   width: 125,
      //   sortable: false,
      //   renderCell: (cellValues) => {
      //     const { value } = cellValues;
      //     if (value) {
      //       return (
      //         <Chip
      //           size="small"
      //           variant="outlined"
      //           color="info"
      //           onClick={() => {
      //             window.open(fileViewerPrefix + value, "_blank");
      //           }}
      //           label={"View"}
      //         />
      //       );
      //     } else
      //       return (
      //         <Chip
      //           variant="outlined"
      //           size="small"
      //           color="error"
      //           label={"Missing"}
      //         />
      //       );
      //   },
      // },
      // { field: "err", headerName: "Errors", width: 30, sortable: false },
      // { field: "war", headerName: "Warnings", width: 30, sortable: false },
      // { field: "un", headerName: "Uninitialized", width: 30, sortable: false },
      // { field: "note", headerName: "Notes", width: 30, sortable: false },
      // {
      //   field: "headerFails",
      //   headerName: "Header Fail",
      //   width: 30,
      //   sortable: false,
      // },
      // {
      //   field: "headerPasses",
      //   headerName: "Header Pass",
      //   width: 30,
      //   sortable: false,
      // },
    ]);
    setReport1b(tempReport1b);
    setColsReport1b([
      {
        field: "sas_program",
        headerName: "SAS program",
        headerClassName: "header",
        width: 125,
        sortable: false,
      },
      {
        field: "headercheck",
        headerName: "Program header checks",
        headerClassName: "header",
        width: 150,
        sortable: false,
      },
      {
        field: "headerfailmess",
        headerName: "detail",
        headerClassName: "header",
        width: "240",
        flex: 1,
        sortable: false,
      },
    ]);

    setReport2(tempReport2);
    setColsReport2([
      {
        field: "section",
        headerName: "SAP section",
        headerClassName: "header",
        width: 30,
        sortable: false,
      },
      {
        field: "type",
        headerName: "Output type",
        headerClassName: "header",
        width: 30,
        sortable: false,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value) {
            let icon = "";
            if (value === "Table") icon = "📄";
            else if (value === "Listing") icon = "📜";
            else if (value === "Figure") icon = "📊";
            else if (value === "Dataset") icon = "💿";
            else if (value === "ADaM") icon = "📗";
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
        headerClassName: "header",
        width: 60,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues;
          if (value) {
            return (
              <Tooltip title={row.Title}>
                <Typography sx={{ fontSize: gridFontSize + 0.2 + "em" }}>
                  {value}
                </Typography>
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
        headerClassName: "header",
        width: 15,
        sortable: false,
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
        headerClassName: "header",
        width: 15,
        sortable: false,
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
        field: "logcheck",
        headerName: "Output log file",
        headerClassName: "header",
        flex: 1,
        sortable: false,
      },
      {
        field: "pathlog",
        headerName: "log",
        headerClassName: "header",
        width: 15,
        sortable: false,
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
      // { field: "err", headerName: "Errors", width: 30, sortable: false },
      // { field: "war", headerName: "Warnings", width: 30, sortable: false },
      // { field: "un", headerName: "UnInitialized", width: 30, sortable: false },
      // { field: "note", headerName: "Notes", width: 30, sortable: false },
      {
        field: "dateLastModifiedlog",
        headerName: "Last modification",
        headerClassName: "header",
        width: 100,
        sortable: false,
      },
      {
        field: "programmer",
        headerName: "Programmer",
        headerClassName: "header",
        width: 90,
        sortable: false,
      },
      // { field: "Reviewer", headerName: "Reviewer", sortable: false },
      // { field: "qcstatus", headerName: "QC status", sortable: false },
    ]);
    const tempInfo = sourceData.info[0];
    setInfo(tempInfo);

    // get iss info if there is a splist on lsaf
    if (mode === "local") setIss(localiss);
    else {
      if (tempInfo.SPLISTONLSAF === "yes" && tempInfo.SPLISTISS) {
        console.log("loading SPLISTISS", tempInfo);
        fetch(webDavPrefix + tempInfo.SPLISTISS)
          .then(function (response) {
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
          })
          .catch((err) =>
            console.log(
              "fetch failed for " +
                webDavPrefix +
                tempInfo.SPLISTISS +
                " - " +
                err
            )
          );
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
    // console.log("tempOutputLogReport2", tempOutputLogReport2);
    setColsOutputLogReport([
      {
        field: "col1",
        headerName: "Log output",
        headerClassName: "header",
        sortable: false,
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
      {
        field: "col2",
        headerName: "Messages",
        headerClassName: "header",
        width: 300,
        sortable: false,
        flex: 1,
      },
      {
        field: "ok",
        headerName: "OK",
        headerClassName: "header",
        width: 30,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { line, id } = row;
          // console.log(value, row, cellValues);
          if (line > 0) {
            if (value) {
              return (
                <IconButton
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setRowToCheck(row);
                    setIdClickedOn(id);
                    setOpenUserInput(true);
                  }}
                >
                  <Done />
                </IconButton>
              );
            } else if (value === false) {
              return (
                <IconButton
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setRowToCheck(row);
                    setIdClickedOn(id);
                    setOpenUserInput(true);
                  }}
                >
                  <Close />
                </IconButton>
              );
            } else
              return (
                <IconButton
                  variant="outlined"
                  size="small"
                  color="info"
                  onClick={() => {
                    setRowToCheck(row);
                    setIdClickedOn(id);
                    setOpenUserInput(true);
                  }}
                  label={"?"}
                >
                  <QuestionMark />
                </IconButton>
              );
          } else {
            return null;
          }
        },
      },
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
            out1.expectedoutputs - out1.cleanoutputs - out1.issueoutputs,
          ],
        },
      ];
    setGraph1({
      chart: {
        type: "bar",
        height: 120,
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
      colors: ["#b3ffb3", "#ffe0b3", "#ffb3b3"],
      yAxis: {
        min: 0,
        enabled: false,
        labels: { enabled: false },
        title: {
          enabled: false,
        },
      },
      legend: {
        reversed: true,
        enabled: false,
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
    // console.log(categories1);

    // eslint-disable-next-line
  }, [sourceData]);

  // CRO Oversight graph
  useEffect(() => {
    if (iss) {
      const colors = ["#b3ffb3", "#ffe0b3", "#ffb3ff", "#ffb3b3"],
        lev1Values = iss
          .map((item) => item.status)
          .filter((value, index, self) => self.indexOf(value) === index),
        pureLev2Values = iss
          .map((item) => item.type)
          .filter((value, index, self) => self.indexOf(value) === index),
        // lev2Values = iss
        //   .map((item) => item.status + "|" + item.type)
        //   .filter((value, index, self) => self.indexOf(value) === index),
        // data2Parents1 = lev1Values.map((v, id) => {
        //   return {
        //     name: v,
        //     parent: "top",
        //     id: "p|" + id,
        //     color: colors[id],
        //   };
        // }),
        // data2Parents2 = lev2Values.map((v, id) => {
        //   const split = v.split("|"),
        //     t = split[0],
        //     s = split[1],
        //     lev1Index = "p|" + lev1Values.indexOf(t),
        //     splitIndex = lev1Index + "|" + pureLev2Values.indexOf(s);
        //   return { name: s, parent: lev1Index, id: splitIndex };
        // }),
        data2Detail = iss.map((r, id) => {
          r.id = id + "";
          r.parent =
            "p|" +
            lev1Values.indexOf(r.status) +
            "|" +
            pureLev2Values.indexOf(r.type);
          r.value = 1;
          r.name = r.title;
          return r;
        }),
        // data2 = [
        //   // { id: "top", name: "All" },
        //   ...data2Parents1,
        //   ...data2Parents2,
        //   ...data2Detail,
        // ],
        tempStatusSummary = {},
        statusSummary = [],
        tempTypeSummary = {},
        typeSummary = [];
      // console.log("lev1Values", lev1Values, "data2Detail", data2Detail);

      // summarise by status, counting how many
      data2Detail.forEach(function (d) {
        if (tempStatusSummary.hasOwnProperty(d.status)) {
          tempStatusSummary[d.status] = tempStatusSummary[d.status] + d.value;
        } else {
          tempStatusSummary[d.status] = d.value;
        }
      });
      for (const prop in tempStatusSummary) {
        statusSummary.push({
          name: prop,
          data: [tempStatusSummary[prop], null],
        });
      }
      // console.log("statusSummary", statusSummary);

      // summarise by type, counting how many
      data2Detail.forEach(function (d) {
        if (tempTypeSummary.hasOwnProperty(d.type)) {
          tempTypeSummary[d.type] = tempTypeSummary[d.type] + d.value;
        } else {
          tempTypeSummary[d.type] = d.value;
        }
      });
      for (const prop in tempTypeSummary) {
        typeSummary.push({ name: prop, data: [null, tempTypeSummary[prop]] });
      }
      // console.log("typeSummary", typeSummary);

      const combinedSummary = [...statusSummary, ...typeSummary];
      // console.log("combinedSummary", combinedSummary);

      // setGraph2({
      //   chart: {
      //     type: "treemap",
      //     height: 200,
      //   },
      //   accessibility: {
      //     enabled: false,
      //   },
      //   title: {
      //     text: null,
      //   },
      //   credits: {
      //     enabled: false,
      //   },
      //   tooltip: {
      //     headerFormat: "",
      //     pointFormat:
      //       "<b>{point.name}: </b>{point.value}<br/><b>ID: </b>{point.tlfid}<br/><b>Domain: </b>{point.domain}<br/><b>Reviewer: </b>{point.reviewer}<br/><b>Last Modified: </b>{point.lastModified}",
      //   },
      //   series: [
      //     {
      //       data: data2,
      //       type: "treemap",
      //       name: "Top",
      //       layoutAlgorithm: "squarified",
      //       animationLimit: 1000,
      //       allowDrillToNode: true,
      //       cursor: "pointer",
      //       dataLabels: {
      //         enabled: false,
      //       },
      //       levels: [
      //         {
      //           level: 1,
      //           dataLabels: {
      //             enabled: true,
      //             style: {
      //               fontSize: gridFontSize+"em",
      //             },
      //           },
      //           borderWidth: 3,
      //           levelIsConstant: false,
      //         },
      //       ],
      //     },
      //   ],
      // });

      setGraph2({
        chart: {
          type: "column",
          inverted: true,
          polar: true,
          backgroundColor: "rgba(0,0,0,0)",
          // spacing: [0, 0, 0, 0],
          // width: 300,
          height: 120,
          // plotBorderWidth: 0,
        },
        title: {
          text: null,
        },
        tooltip: {
          outside: true,
          style: { fontSize: "7px" },
        },
        pane: {
          size: "100%",
          innerSize: "20%",
          endAngle: 90,
          startAngle: -90,
        },
        xAxis: {
          tickInterval: 1,
          // min: 0,
          labels: {
            align: "right",
            useHTML: true,
            allowOverlap: true,
            step: 1,
            y: 1,
            // x: 3,
            style: {
              fontSize: "8px",
            },
          },
          lineWidth: 0,
          categories: ["Status", "Type"],
        },
        yAxis: {
          // crosshair: {
          //   enabled: true,
          //   color: "#333",
          // },
          lineWidth: 0,
          // tickInterval: 25,
          reversedStacks: false,
          endOnTick: false,
          showLastLabel: true,
          enabled: false,
          labels: { enabled: false },
          title: {
            enabled: false,
          },
        },
        plotOptions: {
          column: {
            stacking: "normal",
            borderWidth: 0,
            pointPadding: 0,
            groupPadding: 0.15,
          },
        },
        colors: colors,
        accessibility: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        series: combinedSummary,
      });
    }
  }, [iss]);

  useEffect(() => {
    // console.log("radialRef", radialRef);
    if (radialRef.current) {
      const { container } = radialRef.current;
      // console.log(
      //   "radialRef.current",
      //   radialRef.current,
      //   "container",
      //   container,
      //   "container.current",
      //   container.current
      // );
      if (container.current) {
        container.current.style.scale = 2;
        container.current.style.top = "50%";
        container.current.style.position = "relative";
      }
    }
    // eslint-disable-next-line
  }, [graph2]);

  // if we have new info, then we are on a new study and so can get the JSON with any user comments
  useEffect(() => {
    if (!selectedStudy) return;
    const fileToLoad0 = selectedStudy.split("/");
    fileToLoad0.pop();
    const fileToLoad = webDavPrefix + fileToLoad0.join("/") + "/user.json";
    setUserJsonFile(fileToLoad); // set the filename since we need this when using dialog to enter and save comments
    console.log("info changed, so loading: " + fileToLoad);
    if (mode === "local") setUserJson(localUserJson);
    else getJsonFile(fileToLoad, setUserJson);
    // eslint-disable-next-line
  }, [info, selectedStudy]);

  // there is no user JSON data so we can make default
  useEffect(() => {
    if (!userJson) {
      // make a default structure for user info if we dont have one - e.g. getJsonFile has returned false because there is no user.json file
      const tempUserJson = [];
      console.log("tempUserJson", tempUserJson);
      setUserJson(tempUserJson);
    }
  }, [userJson]);

  // there is new user JSON data, so we can process it and integrate that into what is shown on screen
  useEffect(() => {
    if (userJson && sourceData && outputLogReport) {
      const tempOutputLogReport = [...outputLogReport];
      console.log(
        "userJson has changed: ",
        userJson,
        "tempOutputLogReport",
        tempOutputLogReport
      );
      userJson.forEach((item) => {
        const row = tempOutputLogReport[item.id];
        console.log(
          "row",
          row,
          "item.id",
          item.id,
          "item.ok",
          item.ok,
          "item.col2",
          item.col2,
          "item.issuenr",
          item.issuenr
        );
        // if we have an override in user.json, then use that value
        if (row) {
          if (row.col2 === item.col2) row.ok = item.ok;
        }
      });
      setOutputLogReport(tempOutputLogReport);

      // re-check data to see if we can update data for graphs. i.e. if all issues are marked as OK, then that output can be marked Completed
      let lastOutput = "",
        currentIssuesInLog = 0,
        logsWithIssues = 0,
        outputsWithIssues = [],
        outputsWithoutIssues = [],
        allOutputs = [];
      tempOutputLogReport.forEach((row) => {
        if (row.output !== lastOutput) {
          // new section
          allOutputs.push(row.output);
          // console.log(lastOutput, row.output, currentIssuesInLog);
          if (lastOutput !== "" && currentIssuesInLog > 0) {
            // does previous section have issues
            logsWithIssues++; // count the logs with issues
            outputsWithIssues.push(lastOutput);
          }
          currentIssuesInLog = 0; // reset number of issues for the current log
        }
        if (row.issuenr > 0 && !row.ok) currentIssuesInLog++; // add one to the issues
        // console.log(row.issuenr, !row.ok, currentIssuesInLog);
        lastOutput = row.output;
      });
      if (lastOutput !== "" && currentIssuesInLog > 0) {
        logsWithIssues++; // count the logs with issues
        outputsWithIssues.push(lastOutput);
      }
      allOutputs.forEach((x) => {
        if (!outputsWithIssues.includes(x)) outputsWithoutIssues.push(x);
      });
      console.log(
        "logsWithIssues",
        logsWithIssues,
        "allOutputs",
        allOutputs,
        "outputsWithIssues",
        outputsWithIssues,
        "outputsWithoutIssues",
        outputsWithoutIssues
      );

      // reconstruct programs/outputs graph by modifying sourceData
      const { graph1, report1, report2 } = sourceData;
      let cleanprograms = 0,
        expectedprograms = 0,
        issueprograms = 0;
      report1.forEach((program) => {
        expectedprograms++;
        if (program.logcheck === "clean") {
          cleanprograms++;
        } else if (program.logcheck !== "no log!") issueprograms++;
      });
      // console.log(
      //   "expectedprograms",
      //   expectedprograms,
      //   "issueprograms",
      //   issueprograms,
      //   "cleanprograms",
      //   cleanprograms
      // );

      let cleanoutputs = 0,
        expectedoutputs = 0,
        issueoutputs = 0;
      report2.forEach((output) => {
        const logName = output.pathlog
          ? output.pathlog.split("/").pop()
          : output.datasetlogpath.split("/").pop();
        expectedoutputs++;
        // console.log("logName", logName, "output.logcheck", output.logcheck);
        if (
          output.logcheck === "clean" ||
          outputsWithoutIssues.includes(logName)
        ) {
          cleanoutputs++;
        } else if (output.logcheck !== "no log!") issueoutputs++;
      });
      // console.log(
      //   "expectedoutputs",
      //   expectedoutputs,
      //   "issueoutputs",
      //   issueoutputs,
      //   "cleanoutputs",
      //   cleanoutputs,
      //   "sourceData",
      //   sourceData
      // );
      const newSeries = [
          {
            name: "Completed",
            data: [cleanprograms, cleanoutputs],
          },
          {
            name: "Issues",
            data: [issueprograms, issueoutputs],
          },
          {
            name: "Expected",
            data: [
              expectedprograms - issueprograms - cleanprograms,
              expectedoutputs - cleanoutputs - issueoutputs,
            ],
          },
        ],
        newGraph1 = { ...graph1, series: newSeries };
      console.log("newSeries", newSeries);
      setGraph1(newGraph1);
    }
    // eslint-disable-next-line
  }, [userJson]);

  // console.log("report1b", report1b);

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} sx={{ ml: 3, mt: 3 }}>
          {info && info.retext && (
            <>
              {studyList && (
                <Button
                  aria-describedby={popId}
                  size="small"
                  variant="contained"
                  color="secondary"
                  sx={{ mr: 3 }}
                  onClick={handlePopClick}
                >
                  Choose Study
                </Button>
              )}

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
                  sx={{ mr: 3, textTransform: "none" }}
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
          {/* <Tooltip
            title={
              alternateLayout
                ? "Switch to one page layout"
                : "Switch to continuous layout"
            }
          >
            <IconButton
              size="small"
              color={alternateLayout ? "primary" : "secondary"}
              onClick={() => {
                setAlternateLayout(!alternateLayout);
              }}
            >
              <SwapVertSharp />
            </IconButton>
          </Tooltip> */}
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
          {/* {graph3 && info.EVENTTYPE === "crooversight" && (
            <HighchartsReact highcharts={Highcharts} options={graph3} />
          )} */}
        </Grid2>
        <Grid2 item xs={6}>
          {graph2 && info.EVENTTYPE === "crooversight" && (
            <HighchartsReact
              highcharts={Highcharts}
              options={graph2}
              ref={radialRef}
            />
          )}
          {/* {(!graph2 || info.EVENTTYPE !== "crooversight") && (
            <Chip
              sx={{ mt: 6, ml: 12 }}
              color="info"
              label="No CRO Oversight Information is available"
            />
          )} */}
        </Grid2>

        <Grid2 item xs={6}>
          <Container
            sx={
              {
                // height: sectionSizes[1],
                // maxHeight: sectionSizes[1],
                // width: windowDimension.winWidth / 2 - 50,
                // minWidth: windowDimension.winWidth / 2 - 50,
              }
            }
          >
            {report1a && (
              <DataGridPro
                rows={report1a}
                columns={colsReport1a}
                disableColumnMenu
                canUserSort={false}
                density="compact"
                rowHeight={42}
                autoHeight
                hideFooter={true}
                defaultGroupingExpansionDepth={-1}
                sx={{
                  fontSize: gridFontSize + "em",
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
                  "& .header": {
                    backgroundColor: "rgba(255, 255, 80, .33)",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeaderTitleContainer": {
                    lineHeight: 1,
                    whiteSpace: "normal",
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
            {report1b && report1b.length > 0 ? (
              <DataGridPro
                rows={report1b}
                columns={colsReport1b}
                disableColumnMenu
                canUserSort={false}
                density="compact"
                // rowHeight={42}
                getRowHeight={() => "auto"}
                autoHeight
                hideFooter={true}
                defaultGroupingExpansionDepth={-1}
                sx={{
                  fontSize: gridFontSize + "em",
                  mt: 2,
                  [`& .${gridClasses.cell}`]: {
                    py: 1,
                  },
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
                  "& .header": {
                    backgroundColor: "rgba(255, 255, 80, 0.33)",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeaderTitleContainer": {
                    lineHeight: 1,
                    whiteSpace: "normal",
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
            ) : null}
          </Container>
        </Grid2>
        <Grid2 item xs={6}>
          <Box
            sx={
              {
                // border: 2,
                // m: 1,
                // fontSize: fontSize,
                // height: sectionSizes[1],
                // maxHeight: sectionSizes[1],
                // width: windowDimension.winWidth - 50,
                // minWidth: windowDimension.winWidth - 50,
                // overflow: "auto",
              }
            }
          >
            {report2 && (
              <DataGridPro
                rows={report2}
                columns={colsReport2}
                disableColumnMenu
                density="compact"
                rowHeight={42}
                autoHeight
                hideFooter={true}
                sx={{
                  fontSize: gridFontSize + "em",
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
                  "& .header": {
                    backgroundColor: "rgba(255, 255, 80, 0.33)",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeaderTitleContainer": {
                    lineHeight: 1,
                    whiteSpace: "normal",
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
                onRowClick={(params) => {
                  const { row } = params,
                    { pathlog } = row;
                  let logName = "";
                  if (pathlog) logName = pathlog.split("/").pop();
                  const rowIndex = outputLogReport
                    .map((e) => e.output)
                    .indexOf(logName);
                  console.log(row, logName, rowIndex);

                  apiRef.current.scrollToIndexes({
                    rowIndex: rowIndex,
                    colIndex: 0,
                  });
                  // apiRef.current.setCellFocus({ id: rowIndex, field: "ok" });
                  window.find(logName);
                }}
              />
            )}
          </Box>
        </Grid2>
        <Grid2 item xs={12}>
          <Container
            sx={
              {
                // height: sectionSizes[2],
                // maxHeight: sectionSizes[2],
                // width: windowDimension.winWidth / 2 - 50,
                // minWidth: windowDimension.winWidth / 2 - 50,
              }
            }
          >
            {outputLogReport && outputLogReport.length > 0 && (
              <DataGridPro
                treeData
                defaultGroupingExpansionDepth={-1}
                getTreeDataPath={(row) => row.col1}
                rows={outputLogReport}
                columns={colsOutputLogReport}
                disableColumnMenu
                density="compact"
                rowHeight={30}
                autoHeight
                hideFooter={true}
                apiRef={apiRef}
                sx={{
                  fontSize: gridFontSize + "em",
                  "& .header": {
                    backgroundColor: "rgba(255, 255, 80, 0.33)",
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "rgba(255, 255, 80, 0.33)",
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeaderTitleContainer": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                }}
              />
            )}
          </Container>
        </Grid2>
      </Grid2>
      {openUserInput && (
        <UserInput
          open={openUserInput}
          setOpen={setOpenUserInput}
          userJson={userJson}
          userJsonFile={userJsonFile}
          rowToCheck={rowToCheck}
          setUserJson={setUserJson}
          idClickedOn={idClickedOn}
        />
      )}
    </Box>
  );
};

export default App;
