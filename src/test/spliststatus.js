var listLastModified =
  "SharePoint list last modification time: 2023-12-27 12:32:44";
var listLastRefreshed = 1704115921465;
var rest = Math.floor((Date.now() - listLastRefreshed) / 1000);
var s = rest % 60;
rest = Math.floor(rest / 60);
var m = rest % 60;
rest = Math.floor(rest / 60);
var h = rest % 24;
var d = Math.floor(rest / 24);
var timeSinceRefresh =
  "Time since last refresh SharePoint list content: " +
  d +
  " days, " +
  h +
  " hours, " +
  m +
  " minutes, " +
  s +
  " seconds";
