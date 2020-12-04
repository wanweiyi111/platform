import apiBase from './index';
// 权限管理接口
class Power extends apiBase {
  constructor() {
    super()
  }
  // 登录
  login(data) {
    return this._post('/token/logon/login', data);
  }
  // 退出
  logout() {
    return this._get('/token/logon/logout');
  }

  // 用户--------------------------------------START---------------------------------------------------------------
  // 用户管理页面列表
  powerUserQueryList(params) {
    return this._get(`/token/user/query/list/${params}`);
  }

  // 用户管理获取关联项目
  powerUserQueryProjectList() {
    return this._get(`/token/project/query/list`);
  }

  // 户管理获取关联角色
  powerUserQueryRoleList() {
    return this._get(`/token/role/query/list`);
  }

  // 用户管理获取关联部门
  powerUserQueryDeptList() {
    return this._get(`/token/dept/query/list`);
  }

  // 用户管理删除列表信息
  powerUserDeleteUserList(params) {
    return this._delete(`/token/user/deleteUser?${params}`);
  }

  // 用户管理新建用户
  powerUserAddUser(data) {
    return this._post(`/token/user/addUser`, data);
  }

  // 用户管理修改个人信息
  powerUserUpdateUser(data) {
    return this._post(`/token/user/updateUser`, data);
  }

  // 获取用户关联项目的设备权限
  powerGetProjectDevice(params) {
    return this._get(`/token/menu/query/getProjectDevice?${params}`);
  }
  // 根据项目获取设备信息
  powerFindAllEquipments(data) {
    return this._post(`/pole/equipment/findAllEquipments`, data);
  }

  // 添加设备权限
  powerAddProjectDevice(data) {
    return this._post(`/token/menu/addProjectDevice`, data);
  }
  //角色--------------------------------------START---------------------------------------------------------------
  // 角色管理页面列表
  powerRoleQueryList() {
    return this._get(`/token/role/query/list`);
  }
  //角色管理删除列表信息
  powerRoleDeledtRole(params) {
    return this._delete(`/token/role/deleteRole?${params}`);
  }
  //角色管理新建角色
  powerRoleAddRole(data) {
    return this._post(`/token/role/addRole`, data);
  }
  //根据角色ID获取权限信息
  powerGetRoleById(data) {
    return this._post(`/token/role/query/getRolePermissionById`, data);
  }
  //查看权限信息
  powerCheckRolePermissionById(data) {
    return this._post(`/token/role/query/checkRolePermissionById`, data);
  }
  //更新角色
  powerRoleUpdateRole(data) {
    return this._post(`/token/role/updateRole`, data);
  }
  //获取角色权限全量页面菜单列表
  powerQueryPoleTreeList() {
    return this._get(`/token/menu/query/poleTreeList`);
  }




  //栏目---------------------------------------START--------------------------------------------------------------

  // 栏目管理页面列表
  powerColumnQueryTreeList() {
    return this._get(`/token/menu/query/treeList`);
  }

  // 栏目管理页面菜单列表
  powerColumnQueryList() {
    return this._get(`/token/menu/query/list`);
  }

  // 栏目管理新建栏目
  powerColumnAddPermission(data) {
    return this._post(`/token/menu/addPermission`, data);
  }
  // 栏目管理编辑栏目
  powerColumnUpdateMenu(data) {
    return this._put(`/token/menu/updateMenu`, data);
  }
  //栏目管理页面删除
  powerColumnDeletePermission(params) {
    return this._delete(`/token/menu/deletePermission?${params}`);
  }

  // 栏目管理添加权限控制获取当前栏目权限信息
  powerQueryMethodPermissionList(params, data) {
    return this._post(`/token/menu/queryMethodPermissionList/${params}`, data);
  }


  //项目---------------------------------------START--------------------------------------------------------------

  // 项目管理页面列表
  powerProjectQueryList(params) {
    return this._get(`/token/project/queryList/${params}`);
  }
  // 项目管理删除列表信息
  powerProjectDeleteProject(params) {
    return this._delete(`/token/project/deleteProject?${params}`);
  }

  // 项目管理新建用户
  powerProjectAddProject(data) {
    return this._post(`/token/project/addAuProject`, data);
  }

  // 项目管理修改个人信息
  powerProjectUpdateProject(data) {
    return this._post(`/token/project/updateProject`, data);
  }
  //-----------------------------------------------------------------------------------------------------
}

export default Power;