<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总用户数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="totalUserNum" :duration="2600"></count-to>
          <!-- <div class="card-panel-num">{{totalUserNum}}</div> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总访问数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="totalHits" :duration="3000"></count-to>
          <!-- <div class="card-panel-num">{{totalUserNum}}</div> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总金额数</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="totalOrderAmount" :duration="3200"></count-to> -->
          <div class="card-panel-num">{{totalOrderAmount | isValid}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总订单数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="totalOrderNum" :duration="3200"></count-to>
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
    totalUserNum: {
      type: [String, Number],
      default: 0
    },
    totalHits: {
      type: [String, Number],
      default: 0
    },
    totalOrderNum: {
      type: [String, Number],
      default: 0
    },
    totalOrderAmount: {
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
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
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
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
