export default {
  'POST /api/auth': {
    name: 'picsong',
    role: 'admin',
    auth: ['page1', 'page2', 'page3'],
  },
  '/api/base1': (req, res) => {
    const data = {
      success: true,
      data: [
        { top: 1, bottom: 2 },
        { top: 3, bottom: 4 },
        { top: 5, bottom: 6 },
      ],
      errorMessage: '请求成功',
    };
    res.send(data);
  },
  '/api/base2': (req, res) => {
    const data = {
      success: false,
      data: null,
      errorCode: 400,
      errorMessage: '请求参数错误',
      showType: 2,
    };
    res.status(400);
    res.send(data);
  },
};
