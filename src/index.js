import copy from "copy-to-clipboard";
import VConsole from "vconsole";
import stringify from "json-stringify-safe";

class VConsoleOutputLogsPlugin {
  constructor(vConsole) {
    this.vConsole = vConsole;
    this.$ = vConsole.$;
    this.dom = null;
    return this.init();
  }

  init() {
    const vConsoleExportLogs = new VConsole.VConsolePlugin("exportLog", "exportLog");
    vConsoleExportLogs.on("init", () => {});
    vConsoleExportLogs.on("renderTab", (callback) => {
      const html = `<div class="vconsole-exportlog">
      </div>`;
      callback(html);
    });
    vConsoleExportLogs.on("addTool", (callback) => {
      const buttons = [
        {
          name: "exportLogs",
          onClick: this.export,
        },
        {
          name: "copyLogs",
          onClick: this.copyText,
        },
      ];
      callback(buttons);
    });
    this.vConsole.addPlugin(vConsoleExportLogs);
    return vConsoleExportLogs;
  }
  funDownload = (content, filename) => {
    const eleLink = document.createElement("a");
    eleLink.download = filename;
    eleLink.style.display = "none";
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  };
  export = () => {
    const ctxArr = this.vConsole.pluginList.default.compInstance.$$.ctx;
    const logList = ctxArr.filter((item) => item instanceof Array)[0];
    let _str = "";
    logList.forEach((item) => {
      const timestamp = formatTimestampToHMSMs(item.date);
      let _rowLog = `${timestamp} `;
      item.data.forEach((logCell) => {
        if (typeof logCell.origData === "string") {
          _rowLog += `${logCell.origData} `;
        } else {
          _rowLog += `${stringify(logCell.origData)} `;
        }
      });
      _str += `${_rowLog}\n`;
    });
    this.funDownload(_str, `${`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}.log`);
  };
  copyText = () => {
    const ctxArr = this.vConsole.pluginList.default.compInstance.$$.ctx;
    const logList = ctxArr.filter((item) => item instanceof Array)[0];
    let _str = "";
    logList.forEach((item) => {
      const timestamp = formatTimestampToHMSMs(item.date);
      let _rowLog = `${timestamp} `;
      item.data.forEach((logCell) => {
        if (typeof logCell.origData === "string") {
          _rowLog += `${logCell.origData} `;
        } else {
          _rowLog += `${stringify(logCell.origData)} `;
        }
      });
      _str += `${_rowLog}\n`;
    });
    copy(_str);
  };
}

function formatTimestampToHMSMs(timestamp) {
  const date = new Date(timestamp);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

export default VConsoleOutputLogsPlugin;
