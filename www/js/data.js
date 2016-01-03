define(["kendo"], function (kendo) {
  return {
    income : kendo.data.DataSource.create({
      data:[],
      change: function(e) {
        App.totalIncome = 0;
        this.data().forEach(function (d) {
          App.totalIncome += parseInt(d.amount);
        });
        App.totalMoney = App.totalIncome - App.totalExpense;
        $('#home-income').text(kendo.toString(App.totalIncome, "c0"));
        $('#home-expense').text(kendo.toString(App.totalExpense, "c0"));
        $('#home-total').text(kendo.toString(App.totalMoney, "c0"));
      }
    }),
    expense: kendo.data.DataSource.create({
      data:[],
      change: function(e) {
        App.totalExpense = 0;
        this.data().forEach(function (d) {
          App.totalExpense += parseInt(d.amount);
        });
        App.totalMoney = App.totalIncome - App.totalExpense;
        $('#home-income').text(kendo.toString(App.totalIncome, "c0"));
        $('#home-expense').text(kendo.toString(App.totalExpense, "c0"));
        $('#home-total').text(kendo.toString(App.totalMoney, "c0"));
      }
    }),
    schedule: kendo.data.SchedulerDataSource.create({
      data: []
    }),
    target: kendo.data.DataSource.create({
      data: []
    }),
    category: kendo.data.DataSource.create({
      data: []
    }),
    defaultCategories: [
      {
        name: 'Gaji',
        type: 'income'
      },
      {
        name: 'Penghasilan Sampingan',
        type: 'income'
      },
      {
        name: 'Bonus',
        type: 'income'
      },
      {
        name: 'Hadiah',
        type: 'income'
      },
      {
        name: 'Lainnya',
        type: 'income'
      },
      {
        name: 'Belanja',
        type: 'expense'
      },
      {
        name: 'Cicilan',
        type: 'expense'
      },
      {
        name: 'Transportasi',
        type: 'expense'
      },
      {
        name: 'Lainnya',
        type: 'expense'
      }
    ]
  }
});