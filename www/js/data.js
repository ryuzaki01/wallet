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
      online: false,
      data: []
    }),
    target: kendo.data.DataSource.create({
      schema: {
        model: {
          id: "id"
        }
      },
      data: []
    }),
    category: kendo.data.DataSource.create({
      data: [],
      sort: [
        { field: "target", dir: "desc" },
        { field: "id", dir: "asc" }
      ]
    }),
    defaultCategories: [
      {
        id: 1,
        name: 'Gaji',
        type: 'income'
      },
      {
        id: 2,
        name: 'Penghasilan Sampingan',
        type: 'income'
      },
      {
        id: 3,
        name: 'Bonus',
        type: 'income'
      },
      {
        id: 4,
        name: 'Hadiah',
        type: 'income'
      },
      {
        id: 5,
        name: 'Lainnya',
        type: 'income'
      },
      {
        id: 6,
        name: 'Belanja',
        type: 'expense'
      },
      {
        id: 7,
        name: 'Cicilan',
        type: 'expense'
      },
      {
        id: 8,
        name: 'Transportasi',
        type: 'expense'
      },
      {
        id: 9,
        name: 'Lainnya',
        type: 'expense'
      }
    ]
  }
});