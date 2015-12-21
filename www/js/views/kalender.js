define(["kendo"], function (kendo) {
  return {
    init: function (e) {
      var date = new Date();
      $("#scheduler").kendoScheduler({
        allDaySlot: false,
        start: new Date(date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' 6:00 AM'),
        end: new Date(date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' 5:00 AM'),
        height: 560,
        views: [
          {type: "day"}
        ],
        timezone: "Etc/UTC",
        dataSource: App.data.schedule,
        resources: [
          {
            field: "type",
            name: "Type",
            dataColorField: "color",
            dataSource: [
              { text: "Pemasukan", value: 'income', color: "#00b300" },
              { text: "Pengeluaran", value: 'expense', color: "#ff2b4d" }
            ]
          }
        ]
      });
    },

    beforeShow: function (beforeShowEvt) {
      // Nothing
    },

    show: function (showEvt) {
      // ... show event code ...
    }
  }
});