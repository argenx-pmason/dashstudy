import React, { useState, useEffect, createRef } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Link,
  Button,
  IconButton,
  Popover,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  QuestionMark,
  Done,
  Close,
  MenuBookTwoTone,
  Info,
} from "@mui/icons-material";
import UserInput from "./UserInput";
import OutputReview from "./OutputReview";
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
import Donut from "./pages/Donut.jsx";

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
      // console.log("sectionSizes", sectionSizes);
      detectHW({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
      });
    },
    [sapErrMsg, setSapErrMsg] = useState(""),
    [bsopErrMsg, setBsopErrMsg] = useState(""),
    [openUserInput, setOpenUserInput] = useState(false),
    topSpace = 350,
    gridFontSize = 0.7,
    rowHeight = 22,
    amber = "rgba(255, 153, 51, 0.3)",
    [alternateLayout] = useState(true),
    [, setSectionSizes] = useState([topSpace, 200, 200]), // currently not using sectionSizes
    calcSectionSizes = () => {
      const section2 = Math.floor((windowDimension.winHeight - topSpace) / 2),
        section3 = Math.floor((windowDimension.winHeight - topSpace) / 2);
      setSectionSizes([topSpace, section2, section3]);
    },
    [outputClickedOn, setOutputClickedOn] = useState(null),
    [openOutputReview, setOpenOutputReview] = useState(null),
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
    [parent, setParent] = useState(null),
    [cro, setCro] = useState(null),
    [rowToCheck, setRowToCheck] = useState(null),
    [graph1, setGraph1] = useState(null),
    [graph2, setGraph2] = useState(null),
    loadFiles = (url) => {
      fetch(url).then(function (response) {
        // console.log(response);
        response
          .text()
          .then(function (text) {
            if (response.status !== 200) {
              alert(`${url} failed - response code: ${response.status}`);
              handlePopClick();
            }
            const json = JSON.parse(text);
            setSourceData(json);
            return true;
          })
          .catch((err) => console.log("fetch failed for " + url + " - " + err));
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
    [iss, setIss] = useState(null),
    d3ref = createRef();

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
            // console.log(r)
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
                r.formattedsize +
                ")",
            };
          })
          .filter((val) => {
            // console.log(val);
            const parts = val.value.split("/");
            if (parts.length > 7) return parts[7] !== "generic_adam";
            else return true;
          });
      // console.log("tempStudyList", tempStudyList);
      setStudyList(tempStudyList);
      return;
    }
    // handle remote
    fetch(webDavPrefix + studyListFile).then(function (response) {
      // console.log(response);
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
          loadFiles(webDavPrefix + tempStudyList[0].value); // read default first study
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
    console.log(`MODE:\t${mode} ---> ${urlPrefix}`);
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
    console.log("INFO:\tsourceData", sourceData);
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
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { path, sasprog_exist } = row;
          if (sasprog_exist === "Yes") {
            return (
              <Tooltip title={"View program"}>
                <Box
                  sx={{ color: "blue" }}
                  onClick={() => {
                    window.open(fileViewerPrefix + path, "_blank");
                  }}
                >
                  {value}
                </Box>
              </Tooltip>
            );
          } else {
            return <Box>{value}</Box>;
          }
        },
      },
      {
        field: "sasprog_exist",
        headerName: "Exists",
        description: "Program file exists",
        headerClassName: "header",
        width: 30,
        sortable: false,
      },
      {
        field: "jobname",
        headerName: "Job file",
        headerClassName: "header",
        width: 90,
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value !== "no job") {
            return (
              <Tooltip title={"View job XML"}>
                <Box
                  sx={{ color: "blue" }}
                  onClick={() => {
                    window.open(
                      fileViewerPrefix + info.REPATH + "/jobs/" + value,
                      "_blank"
                    );
                  }}
                >
                  {value}
                </Box>
              </Tooltip>
            );
          } else {
            return <Box>{value}</Box>;
          }
        },
      },
      {
        field: "logcheck",
        headerName: "Job log file",
        headerClassName: "header",
        width: 140,
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { sas_program } = row,
            log = sas_program.split(".")[0] + ".log";
          if (value !== "no log!") {
            return (
              <Tooltip title={"View log"}>
                <Box
                  sx={{ color: "blue" }}
                  onClick={() => {
                    window.open(
                      logViewerPrefix + info.REPATH + "/log/" + log,
                      "_blank"
                    );
                  }}
                >
                  {value}
                </Box>
              </Tooltip>
            );
          } else {
            return <Box>{value}</Box>;
          }
        },
      },
      {
        field: "headercheck",
        headerName: "Header checks",
        description: "Program header checks",
        headerClassName: "header",
        width: 100,
        sortable: false,
      },
    ]);
    setReport1b(tempReport1b);
    setColsReport1b([
      {
        field: "sas_program",
        headerName: "SAS program",
        headerClassName: "header",
        width: 125,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { path } = row;
          return (
            <Tooltip title={"View program"}>
              <Box
                sx={{ color: "blue" }}
                onClick={() => {
                  window.open(fileViewerPrefix + path, "_blank");
                }}
              >
                {value}
              </Box>
            </Tooltip>
          );
        },
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
        headerName: "SAP",
        description: "SAP section",
        headerClassName: "header",
        width: 30,
        sortable: false,
      },
      {
        field: "type",
        headerName: "Type",
        description: "Output type",
        headerClassName: "header",
        width: 65,
        sortable: false,
      },
      {
        field: "output",
        headerName: "Output",
        headerClassName: "header",
        flex: 1,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { datasetpath } = row;
          if (value) {
            if (datasetpath) {
              return (
                <Tooltip title={`Download the output data set: ${value}`}>
                  <Link href={`${webDavPrefix}${datasetpath}`} target="_blank">
                    {value}
                  </Link>
                </Tooltip>
              );
            } else
              return (
                <Tooltip title={row.Title}>
                  <Typography sx={{ fontSize: gridFontSize + 0.3 + "em" }}>
                    {value}
                  </Typography>
                </Tooltip>
              );
          }
        },
      },
      {
        field: "pathtxt",
        headerName: "txt",
        headerClassName: "header",
        sortable: false,
        description: "Was a text file (or image) produced",
        disableColumnMenu: true,
        hideSortIcons: true,
        maxWidth: 20,
        minWidth: 20,
        width: 25,
        renderCell: (cellValues) => {
          // console.log(cellValues);
          const { value } = cellValues;
          // console.log(value);
          if (value) {
            const fileName = value.split("/").pop();
            return (
              <>
                <Tooltip title={`Open ${fileName} as plain text`}>
                  <Link href={`${webDavPrefix}${value}`} target="_blank">
                    Y
                  </Link>
                </Tooltip>
              </>
            );
          } else
            return (
              <Tooltip title={`No text or SVG file available`}>
                <Box>N</Box>
              </Tooltip>
            );
        },
      },
      {
        field: "pathpdf",
        headerName: "pdf",
        headerClassName: "header",
        maxWidth: 22,
        minWidth: 22,
        width: 26,
        description: "Was a PDF file produced",
        disableColumnMenu: true,
        hideSortIcons: true,
        sortable: false,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value) {
            const fileName = value.split("/").pop();
            return (
              <>
                <Tooltip title={`Open ${fileName} on a new tab`}>
                  <Link href={`${webDavPrefix}${value}`} target="_blank">
                    Y
                  </Link>
                </Tooltip>
              </>
            );
          } else
            return (
              <Tooltip title={`No PDF file available`}>
                <Box>N</Box>
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
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { pathlog } = row;
          if (value !== "no log!") {
            return (
              <>
                <Tooltip title={`Open log in Log Viewer`}>
                  <Link href={`${logViewerPrefix}${pathlog}`} target="_blank">
                    {value}
                  </Link>
                </Tooltip>
              </>
            );
          } else return <Box sx={{ backgroundColor: amber }}>{value}</Box>;
        },
      },
      {
        field: "dateLastModifiedlog",
        headerName: "Last modification",
        headerClassName: "header",
        width: 120,
        sortable: false,
      },
      {
        field: "programmer",
        headerName: "Programmer",
        headerClassName: "header",
        width: 90,
        sortable: false,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value > " ")
            return (
              <Tooltip title={"Email programmer"}>
                <Box
                  sx={{ color: "blue" }}
                  onClick={() => {
                    window.open(
                      "mailto:" +
                        value +
                        "@argenx.com?subject=" +
                        info.retext +
                        "&body=" +
                        encodeURIComponent(href),
                      "_blank"
                    );
                  }}
                >
                  {value}
                </Box>
              </Tooltip>
            );
        },
      },
    ]);
    const tempInfo = sourceData.info[0];
    let tempParent = tempInfo.REPATH.split("/");
    tempParent.pop();
    setParent(tempParent.join("/"));
    setInfo(tempInfo);
    // set message for BSOP & SAP
    const { SAPERR1, SAPERR2, BSOPERR1, BSOPERR2 } = tempInfo;
    let tempSapErrMsg = "",
      tempBsopErrMsg = "";
    if (SAPERR1 === "1") tempSapErrMsg += "Too many SAP files. ";
    if (SAPERR2 === "1") tempSapErrMsg += "SAP filename is too simple.";
    if (BSOPERR1 === "1") tempBsopErrMsg += "Too many BSOP files. ";
    if (BSOPERR2 === "1") tempBsopErrMsg += "BSOP file name is too simple.";
    setSapErrMsg(tempSapErrMsg);
    setBsopErrMsg(tempBsopErrMsg);

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
              const json = JSON.parse(modifiedText);
              console.log("SPLISTISS", json);
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
      { field: "__tree_data_group__", width: 250 },
      // {
      //   field: "col1",
      //   headerName: "Log output",
      //   headerClassName: "header",
      //   sortable: false,
      //   renderCell: (cellValues) => {
      //     // console.log(cellValues);
      //     const { value, row } = cellValues,
      //       { path } = row;
      //     if (path) {
      //       return (
      //         <>
      //           <Link href={`${logViewerPrefix}${path}`} target="_blank">
      //             {value}
      //           </Link>
      //         </>
      //       );
      //     } else return null;
      //   },
      // },
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
        renderHeader: (params) => {
          return (
            <Tooltip title={"Click to see the reviews of messages"}>
              <Link
                onClick={() => {
                  setOutputClickedOn(null);
                  setOpenOutputReview(true);
                }}
              >
                OK
              </Link>
            </Tooltip>
          );
        },
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { line, id, output, path } = row;
          if (userJson === null) return null;
          const uj = userJson.filter((r) => r.output === output);
          // console.log("uj", uj, "line", line);
          // if (uj.length > 1) console.log("uj", uj, "line", line);
          if (line > 0) {
            if (value) {
              return (
                <Tooltip title={"Message is acceptable"}>
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
                    <Done sx={{ fontSize: 12 }} />
                  </IconButton>
                </Tooltip>
              );
            } else if (value === false) {
              return (
                <Tooltip title={"Message is not acceptable"}>
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
                    <Close sx={{ fontSize: 12 }} />
                  </IconButton>
                </Tooltip>
              );
            } else
              return (
                <Tooltip title={"Click to review message"}>
                  <IconButton
                    variant="outlined"
                    size="small"
                    color="info"
                    onClick={() => {
                      setRowToCheck(row);
                      setIdClickedOn(id);
                      setOpenUserInput(true);
                    }}
                  >
                    <QuestionMark sx={{ fontSize: 12 }} />
                  </IconButton>
                </Tooltip>
              );
          } else {
            // console.log(uj);
            if (path > " " && uj.length > 0) {
              // console.log("path", path);
              return (
                <Tooltip title={"Display review comments and decisions"}>
                  <IconButton
                    variant="outlined"
                    size="small"
                    sx={{ color: "#99ccff" }}
                    onClick={() => {
                      // setRowToCheck(row);
                      setOutputClickedOn(output);
                      setOpenOutputReview(true);
                    }}
                    label={"?"}
                  >
                    <MenuBookTwoTone sx={{ fontSize: 12 }} />
                  </IconButton>
                </Tooltip>
              );
            } else return null;
          }
        },
      },
    ]);

    // Programs/Outputs Bar Chart
    const categories1 = Object.keys(sourceData.graph1),
      prog1 = sourceData.graph1["Programs"],
      out1 = sourceData.graph1["Outputs"],
      expectedProg =
        prog1.expectedprograms - prog1.issueprograms - prog1.cleanprograms,
      expectedOut =
        out1.expectedoutputs - out1.cleanoutputs - out1.issueoutputs,
      series1 = [
        {
          name: "Completed",
          data: [
            prog1.cleanprograms > 0 ? prog1.cleanprograms : null,
            out1.cleanoutputs > 0 ? out1.cleanoutputs : null,
            // prog1.cleanprograms,
            // out1.cleanoutputs,
          ],
        },
        {
          name: "Expected",
          data: [
            expectedProg > 0 ? expectedProg : null,
            expectedOut > 0 ? expectedOut : null,
            // expectedProg,
            // expectedOut,
          ],
        },
        {
          name: "Issues",
          data: [
            prog1.issueprograms > 0 ? prog1.issueprograms : null,
            out1.issueoutputs > 0 ? out1.issueoutputs : null,
            // prog1.issueprograms,
            // out1.issueoutputs,
          ],
        },
      ];
    const tempGraph = {
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
      colors: ["#ebf3d9", "#d7ecfb", "#ffe0e6"],
      yAxis: {
        min: 0,
        enabled: false,
        labels: { enabled: false },
        title: {
          enabled: false,
        },
        reversed: true,
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
    };
    console.log(tempGraph)
    setGraph1(tempGraph);

    // eslint-disable-next-line
  }, [sourceData]);

  // CRO Oversight graph
  useEffect(() => {
    if (iss) {
      const lev1Values = iss
          .map((item) => item.status)
          .filter((value, index, self) => self.indexOf(value) === index),
        pureLev2Values = iss
          .map((item) => item.type)
          .filter((value, index, self) => self.indexOf(value) === index),
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
        tempStatusSummary = {},
        statusSummary = [],
        tempTypeSummary = {},
        typeSummary = [];

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
          color: prop.includes("Ok")
            ? "#ebf3d9"
            : prop.includes("Updated")
            ? "#d7ecfb"
            : prop.includes("CRO")
            ? "#ffe0e6"
            : prop.includes("Sponsor")
            ? "#ffccff"
            : "gray",
          y: tempStatusSummary[prop],
          dataLabels: {
            enabled: false,
          },
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
        typeSummary.push({
          name: prop,
          color: prop.includes("T")
            ? "#e6ffcc"
            : prop.includes("L")
            ? "#81b946"
            : prop.includes("ADaM")
            ? "#b4d590"
            : "gray",
          y: tempTypeSummary[prop],
          dataLabels: {
            enabled: false,
          },
        });
      }
      // console.log("typeSummary", typeSummary);

      setGraph2({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: 160,
          // width: 500,
        },
        title: {
          text: null,
          // align: "left",
          // verticalAlign: "middle",
          // x: "50%",
          // y: 20,
          style: { fontSize: "6px" },
        },
        tooltip: {
          outside: true,
          style: { fontSize: "6px" },
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            size: "110%",
            innerSize: "50%",
          },
        },
        // colors: colors,
        accessibility: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        series: [
          {
            name: "Status",
            type: "pie",
            center: ["35%", "75%"],
            data: statusSummary,
          },
          {
            name: "Output Type",
            type: "pie",
            center: ["65%", "75%"],
            data: typeSummary,
          },
        ],
      });
    }
  }, [iss]);

  useEffect(() => {
    // console.log("radialRef", radialRef);
    if (radialRef.current) {
      const { container } = radialRef.current;
      if (container.current) {
        container.current.style.scale = 2;
        container.current.style.top = "50%";
        // radialRef.setAttribute("viewBox", "0 0 550 60");
        // container.current.children[0].viewBox = "0 0 391 60";
        // container.current.children[0].children[0].viewBox = "0 0 391 60";
        // container.current.style.position = "relative";
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
      // console.log("tempUserJson", tempUserJson);
      setUserJson(tempUserJson);
    }
  }, [userJson]);

  // there is new user JSON data, so we can process it and integrate that into what is shown on screen
  useEffect(() => {
    if (userJson && sourceData && outputLogReport) {
      const tempOutputLogReport = [...outputLogReport];
      userJson.forEach((item) => {
        const row = tempOutputLogReport[item.id];
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
        "INFO:\tlogsWithIssues",
        logsWithIssues,
        "\nINFO:\tallOutputs",
        allOutputs,
        "\nINFO:\toutputsWithIssues",
        outputsWithIssues,
        "\nINFO:\toutputsWithoutIssues",
        outputsWithoutIssues,
        "\nINFO:\tuserJson",
        userJson
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
      const newSeries = [
          {
            name: "Completed",
            color: "#ebf3d9",
            data: [cleanprograms, cleanoutputs],
          },
          {
            name: "Issues",
            color: "#d7ecfb",
            data: [issueprograms, issueoutputs],
          },
          {
            name: "Expected",
            color: "#ffe0e6",
            data: [
              expectedprograms - issueprograms - cleanprograms,
              expectedoutputs - cleanoutputs - issueoutputs,
            ],
          },
        ],
        newGraph1 = { ...graph1, series: newSeries };
      setGraph1(newGraph1);
    }
    // eslint-disable-next-line
  }, [userJson]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {info && info.retext && (
            <Box sx={{ display: "flex" }}>
              {studyList && (
                <Box sx={{ ml: 1, zIndex: 10, flexGrow: 1 }}>
                  <Tooltip title={"View the root directory with File Viewer"}>
                    <Box
                      sx={{
                        color: "blue",
                        fontSize: gridFontSize + 0.2 + "em",
                      }}
                      onClick={() =>
                        window.open(fileViewerPrefix + info.REPATH, "_blank")
                      }
                    >
                      {info.retext}
                    </Box>
                  </Tooltip>
                </Box>
              )}
              {studyList && (
                <Box sx={{ zIndex: 10, flexGrow: 1 }}>
                  <Tooltip
                    title={
                      "Choose another study (generic adam studies are not shown)"
                    }
                  >
                    <Box
                      sx={{
                        color: "blue",
                        fontSize: gridFontSize + 0.2 + "em",
                      }}
                      onClick={handlePopClick}
                    >
                      {"Status report created on " +
                        info.statusReportCreateDate +
                        " at " +
                        info.statusReportCreateTime}
                    </Box>
                  </Tooltip>
                </Box>
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
            </Box>
          )}

          {/* {graph2 && info.EVENTTYPE === "crooversight" && (
            <Box sx={{ mt: 1 }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={graph2}
                ref={radialRef}
              />
            </Box>
          )} */}

          {graph2 && info.EVENTTYPE === "crooversight" && (
            <Box sx={{ ml: 5 }} id="d3ref">
              <Donut iss={iss} ref={d3ref} parentInfo={info} />
            </Box>
          )}

          {graph1 && (
            <Box sx={{ height: 130 }}>
              <HighchartsReact highcharts={Highcharts} options={graph1} />
            </Box>
          )}

          {cro && cro.length > 0 && (
            <TableContainer sx={{ ml: 1 }} component={Paper}>
              <Table
                sx={{ minWidth: 400 }}
                size="small"
                aria-label="a dense table"
                padding="none"
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f6f5ea" }}>
                    <TableCell sx={{ fontSize: gridFontSize + "em" }}>
                      Document&nbsp;&nbsp;
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: gridFontSize + "em" }}
                      align="left"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: gridFontSize + "em" }}
                      align="right"
                    >
                      Last Modified
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cro.map((row, id) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: gridFontSize + "em",
                          width: 40,
                          backgroundColor:
                            row.name === "<missing>"
                              ? "#ffe0e6"
                              : row.doc === "BSOP" && info.BSOPERR1 === "1"
                              ? "red"
                              : row.doc === "SAP" && info.SAPERR1 === "1"
                              ? "red"
                              : row.doc === "BSOP" && info.BSOPERR2 === "1"
                              ? amber
                              : row.doc === "SAP" && info.SAPERR2 === "1"
                              ? amber
                              : "#ffffff",
                        }}
                      >
                        <Box sx={{ width: "50px" }}>
                          {(row.doc === "SAP" &&
                            (info.SAPERR1 === "1" || info.SAPERR2 === "1")) ||
                          (row.doc === "BSOP" &&
                            (info.BSOPERR1 === "1" ||
                              info.BSOPERR2 === "1")) ? (
                            <IconButton
                              variant="outlined"
                              size="small"
                              sx={{ color: "#99ccff" }}
                              onClick={() => {
                                if (row.name === "<missing>") return;
                                const path = row.path.split("/");
                                path.pop();
                                window.open(
                                  fileViewerPrefix + path.join("/"),
                                  "_blank"
                                );
                              }}
                              label={"?"}
                            >
                              <Info fontSize="small" />
                            </IconButton>
                          ) : null}
                          <Tooltip
                            title={
                              row.doc === "SAP"
                                ? sapErrMsg
                                : row.doc === "BSOP"
                                ? bsopErrMsg
                                : ""
                            }
                          >
                            <Box> {row.doc}</Box>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ color: "blue", fontSize: gridFontSize + "em" }}
                      >
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
                          <Box
                            onClick={() => {
                              if (row.name === "<missing>") return;
                              const fileName = row.path.split("/").pop(),
                                fileType = fileName.split(".")[1];
                              if (fileType === "xlsx")
                                window.open(
                                  fileViewerPrefix + row.path,
                                  "_blank"
                                );
                              else
                                window.open(webDavPrefix + row.path, "_blank");
                            }}
                          >
                            {row.name === "<missing>" ? row.doc : row.name}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: gridFontSize + "em", width: 50 }}
                      >
                        {row.dateLastModified}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {report1a && (
            <DataGridPro
              rows={report1a}
              columns={colsReport1a}
              disableColumnMenu
              canUserSort={false}
              density="compact"
              rowHeight={rowHeight}
              autoHeight
              hideFooter={true}
              defaultGroupingExpansionDepth={-1}
              sx={{
                mt: 1,
                ml: 1,
                padding: 0.1,
                fontWeight: "fontSize=5",
                fontFamily: "system-ui;",
                fontSize: gridFontSize + "em",
                "& .note": {
                  backgroundColor: "#e6f7ff",
                  color: "#0000ff",
                },
                "& .amber": {
                  backgroundColor: amber,
                  color: "#000000",
                },
                "& .red": {
                  backgroundColor: "#ffe0e6",
                  color: "#0000ff",
                },
                "& .header": {
                  backgroundColor: "#f6f5ea",
                  padding: 1,
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
                } else if (params.field === "headerFails" && params.value > 0) {
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
                ml: 1,
                fontSize: gridFontSize + "em",
                fontFamily: "system-ui;",
                mt: 1,
                [`& .${gridClasses.cell}`]: {
                  py: 1,
                },
                "& .note": {
                  backgroundColor: "#e6f7ff",
                  color: "#0000ff",
                },
                "& .amber": {
                  backgroundColor: amber,
                  color: "#0000ff",
                },
                "& .red": {
                  backgroundColor: "#ffe6e6",
                  color: "#0000ff",
                },
                "& .header": {
                  backgroundColor: "#f6f5ea",
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
                } else if (params.field === "headerFails" && params.value > 0) {
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

          {outputLogReport && outputLogReport.length > 0 && (
            <Box
              sx={{
                "& .warn": {
                  backgroundColor: "#fff0b3",
                  color: "#000000",
                },
                "& .red": {
                  backgroundColor: "#ffe0e6",
                  color: "#000000",
                },
              }}
            >
              <DataGridPro
                treeData
                defaultGroupingExpansionDepth={-1}
                getTreeDataPath={(row) => row.col1}
                rows={outputLogReport}
                columns={colsOutputLogReport}
                groupingColDef={{
                  headerName: "Log output",
                  renderCell: (cellValues) => {
                    // console.log(cellValues);
                    const { value, row } = cellValues,
                      { path } = row;
                    if (path) {
                      return (
                        <>
                          <Link
                            href={`${logViewerPrefix}${path}`}
                            target="_blank"
                          >
                            {value}
                          </Link>
                        </>
                      );
                    } else return null;
                  },
                }}
                getCellClassName={(params) => {
                  // console.log(params);
                  if (
                    params.field === "col2" &&
                    params.value.startsWith("WARNING")
                  ) {
                    return "warn";
                  } else if (
                    params.field === "col2" &&
                    params.value.startsWith("ERROR")
                  ) {
                    return "red";
                  } else return "";
                }}
                disableColumnMenu
                density="compact"
                rowHeight={rowHeight}
                autoHeight
                hideFooter={true}
                apiRef={apiRef}
                sx={{
                  ml: 1,
                  mt: 1,
                  fontSize: gridFontSize + "em",
                  fontFamily: "system-ui;",
                  "& .header": {
                    backgroundColor: "#f6f5ea",
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#f6f5ea",
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
            </Box>
          )}
        </Grid>

        <Grid item xs={6}>
          {info && info.splisturl && (
            <Tooltip
              title={
                info.splistmessage.split("]").length > 1
                  ? "View the " +
                    info.splistmessage
                      .split("]")[1]
                      .slice(0, -1)
                      .replace("}", "")
                  : info.splistmessage
              }
            >
              <Button
                size="small"
                variant="outlined"
                sx={{ color: "blue", fontSize: gridFontSize + "em" }}
                onClick={() => {
                  if (info.splistmessage.split("]").length > 1)
                    window.open(info.splisturl, "_blank");
                  else alert(info.splistmessage);
                }}
                fullWidth
              >
                {info.splistmessage.split("]").length > 1
                  ? info.splistmessage.split("]")[1].slice(0, -1)
                  : info.splistmessage}
              </Button>
            </Tooltip>
          )}

          {info && "generic_adam_exists" in info && (
            <Tooltip
              title={
                info.generic_adam_exists === "1"
                  ? "Directory was found at: " + parent + "/generic_adam"
                  : "Directory was not found at: " + parent + "/generic_adam"
              }
            >
              <Chip
                label={
                  info.generic_adam_exists === "1"
                    ? "Generic Adam exists"
                    : "Generic Adam missing"
                }
                icon={info.generic_adam_exists === "1" ? <Done /> : <Close />}
                color={info.generic_adam_exists === "1" ? "success" : "error"}
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Tooltip>
          )}
          {info && "generic_adam_meta_exists" in info && (
            <Tooltip
              title={
                info.generic_adam_meta_exists === "1"
                  ? "Directory was found at: " +
                    parent +
                    "/generic_adam/documents/meta"
                  : "Directory was not found at: " +
                    parent +
                    "/generic_adam/documents/meta"
              }
            >
              <Chip
                label={
                  info.generic_adam_meta_exists === "1"
                    ? "Content exists"
                    : "Content missing"
                }
                icon={
                  info.generic_adam_meta_exists === "1" ? <Done /> : <Close />
                }
                color={
                  info.generic_adam_meta_exists === "1" ? "success" : "error"
                }
                size="small"
                variant="outlined"
                sx={{ mt: 1, ml: 1 }}
              />
            </Tooltip>
          )}
          {info && info.generic_adam_lastModified > " " ? (
            <Tooltip
              title={
                "Last modified date for directory: " +
                parent +
                "/generic_adam/documents/meta"
              }
            >
              <Chip
                label={info.generic_adam_lastModified}
                color={"info"}
                size="small"
                variant="outlined"
                sx={{ mt: 1, ml: 1 }}
              />
            </Tooltip>
          ) : null}

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
                rowHeight={rowHeight}
                autoHeight
                hideFooter={true}
                sx={{
                  mt: 1,
                  fontSize: gridFontSize + 0.05 + "em",
                  fontFamily: "system-ui;",
                  "& .note": {
                    backgroundColor: "#e6f7ff",
                    color: "#0000ff",
                  },
                  "& .amber": {
                    backgroundColor: amber,
                    color: "#0000ff",
                  },
                  "& .red": {
                    backgroundColor: "#ffe6e6",
                    color: "#0000ff",
                  },
                  "& .header": {
                    backgroundColor: "#f6f5ea",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeaderTitleContainer": {
                    lineHeight: 1,
                    whiteSpace: "normal",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    padding: "0 0 0 2pt",
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
        </Grid>
      </Grid>
      {openUserInput && (
        <UserInput
          open={openUserInput}
          setOpen={setOpenUserInput}
          userJson={userJson}
          userJsonFile={userJsonFile}
          rowToCheck={rowToCheck}
          setUserJson={setUserJson}
          idClickedOn={idClickedOn}
          access={sourceData && sourceData.access ? sourceData.access : null}
        />
      )}
      {openOutputReview && (
        <OutputReview
          open={openOutputReview}
          setOpen={setOpenOutputReview}
          userJson={userJson}
          userJsonFile={userJsonFile}
          outputClickedOn={outputClickedOn}
        />
      )}
    </Box>
  );
};

export default App;
