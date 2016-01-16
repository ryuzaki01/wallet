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
        db.transaction(function (tx) {
          tx.executeSql('DELETE FROM expense WHERE id = ?;', [model.id],
            function (transaction, result) {
              App.data[App.views.index.type].remove(model);
            },
            DBHandler.errorHandler
          );

          var totalSaldo = App.model.get('totalSaldo');
          switch (model.type) {
            case 'income':
              App.model.set('totalSaldo', totalSaldo - (parseInt(model.amount) || 0));
              break;
            case 'expense':
              App.model.set('totalSaldo', totalSaldo + (parseInt(model.amount) || 0));
              break;
            default:
              break;
          }

          App.updateStore();
        }, DBHandler.errorHandler, function () {
          if (typeof cb === 'function') {
            cb.call();
          }
        });

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
      if (App.currentView.scroller) {
        App.currentView.scroller.reset();
      }
      $('#action-add').hide();
    }
  }
});