var data = require("self").data;
 
var panel = require("panel").Panel({
  width: 180,
  height: 300
});

require("widget").Widget({
  id: "widget",
  label: "Generate a strong password",
  contentURL: data.url("icon_32.png"),
  panel: panel,
  onClick: function() {
    panel.contentURL = "about:blank";
    panel.contentURL = data.url("popup.html");
  }
});