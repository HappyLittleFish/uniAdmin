<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" >
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')" style="background:#E4343B">
        <!-- <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description" >
          <div class="card-panel-text">今日注册</div>
          <div class="card-panel-num">{{todayData.regCountNow}}</div>
        </div>
         <div class="card-panel-description">
          <div class="card-panel-text">今日登陆</div>
          <div class="card-panel-num">{{todayData.logonNumNow}}</div>
        </div>
         <div class="card-panel-description">
          <div class="card-panel-text">今日订单</div>
          <div class="card-panel-num">{{todayData.orderNumNow}}</div>
        </div>
         <div class="card-panel-description">
          <div class="card-panel-text">今日活跃</div>
          <div class="card-panel-num">{{todayData.dailyActivity}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')" style="background: #36a3f7;">
        <div class="card-panel-description">
          <div class="card-panel-text">昨日注册</div>
          <div class="card-panel-num">{{yesterdayData.yesRegCountNow}}</div>
        </div>
         <div class="card-panel-description">
          <div class="card-panel-text">昨日登陆</div>
          <div class="card-panel-num">{{yesterdayData.yesLogonNumNow}}</div>
        </div>
         <div class="card-panel-description">
          <div class="card-panel-text">昨日订单</div>
          <div class="card-panel-num">{{yesterdayData.yesOrderNumNow}}</div>
        </div>
         <div class="card-panel-description">
          <div class="card-panel-text">昨日活跃</div>
         <div class="card-panel-num">{{yesterdayData.yesDailyActivity}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')" style="background: #f4516c;">
         <p style="font-size:26px;text-align:center;">昨日每日一测</p>
        <div class="card-panel-description">
          <div class="card-panel-text">完成数</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="totalOrderAmount" :duration="3200"></count-to> -->
          <div class="card-panel-num">{{dailyTestFinishNum}}</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">分享数</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="totalOrderAmount" :duration="3200"></count-to> -->
          <div class="card-panel-num">{{dailyTestShareNum}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')" style="background: #40c9c6;">
        <p style="font-size:26px;text-align:center;">昨日RS诊断</p>
        <div class="card-panel-description">
          <div class="card-panel-text">完成数</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="totalOrderAmount" :duration="3200"></count-to> -->
          <div class="card-panel-num">{{diagTestFinishNum}}</div>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">分享数</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="totalOrderAmount" :duration="3200"></count-to> -->
          <div class="card-panel-num">{{diagTestShareNum}}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  // 传值
  props: {
    todayData: {
      type: Object,
      default: 0
    },
    yesterdayData: {
      type: Object,
      default: 0
    },
    dailyTestFinishNum: {
      type: [String, Number],
      default: 0
    },
    dailyTestShareNum: {
      type: [String, Number],
      default: 0
    },
    diagTestFinishNum: {
      type: [String, Number],
      default: 0
    },
    diagTestShareNum: {
      type: [String, Number],
      default: 0
    }
  },
  filters: {
    isValid(val) {
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
    }
  },
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    text-align: center;
    margin-left: 10px;
    margin-right: 10px;
    height: 216px;
    // cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    // background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 10px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin:26px ;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 24px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
