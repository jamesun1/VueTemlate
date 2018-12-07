<template>
  <div id="main" style="width: 100%;height:400px;"></div>
</template>
<script>
  export default {
    data() {
      return {
        data0: []
      }
    },
    mounted() {
      this.initCharts();
    },
    methods: {
      initCharts() {
        this.$store
          .dispatch("dataSource/getDataSource", "0")
          .then(responese => {
            this.initData(responese);
          })
          .catch(error => {
            this.$message.error({
              message: error.message ? error.message : "操作失败"
            });
          });
        // 使用刚指定的配置项和数据显示图表。

      },
      initData(data) {
        var myChart = this.echarts.init(document.getElementById('main'));
        var upColor = '#ec0000';
        var upBorderColor = '#8A0000';
        var downColor = '#00da3c';
        var downBorderColor = '#008F28';
        this.data0 = this.splitData(data);
        var option = {
          title: {
            text: '指数',
            left: 0
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
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
                  color: upColor,
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
                  ],
                  {
                    name: 'min line on close',
                    type: 'min',
                    valueDim: 'close'
                  },
                  {
                    name: 'max line on close',
                    type: 'max',
                    valueDim: 'close'
                  }
                ]
              }
            },
            {
              name: 'MA5',
              type: 'line',
              data: this.calculateMA(5),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'MA10',
              type: 'line',
              data: this.calculateMA(10),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'MA20',
              type: 'line',
              data: this.calculateMA(20),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
              }
            },
            {
              name: 'MA30',
              type: 'line',
              data: this.calculateMA(30),
              smooth: true,
              lineStyle: {
                normal: { opacity: 0.5 }
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