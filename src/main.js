import Vue from 'vue';
import {
  TimePicker,
  DatePicker,
  Modal,
  Upload,
  Button,
  message,
  Row,
  Col,
  Input,
  InputNumber,
  Switch,
  Slider,
  Dropdown,
  Select,
  Table,
  Tabs,
  Icon,
  Menu,
  Collapse,
  Form,
  Tree,
  TreeSelect,
  Pagination,
  Divider,
  Spin,
  Radio,
  Checkbox,
  Popover,
  Transfer,
  Cascader,
  AutoComplete,
  Card,
  Skeleton,
  Empty,
  Badge,
  Breadcrumb,
  Descriptions,
} from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueBus from 'vue-bus';
import VueAreaLinkage from "vue-area-linkage";
import './filters';
import './registerServiceWorker';
import '@/styles/amap-reset.less';
import '@/styles/common.less';
import '@/assets/webfonts/iconfont.css';
import '@/styles/customStyle.less';
Vue.use(VueBus);
Vue.use(VueAreaLinkage)

Vue.config.productionTip = false;
Vue.component(Descriptions.name, Descriptions);
Vue.component(Descriptions.Item.name, Descriptions.Item);
Vue.component(Breadcrumb.name, Breadcrumb);
Vue.component(Breadcrumb.Item.name, Breadcrumb.Item);
Vue.component(Badge.name, Badge);
Vue.component(Empty.name, Empty);
Vue.component(Skeleton.name, Skeleton);
Vue.component(Card.name, Card);
Vue.component(Icon.name, Icon);
Vue.component(AutoComplete.name, AutoComplete);
Vue.component(Transfer.name, Transfer);
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Menu.SubMenu.name, Menu.SubMenu)
Vue.component(Button.name, Button);
Vue.component(Button.Group.name, Button.Group);
Vue.component(Upload.name, Upload);
Vue.component(Upload.Dragger.name, Upload.Dragger);
Vue.component(DatePicker.name, DatePicker);
Vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker)
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
Vue.component(TimePicker.name, TimePicker);
Vue.component(Row.name, Row);
Vue.component(Modal.name, Modal);
Vue.component(Col.name, Col);
Vue.component(Table.name, Table);
Vue.component(Dropdown.name, Dropdown);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Select.OptGroup.name, Select.OptGroup);
Vue.component(Input.name, Input);
Vue.component(Input.Search.name, Input.Search);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Switch.name, Switch);
Vue.component(Slider.name, Slider);
Vue.component(Tabs.name, Tabs);
Vue.component(Tabs.TabPane.name, Tabs.TabPane);
Vue.component(Input.Group.name, Input.Group);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Collapse.name, Collapse);
Vue.component(Collapse.Panel.name, Collapse.Panel);
Vue.component(Form.name, Form);
Vue.component(Form.Item.name, Form.Item);
Vue.component(Tree.name, Tree);
Vue.component(TreeSelect.name, TreeSelect);
Vue.component(Tree.TreeNode.name, Tree.TreeNode);
Vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode);
Vue.component(Pagination.name, Pagination);
Vue.component(Divider.name, Divider);
Vue.component(Spin.name, Spin);
Vue.component(Radio.name, Radio);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Checkbox.Group.name, Checkbox.Group);
Vue.component(Popover.name, Popover);
Vue.component(Cascader.name, Cascader);
Vue.prototype.$message = message;
Vue.prototype.$modal = Modal;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');