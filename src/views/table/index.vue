<template>
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
    <el-row style="margin-top: 1%;">
      <el-col :span="6">胜率{{data.winningRate}}%</el-col>
      <el-col :span="6">最大连出{{data.maxContinue}}</el-col>
      <el-col :span="6">最大遗漏{{data.maxNoContinue}}</el-col>
      <el-col :span="6">当前遗漏{{data.currentNoContinue}}</el-col>
    </el-row>
    <div id="main" style="width: 100%;height:500px;"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data0: [],
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
        data: {
          winningRate: "",
        }
      }
    },
    mounted() {
      this.initCharts();
      this.interval();
    },
    methods: {
      interval() {
        self.setInterval(this.search, 1000 * 60)
      },
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
        var myChart = this.echarts.init(document.getElementById('main'));
        var upColor = '#ec0000';
        var upBorderColor = '#8A0000';
        var downColor = '#00da3c';
        var downBorderColor = '#008F28';
        this.data0 = this.splitData(data.dataList);
        this.$set(this.data, "winningRate", data.winningRate);
        this.$set(this.data, "maxContinue", data.maxContinue);
        this.$set(this.data, "maxNoContinue", data.maxNoContinue);
        this.$set(this.data, "currentNoContinue", data.currentNoContinue);
        var option = {
          title: {
            text: "",
            left: 0
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: []
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
          },
          xAxis: {
            type: 'category',
            data: this.data0.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
          },
          yAxis: {
            scale: true,
            splitArea: {
              show: true
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 50,
              end: 100
            },
            {
              show: true,
              type: 'slider',
              y: '90%',
              start: 50,
              end: 100
            }
          ],
          series: [
            {
              name: '日K',
              type: 'candlestick',
              data: this.data0.values,
              itemStyle: {
                normal: {
                  color: 'transparent',
                  color0: downColor,
                  borderColor: upBorderColor,
                  borderColor0: downBorderColor
                }
              },
              markPoint: {
                label: {
                  normal: {
                    formatter: function (param) {
                      return param != null ? Math.round(param.value) : '';
                    }
                  }
                },
                data: [],
                tooltip: {
                  formatter: function (param) {
                    return param.name + '<br>' + (param.data.coord || '');
                  }
                }
              },
              markLine: {
                symbol: ['none', 'none'],
                data: [
                  [
                    {
                      name: 'from lowest to highest',
                      type: 'min',
                      valueDim: 'lowest',
                      symbol: 'circle',
                      symbolSize: 10,
                      label: {
                        normal: { show: false },
                        emphasis: { show: false }
                      }
                    },
                    {
                      type: 'max',
                      valueDim: 'highest',
                      symbol: 'circle',
                      symbolSize: 10,
                      label: {
                        normal: { show: false },
                        emphasis: { show: false }
                      }
                    }
                  ]
                ]
              }
            },
          ]
        };
        myChart.setOption(option);
      },
      splitData(rawData) {
        var categoryData = [];
        var values = []
        for (var i = 0; i < rawData.length; i++) {
          categoryData.push(rawData[i].splice(0, 1)[0]);
          values.push(rawData[i])
        }
        return {
          categoryData: categoryData,
          values: values
        };
      },
      calculateMA(dayCount) {
        var result = [];
        for (var i = 0, len = this.data0.values.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-');
            continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
            sum += this.data0.values[i - j][1];
          }
          result.push(sum / dayCount);
        }
        return result;
      }
    }
  }
</script>