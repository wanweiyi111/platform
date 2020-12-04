import _ from 'lodash';
import utils from '@/utils';
import {
  mapState,
  mapMutations
} from "vuex";

export default {
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        current: 1,
        pageSize: 10
      },
      queryObj: {
        projectId: this.projectId
      },
    }
  },
  computed: {
    ...mapState({
      ctrlMsgIds: state => state.ctrlMsgIds,
      projectId: state => state.curProject.id,
      currProject: state => state.curProject,
      currtoken: state => state.token,
      permissions: state => state.userInfo.permissions
    })
  },
  methods: {
    ...mapMutations(['setloginInfo']),
    setPageInfo(res) {
      this.pageInfo = {
        current: res.data.pageNum,
        total: res.data.total,
        pageSize: res.data.pageSize,
        showTotal: (total) => `共 ${total} 条`,
      };
    },
    checkLogin() {
      if (_.isEmpty(this.$store.state.curProject) || !this.$store.state.curProject.id) {
        let loginDataStr = sessionStorage.getItem('loginData');
        if (!loginDataStr) {
          this.backToLogin();
        } else {
          this.setloginInfo(JSON.parse(loginDataStr))
        }
      }
    },
    backToLogin() {
      this.$router.replace({
        path: '/login',
        query: {
          redirect: this.$router.currentRoute.fullPath
        }
      });
    },
    /**
     * 
     * @param {*} deviceObj 
     */
    createMsgId(deviceObj, operType) {
      // return [deviceObj.equipmentType, deviceObj.id, operType].join('-');
      return [deviceObj.equipmentType, deviceObj.id, operType, utils.uuid2(8)].join('-');
    },
    createMsgCodeId(deviceObj, operType) {
      // return [deviceObj.equipmentType, deviceObj.id, operType].join('-');
      return [deviceObj.equipmentType, deviceObj.equipmentCode, operType, utils.uuid2(8)].join('-');
    },
    hasOperate(deviceObj, operType) {
      // return this.ctrlMsgIds.includes(this.createMsgId(deviceObj, operType));
      // debugger;
      let item = '', arr = [];
      for (let i = 0, len = this.ctrlMsgIds.length; i < len; i++) {
        item = this.ctrlMsgIds[i];
        arr = item.split('-');
        if (deviceObj.equipmentType == arr[0] && deviceObj.id == arr[1] && operType == arr[2]) {
          return true;
        }
      }
      return false;
    },
    resetQueryObj() {
      this.queryObj = { projectId: this.projectId };
    },
    resetPageInfo() {
      this.pageInfo = {
        pageNum: 1,
        current: 1,
        pageSize: 10
      };
    }
  }
}