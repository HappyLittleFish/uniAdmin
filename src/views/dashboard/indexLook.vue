<template>
  <div v-if="loadAllData" style='height:100%'>
    <div class="content_title" style='height:10%'>
      <h3>运营报告分析</h3>
      <p>用于展示当前系统中的统计数据、统计报表及重要实时数据</p>
    </div>
    <PanelGroup :totalUserNum='record.operIndVo.totalUserNum'
    :totalHits='record.operIndVo.totalHits'
    :totalOrderNum='record.operIndVo.totalOrderNum'
    :totalOrderAmount='record.operIndVo.totalOrderAmount'></PanelGroup>
    <div class="echart" style='height:30%'>
      <div class="echart-content">
        <div class="echart-nav-wrapper" v-if="true">
          <ul class="echart-nav">
            <li :class="[echartNavActiveType==='daily_add'?'active-echart-nav-item':'']" @click.prevent="initEchart('daily_add')">新增</li>
            <li :class="[echartNavActiveType==='daily_all'?'active-echart-nav-item':'']" @click.prevent="initEchart('daily_all')">存量</li>
            <li :class="[echartNavActiveType==='daily_active'?'active-echart-nav-item':'']" @click.prevent="initEchart('daily_active')">日活</li>
            <li :class="[echartNavActiveType==='daily_exam'?'active-echart-nav-item':'']" @click.prevent="initEchart('daily_exam')">每日一测</li>
          </ul>
        </div>
        <div class="draw" ref="myCanvas" id="myCanvas" align="">
        </div>
      </div>
    </div>
    <show-group
    :todayData='record.operIndVo'
    :yesterdayData='record.operIndVo'
    :dailyTestFinishNum='record.operIndVo.dailyTestFinishNum'
    :dailyTestShareNum='record.operIndVo.dailyTestShareNum'
    :diagTestFinishNum='record.operIndVo.diagTestFinishNum'
    :diagTestShareNum='record.operIndVo.diagTestShareNum'
    ></show-group>
   
    <!-- <div class="sysMes">
      <div class="cpu">
        <p class="title">服务器信息</p>
        <div class="sys">
          <div>
            <span>操作系统</span>
            <span>java版本</span>
            <span>CPU</span>
            <span>磁盘</span>
          <span>启动时间</span>
          </div>
          <div>
            <span>centos</span>
            <span>1.8.0_151</span>
            <span>5G/8G</span>
            <span>20G/500G</span>
            <span>2018-04-03 14:39:52</span>
          </div>
        </div>
      </div>
      <div class="other">
        <p class="title">其它信息</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import ShowGroup from './components/ShowGroup'
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

