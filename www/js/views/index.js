define(["kendo"], function (kendo) {
  return {
    $historyList: $('#history-list'),
    type: 'income',
    init: function (e) {
      // Nothing
      App.currentView = e.view;
      App.views.index.$historyList.kendoTouch({
        filter: ">li",
        enableSwipe: true,
        touchstart: App.views.index.touchListItem,
        swipe: App.views.index.swipeListItem
      });
    },
    touchListItem: function (e) {
      var target = $(e.touch.initialTouch);
      var listview = App.views.index.$historyList.data('kendoMobileListView');
      var button = $(e.touch.target).find("[data-role=button]:visible");
      var model;

      if (target.closest("[data-role=button]")[0]) {
        model = App.data[App.views.index.type].getByUid($(e.touch.target).attr("data-uid"));
        App.data[App.views.index.type].remove(model);

        //prevent `swipe`
        this.events.cancel();
        e.event.stopPropagation();
      } else if (button[0]) {
        button.hide();

        //prevent `swipe`
        this.events.cancel();
      } else {
        listview.items().find("[data-role=button]:visible").hide();
      }
    },
    swipeListItem: function (e) {
      var button = kendo.fx($(e.touch.currentTarget).find("[data-role=button]"));
      button.expand().duration(30).play();
    },
    refreshList: function () {
      var listView = App.views.index.$historyList.data('kendoMobileListView');
      listView.setDataSource(App.data[App.views.index.type]);
    },
    changeList: function () {
      App.views.index.type = this.current().index() === 0 ? 'income' : 'expense';
      App.views.index.refreshList();
    },
    show: function () {
      App.views.index.refreshList();
      $('#action-add').show();
    },
    hide: function () {
      App.currentView.scroller.reset();
      $('#action-add').hide();
    }
  }
});