define(["kendo"], function (kendo) {
  return {
    $targetList: $('#target-list'),
    init: function (e) {
      App.currentView = e.view;

      App.views.target.$targetList.kendoTouch({
        filter: ">li",
        enableSwipe: true,
        touchstart: App.views.target.touchListItem,
        swipe: App.views.target.swipeListItem
      });
    },
    touchListItem: function (e) {
      var target = $(e.touch.initialTouch);
      var listview = App.views.target.$targetList.data('kendoMobileListView');
      var button = $(e.touch.target).find("[data-role=button]:visible");
      var model;

      if (target.closest("[data-role=button]")[0]) {
        model = App.data.target.getByUid($(e.touch.target).attr("data-uid"));
        db.transaction(function (tx) {
          tx.executeSql('DELETE FROM target WHERE id = ?;', [model.id],
            DBHandler.nullHandler,
            DBHandler.errorHandler
          );
          tx.executeSql('DELETE FROM category WHERE name = ?;', [model.name],
            function (transaction, result) {
              App.data.target.remove(model);
              var category = App.data.category.expense.get(model.name);
              App.data.category.expense.remove(category);
              App.updateStore();
            },
            DBHandler.errorHandler
          );
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
    show: function () {
      $('#action-target-add').show();
    },
    hide: function () {
      $('#action-target-add').hide();
      if (App.currentView.scroller) {
        App.currentView.scroller.reset();
      }
    }
  }
});