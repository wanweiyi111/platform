
<template>
  <div class="lightTabBox">
    <header>
      <ul class="lightTab">
        <li class="monitor active">
          <span class="text">监控</span>
        </li>
        <li class="group">
          <span class="text">媒体库</span>
        </li>
        <li class="task">
          <span class="text">节目库</span>
        </li>
        <li class="report">
          <span class="text">任务</span>
        </li>
      </ul>
      <div class="listCtrl">
        <a-select
          defaultValue="lucy"
          style="width: 200px"
          @change="handleChange"
          :dropdownStyle="dropdownStyle"
          class="select_list"
        >
          <a-select-opt-group>
            <span slot="label">
              <a-icon type="user" />Manager
            </span>
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
          </a-select-opt-group>
          <a-select-opt-group label="Engineer">
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select-opt-group>
        </a-select>
        <a-input-search placeholder="输入关键字" style="width: 200px" @search="onSearch" class="search" />
      </div>
    </header>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const options = [];

export default {
  name: "LightTab",
  data() {
    return {
      dropdownStyle: { "z-index": 9999 }
    };
  },
  methods: {
    onSearch(value) {
      console.log(value);
    },
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.lightTabBox {
  width: 100%;
  padding: 20px;
  background-image: linear-gradient(
    180deg,
    rgba(15, 75, 160, 0.3) 0%,
    rgba(6, 27, 124, 0.2) 67%
  );
  box-shadow: inset 0 0 2px 0 #35b0e6;
  header {
    font-size: 16px;
    color: #ddfdff;
    height: 74px;
    line-height: 74px;
    .lightTab {
      li {
        float: left;
        margin-right: 20px;
        cursor: pointer;
        &.active {
          span {
            &::after {
              content: "";
              display: block;
              height: 5px;
              width: 37px;
              margin-top: -20px;
              background: #6af9fe;
            }
          }
        }
        span {
          display: inline-block;
        }
      }
    }
    .listCtrl {
      float: right;
      margin-left: 15px;
      .select_list {
        width: 76px;
        border: 1px solid #93afcf;
        margin-right: 15px;
        border-radius: 3px;
        color: #bacee4;
      }
      .search {
        border-radius: 3px;
        border: 1px solid #93afcf;
        .ant-input {
          border: 1px solid red;
        }
      }
      &::after {
        content: "";
        display: inline-block;
        clear: both;
      }
    }
  }
  .content {
    background-image: linear-gradient(
      180deg,
      rgba(15, 75, 160, 0.3) 0%,
      rgba(6, 27, 124, 0.2) 67%
    );
    min-height: 300px;
  }
}
</style>
