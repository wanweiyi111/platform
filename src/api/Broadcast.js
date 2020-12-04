import apiBase from './index';

class Broadcast extends apiBase {
    constructor() {
        super()
    }
    /**
     *广播概览列表
     */
    findByProjectIdPaged(data) {
        return this._post('/unions/horn/findByProjectIdPaged', data);
    }
    /**
     *播放开关
     */
    hornOnOff(data) {
        return this._post('/unions/exe/hornOnOff', data);
    }
    /**
     *音量设置
     */
    hornVolume(data) {
        return this._post('/unions/exe/hornVolume', data);
    }
    /**
     *音频库列表
     */
    broadcastMediaQueryList(params, searchData) {
        return this._post(`/unions/media/query/list/${params}`, searchData)
    }
    // 广播--音频库 -上传音频 
    broadcastMediaFileUpload(params, searchData) {
        return this._post(`/unions/media/file/upload/${params}`, searchData)
    }
    // 广播--音频库下载
    broadcastMediaFileDownload(params) {
        return this._get(`/unions/media/file/download/path?id=${params}`)
    }
    // 广播--音频库删除
    broadcastMediaRemove(params) {
        return this._post(`/unions/media/remove`, params)
    }
    /**
     *节目库列表
     */
    broadcastProgramQueryList(params, searchData) {
        return this._post(`/unions/program/query/list/${params}`, searchData)
    }
    // 创建节目
    createMedia(data) {
        return this._post('/unions/program/add', data)
    }
    // 创建节目
    modifiedMedia(data) {
        return this._put('/unions/program/modify', data)
    }
    // 获取节目 预览
    getMediaInfo(params) {
        return this._get(
            `/unions/program/query/${params}`
        )
    }
    // 节目库--节目库删除
    broadProgramRemove(params) {
        return this._post(`/unions/program/remove`, params)
    }
    /**
     *分组列表
     */
    broadcastGroupQueryList(params, searchData) {
        return this._post(`/unions/horn/group/query/list/${params}`, searchData)
    }
    // 广播-分组-新建分组
    broadcastGroupAdd(params) {
        return this._post(`/unions/horn/group/add`, params)
    }
    // 广播-分组--修改分组名
    broadcastGroupModify(params) {
        return this._put('/unions/horn/group/modify', params)
    }
    // 广播-分组--获取没有分组的广播信息
    broadcastListWithoutGroupScreen(params) {
        return this._get(`/unions/horn/group/screenListWithoutGroupScreen?${params}`)
    }
    // 广播-分组--添加广播
    broadcastGroupGlAdd(params) {
        return this._post(`/unions/horn/group/gl/add`, params)
    }
    // 广播-分组--删除指定ID分组信息集合
    broadcastGroupRemove(params) {
        return this._delete(`/unions/horn/group/remove?${params}`)
    }
    // 广播-任务列表
    broadcastTaskQueryList(params, searchData) {
        return this._post(`/unions/task/query/list/${params}`, searchData)
    }
    // 广播-任务-新增任务-获取分组的信息
    broadcastTaskGroupScreen(params) {
        return this._get(
            `/unions/task/query/list/groupInfo?projectId=${params.projectId
            }&taskId=${params.taskId || ''}`
        )
    }
    // 广播-任务-获取媒体列表
    getMediaList(params) {
        return this._get(
            `/unions/task/query/list/programInfo?projectId=${params.projectId
            }&taskId=${params.taskId || ''}`
        )
    }
    // 广播-任务-获取指定任务信息
    broadcastTaskQuery(params) {
        return this._get(`/unions/task/query/${params}`)
    }
    // 广播-任务-新建任务提交数据
    addTask(params) {
        return this._post('/unions/task/add', params)
    }
    // 广播-任务-修改任务提交数据
    editTask(params) {
        return this._put('/unions/task/modify', params)
    }
    // 广播-任务-更改任务状态
    broadcastTaskModifyStatus(params) {
        return this._post(`/unions/task/mod/status`, params)
    }
    // 广播-任务-删除指定ID任务信息集合
    broadcastTaskRemove(params) {
        return this._delete(`/unions/task/remove?${params}`)
    }
}
export default Broadcast;