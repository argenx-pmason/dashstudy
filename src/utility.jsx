export const xmlToJson = (xml) => {
  // Create the return object
  var obj = {},
    i,
    j,
    attribute,
    item,
    nodeName,
    old;

  if (xml.nodeType === 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (j = 0; j < xml.attributes.length; j = j + 1) {
        attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (i = 0; i < xml.childNodes.length; i = i + 1) {
      item = xml.childNodes.item(i);
      nodeName = item.nodeName;
      if (obj[nodeName] === undefined) {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (obj[nodeName].push === undefined) {
          old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

export const getDir = async (url, depth, callback) => {
  // Create an XMLHttpRequest object
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && (this.status === 207 || this.status === 200)) {
      callback(this);
    }
  };
  // Send a request
  //xhttp.open("PROPFIND", "https://xarprod.ondemand.sas.com/lsaf/webdav/repo/", false, user, pwd);
  xhttp.open("PROPFIND", url, false);
  xhttp.setRequestHeader("Depth", "" + depth);
  let xmlData =
    "<?xml version='1.0' encoding='UTF-8'?>" +
    "  <d:propfind  xmlns:d='DAV:' xmlns:sc='http://www.sas.com/sas'>" +
    "     <d:prop>" +
    "        <d:displayname /> " +
    "        <d:creationdate/> <d:getlastmodified />  <d:getetag />  <d:getcontenttype />  <d:resourcetype />  <sc:checkedOut />  <sc:locked />   <sc:version /> " +
    "     </d:prop>" +
    "  </d:propfind>";
  xhttp.send(xmlData);
};

export const updateJsonFile = (file, content) => {
  console.log("updateJsonFile");
  fetch(file, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(content),
  })
    .then((response) => {
      console.log("response", response);
      response.text().then(function (text) {
        console.log("text", text);
        // setWaitGetDir(false);
      });
    })
    .catch((err) => console.log("err: ", err));
};

export const getJsonFile = (file, setContent) => {
  console.log("getJsonFile - file: ", file);
  fetch(file).then(function (response) {
    console.log("response", response);
    if (response.type === "cors" || response.status !== 200) return;
    response.text().then(function (text) {
      console.log("text", text);
      setContent(text);
      // TODO: use the info that comes back to modify the status of programs and outputs, which then affects the color of bars
      //  setWaitGetDir(false);
    });
  });
};