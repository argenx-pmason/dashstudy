import $ from "jquery";
export const hexToRgb = (hex) => [
  (hex >> 16) & 0xff,
  (hex >> 8) & 0xff,
  hex & 0xff,
];

export const rgbToStr = (rgb) =>
  "rgb(" + rgb.map((c) => Math.round(c)).join(",") + ")";

export const customTooltip = function (chartElm, borderOffset) {
  return function (tooltip) {
    var $mainBody = $("body");
    var $overlay = $mainBody.find("#overlay");

    if ($overlay.length <= 0) {
      $overlay = $('<div id="overlay">')
        .css("background-color", "none")
        .css("pointer-events", "none")
        .css("position", "absolute")
        .css("left", "0")
        .css("right", "0")
        .css("top", "0")
        .css("bottom", "0")
        .width("100%")
        .height("100%");

      $mainBody.append($overlay);
    }

    var $tooltip = $overlay.find("#tooltip");

    if ($tooltip.length <= 0) {
      $tooltip = $('<div id="tooltip">')
        .css("position", "absolute")
        .css("display", "inline-block")
        .css("background-color", tooltip.backgroundColor)
        .css("border-radius", tooltip.cornerRadius)
        .css("pointer-events", "none")
        .css("padding", tooltip.yPadding + "px " + tooltip.xPadding + "px");

      $content = $('<div id="content">').css("overflow", "auto");
      $tooltip.append($content);

      $title = $('<div id="title">');
      $title.text("title");
      $title
        .css("color", tooltip.titleFontColor)
        .css("overflow", "clip")
        .css("fontFamily", tooltip._titleFontFamily)
        .css("fontSize", tooltip.titleFontSize)
        .css("fontStyle", tooltip._titleFontStyle)
        .css("margin-bottom", tooltip.titleMarginBottom);

      $content.append($title);

      $body = $('<div id="body">');
      $body.text("body");
      $body
        .css("color", tooltip.bodyFontColor)
        //              .css('overflow', 'auto')
        .css("fontFamily", tooltip._bodyFontFamily)
        .css("fontSize", tooltip.bodyFontSize)
        .css("fontStyle", tooltip._bodyFontStyle);

      $content.append($body);

      $overlay.append($tooltip);
    }

    var $title = $tooltip.find("#title");
    $title.empty();
    tooltip.title &&
      tooltip.title
        .filter((line) => !!line)
        .forEach((line) => {
          $title.append($("<div>").text(line));
        });

    var $body = $tooltip.find("#body");
    $body.empty();

    var $content = $tooltip.find("#content");

    tooltip.body &&
      tooltip.body
        // .map(a => {
        //  console.log(a)
        //  return a;
        // })
        .map((sub, i) =>
          sub.lines.map((l, j) => ({
            line: l,
            color: tooltip.labelColors[i][j],
          }))
        )
        //      .filter(lines => !!lines)
        .flat()
        .forEach((pair) => {
          var $li = $("<div>").css("position", "relative");

          $li.append($("<div>").css("margin-left", 20).text(pair.line));
          $li.append(
            $("<div>")
              .css("position", "absolute")
              .css("bottom", 0)
              .css("top", 0)
              .height(10)
              .width(10)
              .css("background-color", pair.color)
          );

          $body.append($li);
        });

    if (!tooltip || !tooltip.opacity) {
      $tooltip.css("opacity", 0);
    } else {
      $content.css("max-width", "");
      $content.css("max-height", "");

      var co = $(chartElm).offset();
      var oo = $overlay.offset();
      // offset of chart wrt overlay
      var ro = { top: co.top - oo.top, left: co.left - oo.left };
      // offset of tooltip wrt overlay
      var to = { top: ro.top + tooltip.caretY, left: ro.left + tooltip.caretX };

      var mw = Math.round(
        oo.left +
          $overlay.width() -
          borderOffset -
          to.left -
          2 * tooltip.xPadding
      );
      $content.css("max-width", mw);

      var mh = Math.round(
        oo.top +
          $overlay.height() -
          borderOffset -
          to.top -
          2 * tooltip.yPadding
      );
      $content.css("max-height", mh);

      $tooltip.offset({ top: to.top, left: to.left });
      $tooltip.css("opacity", 1);
    }
  };
};

