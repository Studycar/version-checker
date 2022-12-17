import { MockRequest } from '@delon/mock';

const list = [];
const total = 50;
const baseUrl = '/api/LookupCodeManageService/';

for (let i = 0; i < total; i += 1) {
  list.push({
    Id: i + 1,
    TypeCode: `ACCESSORY_TYPE ${i}`,
    Meaning: `附件类型 ${i}`,
    ApplicationName: '高级计划排程',
    Desc: `附件类型 ${i}`,
    Lng: '简体中文'
  });
}

function genData(params: any) {
  let ret = [...list];
  const pi = +params.pi,
    ps = +params.ps,
    start = (pi - 1) * ps;

  if (params.no) {
    ret = ret.filter(data => data.no.indexOf(params.no) > -1);
  }

  return { total: ret.length, list: ret.slice(start, ps * pi) };
}

function saveData(id: number, value: any) {
  const item = list.find(w => w.id === id);
  if (!item) return { msg: '无效用户信息' };
  Object.assign(item, value);
  return { msg: 'ok' };
}

export const LooupCode = {
  'POST /api/LookupCodeManageService/Search': (req: MockRequest) => list.find(w => w.TypeCode === +req.params.TypeCode),
  'POST /api/LookupCodeManageService/Edit': (req: MockRequest) => saveData(+req.params.id, req.body),
  'POST /api/LookupCodeManageService/GetAllRoles': (req: MockRequest) => list,
  'POST /api/LookupCodeManageService/Remove': (req: MockRequest) => saveData(+req.params.id, req.body),
};
