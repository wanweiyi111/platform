import http from './http';
import MockAdapter from 'axios-mock-adapter';

import LightList from '@/api/mockdata/light-list.json';
import lightGroupQueryList from '@/api/mockdata/lightGroupQueryList.json';
import LightTask from '@/api/mockdata/light-task.json';
import InfoPublishOverview from '@/api/mockdata/info-publish-overview.json';
import InfoPublishMediaLibrary from '@/api/mockdata/info-publish-media-library.json';
import findByProjectId from '@/api/mockdata/findByProjectId.json';
import findByInfoAndRun from '@/api/mockdata/findByInfoAndRun.json';
import listScreens from '@/api/mockdata/listScreens.json';
import findVideoListByName from '@/api/mockdata/findVideoListByName.json';

// This sets the mock adapter on the default instance
var mock = new MockAdapter(http);

// Mock any GET request to /users
// arguments for reply are (status, data, headers)
mock.onGet('/light-list').reply(200, LightList);
mock.onPost('/light/info/findByProjectId').reply(200, findByProjectId);
mock.onPost('/light/info/findByInfoAndRun').reply(200, findByInfoAndRun);
mock.onGet('/screen/listScreens').reply(200, listScreens);
mock.onGet('/light/group/query/list').reply(200, lightGroupQueryList);
mock.onGet('/light/task/query/list').reply(200, LightTask);
mock.onGet('/info-publish-overview').reply(200, InfoPublishOverview);
mock.onGet('/info-publish-media-library').reply(200, InfoPublishMediaLibrary);
mock.onGet('/video/info/list').reply(200, findVideoListByName);

mock.onAny().passThrough();