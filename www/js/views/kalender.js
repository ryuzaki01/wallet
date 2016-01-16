define(["kendo"], function (kendo) {
  return {
    init: function (e) {
      App.currentView = e.view;

      App.views.kalender.initScheduler();
    },

    beforeShow: function (beforeShowEvt) {
      // Nothing
    },

    initScheduler: function () {
      var date = new Date();
      var $scheduleElement = $("#scheduler");
      var scheduler = $scheduleElement.data("kendoScheduler");

      if (scheduler) {
        scheduler.destroy();
        $scheduleElement.empty();
      }

      $scheduleElement.kendoScheduler({
        allDaySlot: false,
        start: new Date(date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' 6:00 AM'),
        end: new Date(date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' 5:00 AM'),
        height: 560,
        majorTick: 120,
        mobile: true,
        views: [
          "agenda",
          "day"
        ],
        editable: false,
        dataSource: App.data.schedule,
        eventTemplate: $("#event-template").html(),
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

      var $schedulerContent = $('.k-scheduler-content');
      $schedulerContent.height($(window).height() - $schedulerContent.offset().top)
    },
    show: function (showEvt) {
      console.log('showing Calendar..');
      var $schedulerContent = $('.k-scheduler-content');
      $schedulerContent.height($(window).height() - $schedulerContent.offset().top)
    }
  }
});