export const createStatistics = function (
  json,
  titleKey,
  typeKey,
  statusKey,
  statusCmp
) {
  // filtered data, for debugging
  // var json =
  //     json.map(o =>
  //         Object.keys(o)
  //             .filter(k => k === typeKey || k === statusKey)
  //             .reduce((no, k) => {
  //                 return {
  //                     ...no,
  //                     [k]: o[k]
  //                 };
  //             }, {}
  //             )
  //  );

  // ** outer shell
  // grouped data per type
  var gData = json.reduce((red, elm) => {
    var rev = elm[typeKey];
    var ar = (red[rev] || []).concat(elm);
    return {
      ...red,
      [rev]: ar,
    };
  }, {});

  // t => type
  // s => status
  // sc => status counts
  // elm => json element

  var os = Object.keys(gData).reduce((red, t) => {
    var sc = gData[t]
      .map((elm) => ({ status: elm[statusKey], title: elm[titleKey] }))
      .filter((s) => statusCmp.filter(s.status))
      .reduce((acc, s) => {
        acc[s.status] = {
          count: (acc[s.status]?.count || 0) + 1,
          labels: [
            ...(acc[s.status]?.labels || []),
            { title: s.title, status: s.status },
          ],
        };
        return acc;
      }, {});

    if (Object.keys(sc).length <= 0) {
      return red;
    }

    return {
      ...red,
      [t]: sc,
    };
  }, {});

  // ** middle shell: type
  // elm => json element
  // t => type
  var ms = json
    .map((elm) => ({
      type: elm[typeKey],
      status: elm[statusKey],
      title: elm[titleKey],
    }))
    .filter((t) => statusCmp.filter(t.status))
    .filter((t) => t.type in os)
    .reduce((acc, t) => {
      acc[t.type] = {
        count: (acc[t.type]?.count || 0) + 1,
        labels: [
          ...(acc[t.type]?.labels || []),
          { title: t.title, status: t.status },
        ],
      };
      return acc;
    }, {});

  // ** inner shell: status
  // elm => json element
  // s => status
  var is = json
    .map((elm) => ({
      type: elm[typeKey],
      status: elm[statusKey],
      title: elm[titleKey],
    }))
    .filter((s) => statusCmp.filter(s.status))
    .filter((t) => t.type in os)
    .reduce((acc, s) => {
      acc[s.status] = {
        count: (acc[s.status]?.count || 0) + 1,
        labels: [
          ...(acc[s.status]?.labels || []),
          { title: s.title, status: s.status },
        ],
      };
      return acc;
    }, {});

  return {
    outer: os,
    middle: ms,
    inner: is,
  };
};

export const createData = function (
  json,
  titleKey,
  typeKey,
  statusKey,
  statusCmp
) {
  var stats = createStatistics(json, titleKey, typeKey, statusKey, statusCmp);
  // t => type
  // s => status
  return [
    Object.keys(stats.outer)
      .sort()
      .map((t) => {
        var sub = stats.outer[t];
        return Object.keys(sub)
          .sort((s1, s2) => statusCmp.sort(s1, s2))
          .map((s) => {
            return {
              value: sub[s].count,
              status: s,
              type: t,
              titles: sub[s].labels.map((l) => l.title),
              colors: sub[s].labels
                .map((l) => statusCmp.color(l.status))
                .map(rgbToStr),
            };
          });
      }),
    [
      Object.keys(stats.middle)
        .sort()
        .map((t) => ({
          value: stats.middle[t].count,
          type: t,
          titles: stats.middle[t].labels.map((l) => l.title),
          colors: stats.middle[t].labels
            .map((l) => statusCmp.color(l.status))
            .map(rgbToStr),
        })),
    ],
    [
      Object.keys(stats.inner)
        .sort((s1, s2) => statusCmp.sort(s1, s2))
        .map((s) => ({
          value: stats.inner[s].count,
          status: s,
          titles: stats.inner[s].labels.map((l) => l.title),
          colors: stats.inner[s].labels
            .map((l) => statusCmp.color(l.status))
            .map(rgbToStr),
        })),
    ],
  ];
};

export const outerShell = function (data, statusCmp) {
  return {
    data: data[0].flat().map((st) => st.value),
    backgroundColor: data[0]
      .map((ast) => ast.map((st) => statusCmp.color(st.status)).map(rgbToStr))
      .flat(),
  };
};

export const middleShell = function (data, statusCmp) {
  return {
    data: data[1].flat().map((st) => st.value),
    backgroundColor: data[0]
      .map((ast) =>
        rgbToStr(
          statusCmp.wcolor(
            ast.map((st) => ({ weight: st.value, status: st.status }))
          )
        )
      )
      .flat(),
  };
};

export const innerShell = function (data, statusCmp) {
  return {
    data: data[2].flat().map((st) => st.value),
    backgroundColor: data[2]
      .map((ast) => ast.map((st) => statusCmp.color(st.status)).map(rgbToStr))
      .flat(),
  };
};

export const shells = function (indexes, data, statusCmp) {
  return indexes
    .map((i) => {
      if (i === 0) {
        return outerShell(data, statusCmp);
      }
      if (i === 1) {
        return middleShell(data, statusCmp);
      }
      if (i === 2) {
        return innerShell(data, statusCmp);
      }
      return null;
    })
    .filter((d) => d != null);
};