export default {
  data() {
    return {
      record: {},
      num: [],
      date: [],
      loadAllData: false,
      myEchart: {},
      echartNavActiveType: 'daily_add'
    }
  },
  components: {
    PanelGroup,
    ShowGroup
  },
  mounted() {
    // this.initEchart()
  },
  filters: {
  },
  created() {
    window.addEventListener('resize', () => {
      this.myEchart.resize({ opts: {
        width: 'auto',
        height: 'auto'
      }})
    })
    this.$nextTick(() => {
      this.initPage().then(() => {
        setTimeout(() => {
          this.initEchart()
        }, 1000)
      })
    })
  },
  methods: {
    moneyFormat(val) {
      // 记录加,分隔符的位置
      let count = 0
      // 转化为Number并保留两位小数
      const value = Number(val).toFixed(2)
      // 取到小数点及以后的数字
      const decimals = value.match(/\.[0-9]*/g)
      // 取到整数位
      const integer = parseInt(value).toString()
      const money = []
      const length = integer.split('').length
      console.log(integer.split(''))
      for (let n = length - 1; n >= 0; n--, count++) {
        if (count && count % 3 === 0) {
          money.unshift(',')
          count = 0
        }
        money.unshift(integer.split('')[n])
      }
      return money.join('').concat(decimals)
    },
    initPage() {
      return new Promise(resolve => {
        this.$axios.post('management/operationMsg').then(response => {
          if (response === null) return
          // console.log('指标数据是', response)
          this.record = response.data
          this.loadAllData = true
          // this.num = []
          // this.date = []
          // for (let key in this.record.dailyNewUsers) {
          //   this.num.unshift(this.record.dailyNewUsers[key].num)
          //   this.date.unshift(this.record.dailyNewUsers[key].date)
          // }
          resolve()
        })
      })
    },
    initEchart(type = 'daily_add') {
      this.echartNavActiveType = type
      this.$axios.post('management/operationChartMsg?day=30&modul=' + type).then(response => {
        if (response === null) return
        // console.log('图表数据为', response)
        var data = response.data.chart
        var dateList = []
        var valueList = []
        for (let i = 0; i < data.length; i++) {
          dateList.unshift(data[i].date)
          if (type === 'daily_active') {
            valueList.unshift(data[i].num.replace('%', ''))
          } else {
            valueList.unshift(data[i].num)
          }
        }
        const myEchart = echarts.init(document.getElementById('myCanvas'))
        this.myEchart = myEchart
        var option = {
          // Make gradient line here
          color: ['#61a0a8'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          xAxis: [
            {
              name: '时间',
              type: 'category',
              splitLine: {
                show: false
              },
              axisTick: { show: false },
              axisLine: {
                symbol: ['none', 'arrow'],
                lineStyle: {
                  color: '#333'
                }
              },
              data: dateList
            }
          ],
          yAxis: [
            {
              // name: '百分比',
              type: 'value',
              splitLine: {
                show: false
              }
              // axisTick: { show: false }
              // axisLine: {
              //   symbol: ['none', 'arrow'],
              //   lineStyle: {
              //     color: '#888'
              //   }
              // }
              // axisLabel: {
              //   formatter: () => {
              //     return ''
              //   }
              // }
            }
          ],
          grid: [
            {
              bottom: '10%'
            }
          ],
          series: [
            {
              smooth: true,
              type: 'line',
              showSymbol: false,
              data: valueList,
              areaStyle: {}
            }
          ]
        }
        myEchart.setOption(option)
      })
    }
  }

}
</script>

<style scoped>
.content_title {
  padding: 10px 0 20px 20px;
  background: #d2d2d2;
}
.content {
  display: flex;
  display: -webkit-flex;
  margin-top: 40px;
  margin-bottom: 40px;
  justify-content: space-around;
}
.echart-content {
  margin-top: -20px;
  display: flex;
  flex-direction: row;
  width: 75%;
  margin-left: 0px;
}
.echart-nav-wrapper {
  width: 15%;
  z-index: 1000;
}
.echart-nav {
  margin: 55px 0 0 0px;
  z-index: 100;
}
.echart-nav li {
  text-align: center;
  padding: 6px;
  margin-top: 6px;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #ccc;
  color: #fff;
}
.echart-nav .active-echart-nav-item {
  background-color: #ff4057;
}
.contents {
  width: 20%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.yesterday {
  margin-top: 25px;
  margin-left: 20px;
}

.today,
.loginData {
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
}
.loginData {
  margin-top: 50px;
}
.width40 {
  width: 15%;
  height: 60px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
}
.iconType {
  width: 60px;
  color: white;
  line-height: 70px;
  text-align: center;
  border-radius: 10px;
  /*background-color: red;*/
}
.iconFont {
  display: flex;
  width: 100px;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
.font40 {
  font-size: 30px;
}
.font50 {
  font-size: 50px;
}
.record {
  width: 140px;
  height: 60px;
  display: flex;
  display: -webkit-flex;
  margin-top: 10px;
  justify-content: center;
}
.echart {
  display: flex;
  display: -webkit-flex;
  width: 100%;
  justify-content: center;
}
.card {
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
}
.dt {
  width: 20%;
  height: 170px;
  background-color: red;
  border-radius: 10px;
  margin-top: 40px;
}
  .title {
    color: #fff;
    font-size: 18px;
    padding: 25px 0 0 25px;
    font-weight: 600;
  }
  .complete {
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;
    margin-top: 30px;
    font-size: 16px;
  }
.sysMes {
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  margin-top: 40px;
}
  .other {
    width: 45%;
    height: 170px;
    border-top: 4px solid #777777;
  }
.draw {
  width: 90%;
  height: 220px;
  z-index: 99;
}
</style>
