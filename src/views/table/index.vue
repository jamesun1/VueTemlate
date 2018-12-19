<template>
  <div>
    <div>
      <el-select v-model="form.digit" placeholder="请选择位数">
        <el-option v-for="item in digitList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="form.number" multiple collapse-tags placeholder="请选择数字">
        <el-option v-for="item in numList" :key="item.value" :label="item.value" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="form.issue" placeholder="请选择期数">
        <el-option v-for="item in issue" :key="item.value" :label="item.value" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="search" plain>搜索</el-button>
    </div>
    <div id="container" style="min-width:400px;height:500px"></div>
  </div>
</template>
<script>

  // require('../../libs/bollinger-bands')(Highcharts);
  // require('../../libs/drag-panes')(Highcharts);
  // require('../../libs/indicators')(Highcharts);

  export default {
    data() {
      return {
        digitList: [{
          value: "1",
          label: "个位"
        }],
        issue: [{
          value: "10"
        }, {
          value: "50"
        }, {
          value: "100"
        }, {
          value: "200"
        }, {
          value: "300"
        }, {
          value: "500"
        }, {
          value: "1000"
        }, {
          value: "2000"
        }],
        numList: [{
          value: '0',
        }, {
          value: '1',
        }, {
          value: '2',
        }, {
          value: '3',
        }, {
          value: '4',
        }, {
          value: '5',
        }, {
          value: '6',
        }, {
          value: '7',
        }, {
          value: '8',
        }, {
          value: '9',
        }],
        form: {
          digit: "1",
          number: ["0"],
          issue: "50"
        },
      }
    },
    mounted() {
      this.initCharts();
    },
    methods: {
      search() {
        this.initCharts();
      },
      initCharts() {
        this.$store
          .dispatch("dataSource/getDataSource", this.form)
          .then(responese => {
            this.initData(responese);
          })
          .catch(error => {
            this.$message.error({
              message: error.message ? error.message : "操作失败"
            });
          });
      },
      initData(data) {
        debugger
        data = data.dataListTwo;
        this.Highcharts.stockChart('container', {
          rangeSelector: {
            selected: 2
          },
          title: {
            text: '平安银行历史股价分析（ATR 指标分析）'
          },
          legend: {
            enabled: true
          },
          plotOptions: {
            series: {
              showInLegend: true
            }
          },
          tooltip: {
            split: false,
            shared: true
            // backgroundColor: null
          },
          series: [{
            type: 'candlestick',
            id: 'sz000001',
            name: '平安银行',
            data: data
          }, {
            type: 'bb',
            topLine: { // 上轨线
              styles: {
                lineColor: 'blue'
              }
            },
            bottomLine: {  // 下轨线
              styles: {
                lineColor: 'purple'
              }
            },
            color: '#006cee', //中轨颜色
            tooltip: {
              pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                '<b> {series.name}</b><br/>' +
                'UP: {point.top}<br/>' +
                'MB: {point.middle}<br/>' +
                'DN: {point.bottom}<br/>'
            },
            name: '布林（5,2）',
            linkedTo: 'sz000001'
          }]
        });
      }
    }
  }
</script>
<style>
  .highcharts-axis-resizer {
    stroke: #eee;
  }

  .highcharts-axis-resizer:hover {
    stroke: #ccc;
  }

  .highcharts-point-up {
    fill: red;
    stroke: red;
  }

  .highcharts-point-down {
    fill: green;
    stroke: green;
  }
</style>