export const createCheck = function (id, txt, val, checked, parent, chart) {
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.name = id;
  checkbox.value = val;
  checkbox.checked = checked;
  checkbox.onchange = function (ev) {
    chart.toggle(val, ev.target.checked);
  };

  var label = document.createElement("label");
  label.htmlFor = id;
  label.appendChild(document.createTextNode(txt));
  $(label)
    .css("fontColor", chart.config.options.defaultFontColor)
    .css("fontFamily", chart.config.options.defaultFontFamily)
    .css("fontSize", chart.config.options.defaultFontSize)
    .css("fontStyle", chart.config.options.defaultFontStyle)
    .css("lineHeight", chart.config.options.defaultLineHeight);

  parent.appendChild(checkbox);
  parent.appendChild(label);
};

export const createTypeStatusChart = function (elmId, shellSpecs) {
  if (!shellSpecs) {
    shellSpecs = [0, 1, 2].map((i) => {
      return { type: i, visible: true };
    });
  }

  var chartEl = document.getElementById(elmId);

  var chart = new Chart(chartEl.getContext("2d"), {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [1],
        },
        {
          data: [1],
        },
        {
          data: [1],
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      circumference: Math.PI,
      rotation: -Math.PI,
      tooltips: {
        enabled: false,
      },
    },
  });

  var container = document.createElement("visibility-checks");

  shellSpecs.forEach((sh) => {
    switch (sh.type) {
      case 0:
        createCheck(
          "outer",
          "Status by Output Type",
          sh.type,
          sh.visible,
          container,
          chart
        );
        break;
      case 1:
        createCheck(
          "middle",
          "Output Type",
          sh.type,
          sh.visible,
          container,
          chart
        );
        break;
      case 2:
        createCheck("inner", "Status", sh.type, sh.visible, container, chart);
        break;
      default:
        return;
    }
  });

  $(container).insertAfter($(chartEl));

  chart.visualize = function (indexes) {
    this.visible = indexes;
    this.data.datasets = shells(this.visible, this.fullData, this.statusCmp);
    this.update();
  };

  chart.toggle = function (idx, on) {
    var self = this;
    var vis = [0, 1, 2].filter((i, ii) => {
      if (ii === idx) {
        return on;
      }
      return self.visible.indexOf(i) >= 0;
    });
    self.visualize(vis);
  };

  chart.fillChart = function (nJson, typeKey, statusKey, titleKey, nOptions) {
    // define the ordering for status
    this.statusCmp = {
      order: nOptions.statusOrder.map((s) => s.key),
      colors: nOptions.statusOrder.map((s) => hexToRgb(s.color)),

      // defines the order of a status
      sort: function (s1, s2) {
        return this.order.indexOf(s2) - this.order.indexOf(s1);
      },
      // filters out an ignored status
      filter: function (s) {
        return this.order.indexOf(s) >= 0;
      },
      // finds the color associated with a status
      color: function (s) {
        return this.colors[this.order.indexOf(s)];
      },
      // creates a weighted color given a list of status and corresponding weight (ws)
      wcolor: function (ws) {
        // ts => total weight
        var tw = ws.reduce((t, w) => t + w.weight, 0);
        // w => pair of status and corresponding weight
        // c => single color component of an rgb color
        // rgb => array of 3 color components [r, g, b]
        // sum => sum of (all) colors
        // j => color component index (0, 1 or 2)
        return ws
          .map((w) => this.color(w.status).map((c) => c * w.weight))
          .reduce((sum, rgb) => sum.map((c, j) => c + rgb[j]), [0, 0, 0])
          .map((c) => c / tw);
      },
    };

    this.fullData = createData(
      nJson,
      titleKey,
      typeKey,
      statusKey,
      this.statusCmp
    );

    this.options.title = {
      display: true,
      text: "Status of CRO oversight SharePoint list",
    };

    var self = this;
    this.options.tooltips = {
      enabled: false,
      custom: customTooltip(
        chartEl,
        "borderOffset" in nOptions ? nOptions.borderOffset : 25
      ),
      callbacks: {
        title: function (ttis) {
          return ttis
            .map((tti) => {
              var ds = self.fullData[self.visible[tti.datasetIndex]];
              return ds.flat()[tti.index];
            })
            .map(
              (di) =>
                [di.type, di.status].filter((st) => !!st).join(" - ") +
                ": " +
                di.value
            );
        },
        label: function (tti, o) {
          var ds = self.fullData[self.visible[tti.datasetIndex]];
          var di = ds.flat()[tti.index];
          if (
            nOptions.tooltipLimit &&
            di.titles.length > nOptions.tooltipLimit
          ) {
            return [
              ...di.titles.slice(0, nOptions.tooltipLimit),
              di.titles.length - nOptions.tooltipLimit + " more items...",
            ];
          }
          return di.titles;
        },
        labelColor: function (tti) {
          var ds = self.fullData[self.visible[tti.datasetIndex]];
          var di = ds.flat()[tti.index];
          if (
            nOptions.tooltipLimit &&
            di.titles.length > nOptions.tooltipLimit
          ) {
            return [...di.colors.slice(0, nOptions.tooltipLimit), "none"];
          }
          return di.colors;
        },
      },
    };

    this.visualize(shellSpecs.filter((sh) => sh.visible).map((sh) => sh.type));
  };

  return chart;
};
