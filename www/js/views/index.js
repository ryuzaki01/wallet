define(["kendo"], function (kendo) {
  return {
    $historyList: $('#history-list'),
    type: 'income',
    init: function (e) {
      // Nothing
      App.currentView = e.view;
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
      $('#action-add').hide();
    }
  }
});