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
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  QuestionMark,
  AccountCircle,
  Done,
  Close,
  MenuBookTwoTone,
  Info,
  OpenInNew,
  Google,
  Apps,
  ForwardTwoTone,
  ArrowDropDown,
  Splitscreen,
  ArticleTwoTone,
  FolderCopyTwoTone,
} from "@mui/icons-material";
import UserInput from "./UserInput";
import MultipleUserInput from "./MultipleUserInput";
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
    "369a1eb75b405178b0ae6c2b51263cacTz03MTMzMCxFPTE3MjE3NDE5NDcwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI="
  );
  // Sunburst(Highcharts);
  // Treemap(Highcharts);
  More(Highcharts);
  const radialRef = createRef(),
    { href, protocol, host } = window.location,
    mode = href.startsWith("http://localhost") ? "local" : "remote",
    urlPrefix = protocol + "//" + host,
    apiRef = useGridApiRef(),
    saveUser = () => {
      localStorage.setItem("username", tempUsername);
      localStorage.setItem("userFullName", userFullName);
      setOpenUserLogin(false);
    },
    [panelWidth, setPanelWidth] = useState(6),
    toggleSplitscreen = () => {
      if (panelWidth === 6) setPanelWidth(12);
      else setPanelWidth(6);
    },
    [tempUsername, setTempUsername] = useState(""),
    [openSnackbar, setOpenSnackbar] = useState(false),
    handleCloseSnackbar = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpenSnackbar(false);
    },
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
    [sapErrMsg, setSapErrMsg] = useState(""),
    [bsopErrMsg, setBsopErrMsg] = useState(""),
    [openUserInput, setOpenUserInput] = useState(false),
    [openUserMultipleInput, setOpenUserMultipleInput] = useState(false),
    [openInfo, setOpenInfo] = useState(false),
    [compareInfo, setCompareInfo] = useState(null),
    [openUserLogin, setOpenUserLogin] = useState(false),
    [reviewSection, setReviewSection] = useState(null),
    [listLastModified, setListLastModified] = useState(null),
    [timeSinceRefresh, setTimeSinceRefresh] = useState(null),
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
    webDavPrefix = urlPrefix + "/lsaf/webdav/repo",
    logViewerPrefix =
      webDavPrefix + "/general/biostat/apps/logviewer/index.html?log=",
    fileViewerPrefix =
      webDavPrefix + "/general/biostat/apps/fileviewer/index.html?file=",
    [report1a, setReport1a] = useState(null),
    [colsReport1a, setColsReport1a] = useState(null),
    [report1b, setReport1b] = useState(null),
    [colsReport1b, setColsReport1b] = useState(null),
    [report2, setReport2] = useState(null),
    [gotLot, setGotLot] = useState(false),
    [report2lot, setReport2lot] = useState(null),
    [report2noLot, setReport2noLot] = useState(null),
    [colsReport2, setColsReport2] = useState(null),
    [colsReport2noLot, setColsReport2noLot] = useState(null),
    [outputLogReport, setOutputLogReport] = useState(null),
    [colsOutputLogReport, setColsOutputLogReport] = useState(null),
    [colsReviewSection, setColsReviewSection] = useState(null),
    [colsCompare, setColsCompare] = useState(null),
    [info, setInfo] = useState(null),
    [parent, setParent] = useState(null),
    [cro, setCro] = useState(null),
    [rowToCheck, setRowToCheck] = useState(null),
    [barChart, setBarChart] = useState(null),
    [donutChart, setDonutChart] = useState(null),
    loadFiles = (url) => {
      fetch(url).then(function (response) {
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
          .catch((err) =>
            console.error("fetch failed for " + url + " - " + err)
          );
      });
    },
    [sourceData, setSourceData] = useState(null),
    [userJson, setUserJson] = useState(null), // holds info that a user has entered using the UserInput component to a JSON file
    [userJsonFile, setUserJsonFile] = useState(null), // filename of the JSON file for user.json where we store user comments to override data in dashboard
    // popover support
    [popAnchorEl, setPopAnchorEl] = useState(null),
    [popAnchorEl2, setPopAnchorEl2] = useState(null),
    handlePopClick = (event) => {
      setPopAnchorEl(event.currentTarget);
    },
    handlePopClose = () => {
      setPopAnchorEl(null);
    },
    handlePopClick2 = (event) => {
      setPopAnchorEl2(event.currentTarget);
    },
    handlePopClose2 = () => {
      setPopAnchorEl2(null);
    },
    popOpen = Boolean(popAnchorEl),
    popOpen2 = Boolean(popAnchorEl2),
    popId = popOpen ? "simple-popover" : undefined,
    popId2 = popOpen2 ? "simple-popover" : undefined,
    [studyList, setStudyList] = useState(null),
    [selectedStudy, setSelectedStudy] = useState(null),
    [idClickedOn, setIdClickedOn] = useState(null),
    selectStudy = (e) => {
      setSelectedStudy(e.value);
      const newUrl = href.split("?")[0] + "?file=" + e.value;
      document.title = e.label.split("/")[2];
      window.history.pushState({}, "Title", newUrl);
      handlePopClose();
      handlePopClose2();
    },
    studyListFile =
      "/general/biostat/jobs/dashboard/dev/metadata/dash-study-files.json",
    [iss, setIss] = useState(null),
    chooseStuff = (e, id, row) => {
      console.log("chooseStuff> e", e);
      console.log("chooseStuff> id", id);
      console.log("chooseStuff> row", row);
      row.ok = e;
    },
    [showSaveButton, setShowSaveButton] = useState(false),
    [userFullName, setUserFullName] = useState(
      localStorage.getItem("userFullName")
    ),
    [showAdamQc, setShowAdamQc] = useState(false),
    showGadamDirExists = true; // set to true to show gadam directory exists indicator

  useEffect(() => {
    // console.log("window", window);
    if (sourceData === null) return;
    const matchingUsers = sourceData.access.filter(
      (r) => r.userid === tempUsername
    );
    if (matchingUsers.length > 0) {
      setShowSaveButton(true);
      setUserFullName(matchingUsers[0].Name);
    } else {
      setShowSaveButton(false);
      setUserFullName("");
    }
    // eslint-disable-next-line
  }, [tempUsername]);

  useEffect(() => {
    if (report2 === null) return;
    if (report2.length === 0) return;
    if ("in_lot" in report2[0]) {
      setGotLot(true);
      setReport2noLot(report2.filter((r) => r.in_lot === 0));
      setReport2lot(report2.filter((r) => r.in_lot === 1));
    } else setGotLot(false);
  }, [report2]);

  let username = localStorage.getItem("username");

  useEffect(() => {
    if (username === null) {
      setTempUsername("");
      setOpenUserLogin(true);
    } else {
      setTempUsername(username);
      setOpenUserLogin(false);
      setOpenSnackbar(true);
    }
  }, [username]);

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
                .replace("/documents/meta/dashstudy.json", ""),
              split = shorter.split("/");
            return {
              value: r.path,
              label:
                shorter +
                " ... [" +
                r.dateLastModified +
                "] ... (" +
                r.formattedsize +
                ")",
              study: split[2],
            };
          })
          .filter((val) => {
            const parts = val.value.split("/");
            if (parts.length > 7) return parts[7] !== "generic_adam";
            else return true;
          });
      setStudyList(tempStudyList);
      return;
    }
    // handle remote
    fetch(webDavPrefix + studyListFile).then(function (response) {
      response.text().then(function (text) {
        const json = JSON.parse(text);
        const lsafsearch = json["SASTableData+LSAFSEARCH"],
          tempStudyList = lsafsearch
            .map((r) => {
              const shorter = r.path
                  .replace("/clinical/", "")
                  .replace("/biostat/staging", "")
                  .replace("/documents/meta/dashstudy.json", ""),
                split = shorter.split("/");
              return {
                value: r.path,
                label:
                  shorter +
                  " ... [" +
                  r.dateLastModified +
                  "] ... (" +
                  r.formattedsize +
                  ")",
                study: split[2],
              };
            })
            .filter((val) => {
              const parts = val.value.split("/");
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
      if (href.split("?").length > 1) {
        const file1 = href.split("?")[1].split("=")[1];
        loadFiles(webDavPrefix + file1);
      }
    } else setSourceData(all);
    // eslint-disable-next-line
  }, [href]);

  // do this when sourceData changes
  useEffect(() => {
    if (sourceData === null) return;
    console.log("------->\tsourceData", sourceData);
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
                  sx={{
                    color: "blue",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
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
        field: "version",
        headerName: "Ver",
        headerClassName: "header",
        description: "Program version",
        width: 25,
        sortable: false,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { isVersioned } = row;
          if (isVersioned === 0) {
            return (
              <Tooltip title={"Program is not versioned"}>
                <Box>✖</Box>
              </Tooltip>
            );
          } else {
            return (
              <Tooltip title={"Version of program"}>
                <Box>{value}</Box>
              </Tooltip>
            );
          }
        },
      },
      {
        field: "sasprog_exist",
        headerName: "Exists",
        description: "Program file exists",
        headerClassName: "header",
        width: 25,
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
          if (value !== "no job" && info !== null) {
            return (
              <Tooltip title={"View job XML"}>
                <Box
                  sx={{
                    color: "blue",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
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
            { jobname, logcheck } = row,
            log = jobname.split(".")[0] + ".log";
          let backgroundColor = "#ffffff";
          if (logcheck !== "no log!" && logcheck !== "clean")
            backgroundColor = "#ffe0e6";
          if (value !== "no log!" && info !== null) {
            return (
              <Tooltip title={"View log"}>
                <Box
                  sx={{
                    backgroundColor: backgroundColor,
                    color: "blue",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
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
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { headerFails } = row;
          // console.log(cellValues);
          if (Number(headerFails) > 0) {
            return <Box sx={{ backgroundColor: "#ffe0e6" }}>{value}</Box>;
          } else {
            return <Box>{value}</Box>;
          }
        },
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
                sx={{
                  color: "blue",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
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
    let tempColsReport2 = [
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
        field: "compare_match",
        headerName: "cm",
        headerClassName: "header",
        sortable: false,
        description: "Compare info available",
        disableColumnMenu: true,
        hideSortIcons: true,
        maxWidth: 20,
        minWidth: 20,
        width: 20,
        renderCell: (cellValues) => {
          const { value, row } = cellValues,
            { compare_label2, gadam_compare_path, pathlst } = row;
          if (value) {
            // replace /output/ with /output/compare/ in text for TLF compare
            const filePath = pathlst.replace(
              "/output/",
              "/output/compare/compare_"
            );
            let flag = "D";
            if (compare_label2 === "OK : Match") flag = "M";
            return (
              <Tooltip title={`Compare status is "${compare_label2}"`}>
                <Link href={`${fileViewerPrefix}${filePath}`} target="_blank">
                  {flag}
                </Link>
              </Tooltip>
            );
          } else {
            let flag = "";
            if (gadam_compare_path > " ") flag = "G";
            return (
              <Tooltip title={`Compare status is "${compare_label2}"`}>
                <Link
                  href={`${fileViewerPrefix}${gadam_compare_path}`}
                  target="_blank"
                >
                  {flag}
                </Link>
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
          const { value, row } = cellValues,
            { pathsvg } = row,
            pathToUse = pathsvg ? pathsvg : value;
          if (pathToUse) {
            const fileName = pathToUse.split("/").pop();
            return (
              <>
                <Tooltip title={`Open ${fileName} as plain text`}>
                  <Link href={`${webDavPrefix}${pathToUse}`} target="_blank">
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
                  sx={{
                    color: "blue",
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    window.open(
                      "mailto:" +
                        value +
                        "@argenx.com?subject=" +
                        info.retext +
                        " (" +
                        info.statusReportCreateDate +
                        "," +
                        info.statusReportCreateTime +
                        ")&body=" +
                        encodeURIComponent(href) +
                        "?file=" +
                        info.REPATH +
                        "/documents/meta/dashstudy.json",
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
      {
        field: "qcstatus",
        headerName: "QC Status",
        headerClassName: "header",
        sortable: false,
        description: "QC status from SharePoint list",
        disableColumnMenu: true,
        hideSortIcons: true,
        width: 90,
      },
    ];
    // work out if we need to remove the qc status column, if all the values are blank
    const allBlank = tempReport2.every((r) => r["qcstatus"] === "");
    if (allBlank) {
      tempColsReport2 = tempColsReport2.filter(
        (item) => item["field"] !== "qcstatus"
      );
    }
    // remove the compare column if we dont have anything in the compare array
    if (
      sourceData.report2 &&
      sourceData.report2.length > 0 &&
      (!("compare" in sourceData) ||
        (sourceData.compare && sourceData.compare.length === 0)) &&
      !("gadam_compare_path" in sourceData.report2[0])
    ) {
      tempColsReport2 = tempColsReport2.filter(
        (item) => item["field"] !== "compare_match"
      );
    }
    setColsReport2(tempColsReport2);
    tempColsReport2 = tempColsReport2.filter(
      (item) =>
        ![
          "section",
          "compare_match",
          "logcheck",
          "programmer",
          "qcstatus",
        ].includes(item["field"])
    );
    setColsReport2noLot(tempColsReport2);
    // define the columns from sourceData.compare[0]
    setColsCompare([
      {
        field: "label1",
        headerName: "Output",
        headerClassName: "header",
        width: 400,
      },
      {
        field: "label2",
        headerName: "Status",
        headerClassName: "header",
        width: 200,
      },
      {
        field: "comobs",
        headerName: "comobs",
        headerClassName: "header",
      },
      {
        field: "n1obs",
        headerName: "Obs in 1",
        headerClassName: "header",
      },
      {
        field: "n2obs",
        headerName: "Obs in 2",
        headerClassName: "header",
      },
      {
        field: "obsdiff",
        headerName: "obsdiff",
        headerClassName: "header",
      },
      {
        field: "vardiff",
        headerName: "vardiff",
        headerClassName: "header",
      },
      {
        field: "diff",
        headerName: "diff",
        headerClassName: "header",
      },
      {
        field: "vars1",
        headerName: "Vars in 1",
        headerClassName: "header",
      },
      {
        field: "vars2",
        headerName: "Vars in 2",
        headerClassName: "header",
      },
    ]);

    const tempInfo = sourceData.info[0];
    setInfo(tempInfo);
    let tempParent = tempInfo.REPATH.split("/");
    tempParent.pop();
    setParent(tempParent.join("/"));
    // set message for BSOP & SAP
    const { SAPERR1, SAPERR2, BSOPERR1, BSOPERR2 } = tempInfo;
    let tempSapErrMsg = "",
      tempBsopErrMsg = "";
    if (SAPERR1 === "1") tempSapErrMsg += "Too many SAP files. ";
    if (SAPERR1 === "-1") tempSapErrMsg += "Missing SAP file. ";
    if (SAPERR2 === "1") tempSapErrMsg += "SAP filename is too simple.";
    if (BSOPERR1 === "1") tempBsopErrMsg += "Too many BSOP files. ";
    if (BSOPERR1 === "-1") tempBsopErrMsg += "Missing BSOP file. ";
    if (BSOPERR2 === "1") tempBsopErrMsg += "BSOP file name is too simple.";
    setSapErrMsg(tempSapErrMsg);
    setBsopErrMsg(tempBsopErrMsg);

    // if we have listLastRefreshed then set the info we want to display based on it
    if (tempInfo.listLastRefreshed) {
      const listLastRefreshed = Number(tempInfo.listLastRefreshed),
        listLastRefreshedDate = new Date(listLastRefreshed);
      setListLastModified(
        "SharePoint list last modification time: " +
          listLastRefreshedDate.toUTCString()
      );
      let rest = Math.floor((Date.now() - listLastRefreshed) / 1000);
      const s = rest % 60;
      rest = Math.floor(rest / 60);
      const m = rest % 60;
      rest = Math.floor(rest / 60);
      const h = rest % 24,
        d = Math.floor(rest / 24);
      setTimeSinceRefresh(
        "Time since last refresh SharePoint list content: " +
          d +
          " days, " +
          h +
          " hours, " +
          m +
          " minutes, " +
          s +
          " seconds"
      );
    } else {
      setListLastModified(null);
      setTimeSinceRefresh(null);
    }

    // get iss info if there is a splist on lsaf
    if (mode === "local") setIss(localiss);
    else {
      if (tempInfo.SPLISTONLSAF === "yes" && tempInfo.SPLISTISS) {
        fetch(webDavPrefix + tempInfo.SPLISTISS)
          .then(function (response) {
            if (!response.ok) {
              console.log("Fetch of SPLISTISS failed:", response);
            } else {
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
            }
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

    const title0 = sourceData.info[0].study.replace("argx-", ""),
      title1 = "|" + sourceData.info[0].INDICATION,
      title2a = "|" + sourceData.info[0].REPATH.split("/").at(-2),
      title2b = "|" + sourceData.info[0].REPATH.split("/").pop(),
      title2 =
        title1 !== title2a && title2a !== "staging"
          ? title2a + title2b
          : title2b,
      title = title0 + title1 + title2;
    document.title = title;
    setCro(sourceData.croosdocs);
    let lastLog;
    const tempOutputLogReport2 = tempOutputLogReport
      .map((row) => {
        if (row.path) {
          lastLog = row.col1;
          row.col1 = [row.col1];
          return row;
        } else {
          row.col1 = [lastLog, row.col1];
          return row;
        }
      })
      .filter((row) => row.jsonfile !== "log_.json" && row.output !== ".log");
    setOutputLogReport(tempOutputLogReport2);
    setColsOutputLogReport([
      { field: "__tree_data_group__", width: 250 },
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
          let uj = [];
          if (
            userJson !== null &&
            Object.prototype.toString.call(userJson) === "[object Array]" &&
            userJson.length > 0
          ) {
            uj = userJson.filter((r) => r.output === output);
          }
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
          } else if (line <= 0) {
            return (
              <Tooltip title={"Review multiple lines"}>
                <IconButton
                  size="small"
                  sx={{ fontSize: 10 }}
                  variant="contained"
                  color="success"
                  onClick={() => {
                    console.log(
                      "sourceData",
                      sourceData,
                      "outputLogReport",
                      outputLogReport,
                      "cellValues",
                      cellValues,
                      "output",
                      output
                    );

                    const tempOutputLogReport = sourceData.outputlogreport.map(
                        (r, rid) => {
                          return { id: rid, ...r };
                        }
                      ),
                      tempReviewSection = tempOutputLogReport
                        .filter((r) => {
                          return r.output === output && r.issuenr > 0;
                        })
                        .map((r) => {
                          return { id: r.id, ok: "-1", ...r };
                        });
                    // fix values of ok based on userJson
                    if (userJson !== null && userJson.length > 0) {
                      tempReviewSection.forEach((r) => {
                        const uj = userJson.filter(
                          (uj) =>
                            uj.output === output && uj.issuenr === r.issuenr
                        );
                        if (uj.length > 0) {
                          r.ok =
                            uj[0].ok === "-1" ? "-1" : uj[0].ok ? "1" : "0";
                        }
                      });
                    }

                    setReviewSection(tempReviewSection);
                    setRowToCheck(row);
                    setIdClickedOn(id);
                    setOpenUserMultipleInput(true);
                  }}
                >
                  👀
                </IconButton>
              </Tooltip>
            );
          } else {
            if (path > " " && uj && uj.length > 0) {
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
    setColsReviewSection([
      {
        field: "col2",
        headerName: "Messages",
        headerClassName: "header",
        width: 300,
        sortable: false,
        flex: 1,
        renderCell: (cellValues) => {
          const { value } = cellValues;
          if (value.startsWith("ERROR:")) {
            return <Box sx={{ backgroundColor: "lightpink" }}> {value}</Box>;
          } else if (value.startsWith("WARNING:")) {
            return <Box sx={{ backgroundColor: "lemonchiffon" }}> {value}</Box>;
          } else return <Box>{value}</Box>;
        },
      },
      {
        field: "ok",
        headerName: "Evaluation",
        width: 200,
        renderCell: (cellValues) => {
          const { row } = cellValues,
            { id, ok } = row;
          return (
            <FormControl>
              <RadioGroup value={ok} row name={"id" + id}>
                <FormControlLabel
                  value={"0"}
                  control={<Radio size="small" color="error" />}
                  // onChange={chooseStuff2}
                  onChange={(e) => {
                    chooseStuff(e.target.value, id, row);
                  }}
                />
                <FormControlLabel
                  value={"-1"}
                  control={<Radio size="small" color="info" />}
                  onChange={(e) => {
                    chooseStuff(e.target.value, id, row);
                  }}
                />
                <FormControlLabel
                  value={"1"}
                  control={<Radio size="small" color="success" />}
                  onChange={(e) => {
                    chooseStuff(e.target.value, id, row);
                  }}
                />
              </RadioGroup>
            </FormControl>
          );
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
          color: "#ebf3d9", // green
          data: [
            prog1.cleanprograms > 0 ? prog1.cleanprograms : null,
            out1.cleanoutputs > 0 ? out1.cleanoutputs : null,
            // prog1.cleanprograms,
            // out1.cleanoutputs,
          ],
        },
        {
          name: "Expected",
          color: "#d7ecfb", // blue
          data: [
            expectedProg > 0 ? expectedProg : null,
            expectedOut > 0 ? expectedOut : null,
            // expectedProg,
            // expectedOut,
          ],
        },
        {
          name: "Issues",
          color: "#ffe0e6", // red
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
      // colors: ["#ebf3d9", "#ffe0e6", "#d7ecfb"],
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
    console.log("tempGraph (barChart)", tempGraph);
    setBarChart(tempGraph);

    // check if path has qc_adam/documents in it, in which case we set a flag to show the ADaM QC section
    setShowAdamQc(tempInfo.REPATH.includes("/qc_adam"));
    // eslint-disable-next-line
  }, [sourceData]);

  // CRO Oversight graph
  useEffect(() => {
    console.log("CRO Oversight graph");
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
            ? "#ebf3d9" // green
            : prop.includes("Updated")
            ? "#d7ecfb" // blue
            : prop.includes("CRO")
            ? "#ffe0e6" // red
            : prop.includes("Sponsor")
            ? "#ffccff"
            : "gray",
          y: tempStatusSummary[prop],
          dataLabels: {
            enabled: false,
          },
        });
      }

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

      setDonutChart({
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
    if (radialRef.current) {
      const { container } = radialRef.current;
      if (container.current) {
        container.current.style.scale = 2;
        container.current.style.top = "50%";
      }
    }
    // eslint-disable-next-line
  }, [donutChart]);

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
      setUserJson(tempUserJson);
    }
  }, [userJson]);

  // there is new user JSON data, so we can process it and integrate that into what is shown on screen
  useEffect(() => {
    console.log("userJson changed");
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
          if (lastOutput !== "" && currentIssuesInLog > 0) {
            // does previous section have issues
            logsWithIssues++; // count the logs with issues
            outputsWithIssues.push(lastOutput);
          }
          currentIssuesInLog = 0; // reset number of issues for the current log
        }
        if (row.issuenr > 0 && !row.ok) currentIssuesInLog++; // add one to the issues
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
      const { report1, report2 } = sourceData;
      let cleanprograms = 0,
        expectedprograms = 0,
        issueprograms = 0;
      report1.forEach((program) => {
        expectedprograms++;
        if (program.logcheck !== "clean" && program.logcheck !== "no log!")
          issueprograms++; // log check
        else if (
          program.headerfailmess !== "All pass" &&
          program.headerfailmess !== ""
        )
          issueprograms++; // header check
        else if (program.logcheck === "clean") {
          cleanprograms++; // no problems in log or header, so clean
        }
      });

      let cleanoutputs = 0,
        expectedoutputs = 0,
        issueoutputs = 0;
      report2.forEach((output) => {
        const logName = output.pathlog
          ? output.pathlog.split("/").pop()
          : output.datasetlogpath.split("/").pop();
        if (output.in_lot) expectedoutputs++;
        if (
          output.logcheck === "clean" ||
          outputsWithoutIssues.includes(logName)
        ) {
          if (output.in_lot) cleanoutputs++;
        } else if (output.logcheck !== "no log!") {
          if (output.in_lot) issueoutputs++;
        }
      });
      const newSeries = [
          {
            name: "Completed",
            color: "#ebf3d9", // green
            data: [cleanprograms, cleanoutputs],
          },
          {
            name: "Issues",
            color: "#ffe0e6", // red
            data: [issueprograms, issueoutputs],
          },
          {
            name: "Expected",
            color: "#d7ecfb", // blue
            data: [
              expectedprograms - issueprograms - cleanprograms,
              expectedoutputs - cleanoutputs - issueoutputs,
            ],
          },
        ],
        newBarChart = { ...barChart, series: newSeries };
      console.log("newBarChart", newBarChart);
      setBarChart(newBarChart);
    }
    // eslint-disable-next-line
  }, [userJson]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={panelWidth}>
          {info && info.retext && (
            <Box sx={{ ml: 1, mt: 0.1, zIndex: 10, display: "flex" }}>
              {studyList && (
                <Tooltip
                  title={"Choose another reporting event from this study"}
                >
                  <Chip
                    label={
                      studyList.filter(
                        (r) => r.study === info.retext.split("/")[3]
                      ).length
                    }
                    icon={<Apps />}
                    color={"info"}
                    size="small"
                    variant="outlined"
                    onClick={handlePopClick2}
                    sx={{
                      mt: 0.3,
                      padding: "2px",
                      fontSize: gridFontSize + 0.2 + "em",
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip title={"Toggle split screen"}>
                <Chip
                  label={"Split"}
                  icon={<Splitscreen />}
                  color={"info"}
                  size="small"
                  variant={panelWidth === 12 ? "outlined" : "filled"}
                  onClick={toggleSplitscreen}
                  sx={{
                    mt: 0.3,
                    padding: "2px",
                    fontSize: gridFontSize + 0.2 + "em",
                  }}
                />
              </Tooltip>
              <Popover
                id={popId2}
                open={popOpen2}
                anchorEl={popAnchorEl2}
                onClose={handlePopClose2}
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
                  {studyList && (
                    <Select
                      placeholder="Enter text to search"
                      options={studyList
                        .filter((r) => r.study === info.retext.split("/")[3])
                        .sort((a, b) => {
                          if (a.value < b.value) return -1;
                          else return 1;
                        })}
                      value={selectedStudy}
                      onChange={selectStudy}
                      menuIsOpen={true}
                      maxMenuHeight={550}
                      // size={20}
                      // pageSize={25}
                    />
                  )}
                </Box>
              </Popover>
              {studyList && (
                <>
                  {" "}
                  <Box
                    sx={{
                      color: "blue",
                      // mt: 1,
                      ml: 2,
                      fontSize: gridFontSize + 0.2 + "em",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() =>
                      window.open(fileViewerPrefix + info.REPATH, "_blank")
                    }
                  >
                    {info.REPATH + "/documents/newdash.html"}
                    <Tooltip title={"View the root directory with File Viewer"}>
                      <IconButton size="small" color="info">
                        <OpenInNew sx={{ border: 1, fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {studyList && (
                <Tooltip
                  title={
                    "Choose another study (generic adam studies are not shown)"
                  }
                >
                  <Box
                    sx={{
                      color: "blue",
                      fontSize: gridFontSize + 0.2 + "em",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={handlePopClick}
                  >
                    {"Status report created on " +
                      info.statusReportCreateDate +
                      " at " +
                      info.statusReportCreateTime}
                    <IconButton size="small" color="info">
                      <ArrowDropDown sx={{ border: 1, fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Tooltip>
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
                  {studyList && (
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
                  )}
                </Box>
              </Popover>
            </Box>
          )}

          {/* {donutChart && info.EVENTTYPE === "crooversight" && (
            <Box sx={{ mt: 1 }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={donutChart}
                ref={radialRef}
              />
            </Box>
          )} */}

          {donutChart && info.EVENTTYPE === "crooversight" && (
            <Box sx={{ ml: 5 }}>
              <Donut iss={iss} parentInfo={info} />
            </Box>
          )}

          {barChart && (
            <Box sx={{ height: 130 }}>
              <HighchartsReact highcharts={Highcharts} options={barChart} />
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
                      key={row.name || id}
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
                              ? "#ffe0e6" // red (pink actually like elsewhere)
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
                          <Tooltip
                            title={
                              row.doc === "SAP"
                                ? sapErrMsg
                                : row.doc === "BSOP"
                                ? bsopErrMsg
                                : ""
                            }
                          >
                            {(row.doc === "SAP" &&
                              (info.SAPERR1 !== "0" || info.SAPERR2 !== "0")) ||
                            (row.doc === "BSOP" &&
                              (info.BSOPERR1 !== "0" ||
                                info.BSOPERR2 !== "0")) ? (
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
                            <Box>
                              {" "}
                              {row.doc.startsWith("SAP")
                                ? "SAP"
                                : row.doc.startsWith("BSOP")
                                ? "BSOP"
                                : row.doc}
                            </Box>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "blue",
                          fontSize: gridFontSize + "em",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <Tooltip
                          key={"cro" + id}
                          title={
                            row.name === "<missing>" || row.name === "missing"
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
                  backgroundColor: "#ffe0e6", // red
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

          {outputLogReport !== null && outputLogReport.length > 0 && (
            <Box
              sx={{
                "& .warn": {
                  backgroundColor: "#fff0b3",
                  color: "#000000",
                },
                "& .red": {
                  backgroundColor: "#ffe0e6", // red
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

        <Grid xs={6}>
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
          <Box sx={{ flex: 1, mt: 0.5 }}>
            {listLastModified !== null ? listLastModified + ", " : null}
          </Box>
          <Box sx={{ flex: 1, mt: 0.5 }}>
            {timeSinceRefresh !== null ? timeSinceRefresh : null}
          </Box>

          <Tooltip title="Information about the data used in this screen">
            <IconButton
              size="small"
              onClick={() => {
                setOpenInfo(true);
              }}
              color="info"
              sx={{ mt: 1 }}
            >
              <Info />
            </IconButton>
          </Tooltip>

          <Tooltip title="View the SAS log that produced this dashboard">
            <IconButton
              size="small"
              onClick={() => {
                window.open(
                  logViewerPrefix +
                    info.REPATH +
                    "/documents/meta/dashboard.log",
                  "_blank"
                );
              }}
              color="info"
              sx={{ mt: 1 }}
            >
              <ArticleTwoTone />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy path of the reporting event folder to the clipboard">
            <IconButton
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(info.REPATH);
              }}
              color="info"
              sx={{ mt: 1 }}
            >
              <FolderCopyTwoTone />
            </IconButton>
          </Tooltip>

          {showGadamDirExists &&
            info &&
            info.generic_adam_exists === "1" &&
            info.hasOwnProperty("generic_adam_qc_exists") &&
            info.generic_adam_qc_exists === "1" && (
              <Tooltip title="Show GADAM creation report - if available">
                <IconButton
                  size="small"
                  onClick={() => {
                    const parent = info.REPATH.split("/");
                    parent.pop();
                    window.open(
                      webDavPrefix +
                        parent.join("/") +
                        "/generic_adam/qc/qc_" +
                        info.study +
                        ".html",
                      "_blank"
                    );
                  }}
                  color="info"
                  sx={{ mt: 1 }}
                >
                  <Google />
                </IconButton>
              </Tooltip>
            )}

          {showAdamQc &&
            showGadamDirExists &&
            info &&
            "generic_adam_exists" in info && (
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
                      ? "Generic Adam directory exists"
                      : "Generic Adam directory missing"
                  }
                  icon={info.generic_adam_exists === "1" ? <Done /> : <Close />}
                  color={info.generic_adam_exists === "1" ? "success" : "error"}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Tooltip>
            )}
          {showAdamQc && info && "generic_adam_meta_exists" in info && (
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
                    ? "Generic Adam checks have been run"
                    : "Generic Adam checks need to be run"
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
                onClick={() => {
                  setOpenInfo(true);
                }}
              />
            </Tooltip>
          )}
          {showAdamQc && info && info.generic_adam_lastModified > " " ? (
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

          {sourceData && sourceData.compare && sourceData.compare.length > 0 ? (
            <Tooltip
              title={
                "View report of analysis of PROC COMPARE output for this study"
              }
            >
              <Chip
                label={"Comparisons"}
                color={"info"}
                size="small"
                variant="outlined"
                sx={{ mt: 1, ml: 1 }}
                onClick={() => {
                  setCompareInfo(true);
                }}
              />
            </Tooltip>
          ) : null}

          <Box>
            {!gotLot && report2 && (
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
          <Box>
            {gotLot && report2lot && (
              <DataGridPro
                rows={report2lot}
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
          <Box>
            {gotLot &&
              report2noLot &&
              report2noLot.length > 0 &&
              colsReport2noLot && (
                <DataGridPro
                  rows={report2noLot}
                  columns={colsReport2noLot}
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
          setUserJson={setUserJson}
          userJsonFile={userJsonFile}
          user={tempUsername}
          rowToCheck={rowToCheck}
          idClickedOn={idClickedOn}
          access={sourceData && sourceData.access ? sourceData.access : null}
          mode={mode}
        />
      )}
      {openUserMultipleInput && reviewSection && (
        <MultipleUserInput
          open={openUserMultipleInput}
          setOpen={setOpenUserMultipleInput}
          userJson={userJson}
          setUserJson={setUserJson}
          userJsonFile={userJsonFile}
          reviewSection={reviewSection} // subset of rows we are reviewing
          colsReviewSection={colsReviewSection} // column definitions for the subset of rows we are reviewing
          user={tempUsername}
          rowToCheck={rowToCheck}
          // idClickedOn={idClickedOn}
          access={sourceData && sourceData.access ? sourceData.access : null}
          mode={mode}
        />
      )}{" "}
      {openOutputReview && (
        <OutputReview
          open={openOutputReview}
          setOpen={setOpenOutputReview}
          userJson={userJson}
          userJsonFile={userJsonFile}
          outputClickedOn={outputClickedOn}
        />
      )}
      {/* dialog that prompts for a user name */}
      {!username && (
        <Dialog
          fullWidth
          maxWidth="sm"
          onClose={() => setOpenUserLogin(false)}
          open={openUserLogin}
          title={"User Login"}
        >
          <DialogTitle>
            <Box>
              {" "}
              {userFullName && userFullName.length > 0
                ? `Hi ${userFullName}! Now you are recognized you can press SAVE.`
                : "Who are you?"}
            </Box>
          </DialogTitle>
          <DialogContent>
            {" "}
            <TextField
              id="input-with-icon-textfield"
              label="User Name"
              placeholder="e.g. pmason"
              value={tempUsername}
              onChange={(e) => {
                setTempUsername(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            {/*  <TextField
                label={
                  access &&
                  access.length > 0 &&
                  access.filter((u) => u.userid === user).length > 0
                    ? "User ID (valid)"
                    : "Enter User ID"
                }
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                }}
                color={
                  access && access.filter((u) => u.userid === user).length > 0
                    ? "success"
                    : access === null
                    ? "warning"
                    : "error"
                }
                sx={{
                  width: "100%",
                }}
              /> */}
          </DialogContent>
          <DialogActions>
            {tempUsername &&
              tempUsername > "" &&
              sourceData.access &&
              sourceData.access.length > 0 && (
                <Button disabled={!showSaveButton} onClick={() => saveUser()}>
                  Save
                </Button>
              )}
          </DialogActions>
        </Dialog>
      )}
      {tempUsername && (
        <Snackbar
          severity="success"
          open={openSnackbar}
          autoHideDuration={7000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Welcome 👨‍🦲 {userFullName} ({username})
          </Alert>
        </Snackbar>
      )}
      {/* Dialog with General info about this screen */}
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => setOpenInfo(false)}
        open={openInfo}
      >
        <DialogTitle>Info about this screen</DialogTitle>
        <DialogContent>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <ForwardTwoTone />
              </ListItemIcon>
              <Box sx={{ border: 1, padding: 1 }}>
                Many things on the screen can be hovered over to display
                information, including any{" "}
                <span style={{ color: "blue" }}>
                  <b>blue</b>
                </span>{" "}
                text, which can also be clicked on to do something - showing
                related information on another tab, creating an email, etc.
              </Box>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <ForwardTwoTone />
              </ListItemIcon>
              <Box sx={{ border: 1, padding: 1 }}>
                Take a look at this document that explains this screen some
                more:{" "}
                <a
                  href={`https://argenxbvba.sharepoint.com/:w:/r/sites/Biostatistics/_layouts/15/Doc.aspx?sourcedoc=%7BE44FDE72-2590-4798-A0A5-4E1D45AEE2A0%7D&file=Project%20status%20and%20progress%20tracking.docx&nav=eyJjIjoxNzIyNDk1NDB9`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Project Status and Project Tracking Guide
                </a>
              </Box>
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <ForwardTwoTone />
              </ListItemIcon>
              <Box sx={{ border: 0.5, padding: 1 }}>
                <b>Reviewing messages: </b>
                If there are errors or warnings in logs for any SAS programs
                then a table will show those programs in the lower left area of
                screen. A user can review the messages by clicking one of the
                icons:
                <ul>
                  <li>
                    <span style={{ color: "blue", fontSize: 20 }}>
                      <b>👀</b>
                    </span>{" "}
                    - review <b>all</b> of the messages for a program, and mark
                    each one as either:{" "}
                    <span style={{ color: "red" }}>
                      <b>Not OK</b>
                    </span>
                    {", "}
                    <span style={{ color: "blue" }}>
                      <b>Unsure</b>
                    </span>
                    {" or "}
                    or{" "}
                    <span style={{ color: "green" }}>
                      <b>OK</b>
                    </span>
                    , along with an explanation.
                  </li>
                  <li>
                    <span style={{ color: "blue", fontSize: 20 }}>
                      <b>?</b>
                    </span>{" "}
                    - review <b>one</b> of the programs marking each message as
                    either:{" "}
                    <span style={{ color: "green" }}>
                      <b>OK</b>
                    </span>{" "}
                    or{" "}
                    <span style={{ color: "red" }}>
                      <b>Not OK</b>
                    </span>
                    , along with an explanation.
                  </li>
                </ul>
              </Box>
            </ListItem>
            {info && info.generic_adam_meta_exists === "0" ? (
              <ListItem>
                <ListItemIcon>
                  <ForwardTwoTone />
                </ListItemIcon>
                <Box sx={{ border: 1, padding: 1 }}>
                  The generic_adam programs in{" "}
                  <b>...[study]/staging/testrun[n]/generic_adam</b> can be
                  created by running the job{" "}
                  <b>
                    /general/biostat/jobs/gadam_ongoing_studies/prod/jobs/job_gadam_dryrun_setup.job.
                  </b>
                  <p />
                  <ul>
                    <li>
                      {" "}
                      The first 3 parameters (paths) need to be defined as
                      follows:
                      <ol>
                        <li>
                          The path to the test run folder in which the
                          generic_adam should be setup
                        </li>{" "}
                        <li>
                          The path to the folder holding the sdtm data used for
                          the setup (something like
                          <i>../data_received/sdtm_YYYYMMDD</i>)
                        </li>
                        <li>
                          {" "}
                          The path to the folder holding the CRO-provided adam
                          data (to be compared against) used for the setup
                          (something like <i>../data_received/adam_YYYYMMDD</i>)
                        </li>
                      </ol>
                      <br />
                    </li>
                    <li>
                      {" "}
                      The next 4 parameters are by default set to N – this means
                      the generic adam programs and jobs are just setup but not
                      run. Setting them to Y results in actually running the
                      programs to
                      <ol>
                        <li>
                          Create the datasets in
                          ../testrun[n]/generic_adam/adam/tmp
                        </li>
                        <li>
                          QC (compare) these datasets against those in
                          ../data_received/adam_YYYYMMDD (path specified by 3rd
                          parameter)
                        </li>
                        <li>
                          Copying the datasets from ../generic_adam/adam/tmp to
                          ../testrun[n]/generic_adam/adam if internal
                          consistency checks pass.
                        </li>
                        <li>
                          Creating a few tables (exposure, AE, ECG) from the
                          generic_dam datasets into
                          ../testrun[n]/generic_adam/output/pdf
                        </li>
                      </ol>{" "}
                      <br />
                    </li>
                    <li>
                      Parameter “force” should be set to “Y” to re-run the
                      programs after an initial run, when outputs already exist
                      and have later dates than their input data.
                    </li>
                  </ul>
                </Box>
              </ListItem>
            ) : null}
          </List>
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => setCompareInfo(false)}
        open={compareInfo}
      >
        <DialogTitle>Info from Proc Compare(s)</DialogTitle>
        <DialogContent>
          {colsCompare && (
            <DataGridPro
              rows={sourceData.compare}
              columns={colsCompare}
              disableColumnMenu
              density="compact"
              rowHeight={rowHeight}
              autoHeight
              hideFooter={true}
              getRowId={(row) => row.output_file}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default App;