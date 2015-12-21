define(["kendo"], function (kendo) {
  return {
    $form: $('#form-new-entry'),
    init: function (e) {
      $('.cat-expense').hide();
      App.views.tambah.$form.find('[name="type"]:eq(1)').on('change', function () {
        if (App.views.tambah.$form.find('[name="type"]:eq(1)').is(':checked')) {
          $('#expensetype').text('Pengeluaran');
          $('.cat-expense').show();
          $('.cat-income').hide();
        } else {
          $('#expensetype').text('Pemasukan');
          $('.cat-income').show();
          $('.cat-expense').hide();
        }
      });
    },

    hide: function (e) {
      e.view.scroller.reset();
    },

    show: function (e) {
      // ... show event code ...
    },

    save: function () {
      var data = App.views.tambah.$form.serializeObject();
      data.type = (data.type === 'on' ? 'expense' : 'income');
      var dateNow = new Date();
      console.log(data.type);
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO expense (name, type, category, amount, date, time, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            data.name,
            data.type,
            data.category,
            data.amount || 0,
            data.date || dateNow.getFullYear() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getDate(),
            data.time || dateNow.getHours() + ':' + (dateNow.getMinutes() + 1) + ':' + dateNow.getSeconds(),
            data.note || ''
          ], DBHandler.nullHandler, DBHandler.errorHandler);
        App.data[data.type].add(data);
        App.data.schedule.add({
          start: new Date(data.date + ' ' + data.time),
          end: new Date(data.date + ' ' + data.time),
          title: data.name + ' - Rp ' + data.amount,
          type: data.type
        });
        App.views.tambah.$form[0].reset();
        kendoApp.navigate('index');
      }, DBHandler.errorHandler, DBHandler.nullHandler);
    }
  }
});