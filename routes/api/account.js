const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

let checkTokenMiddleware = require('../../middleware/checkTokenMiddleware');

//记账本列表
router.get('/account', checkTokenMiddleware, function(req, res, next) {
  console.log(req.user);
  AccountModel.find().sort({time: -1})
    .then(data => {
      res.json({
        //响应编号
        code: '0000',
        //响应信息
        msg: '读取成功',
        //响应数据
        data: data
      });
    })
    .catch(err => {
      res.json({
        code: '1001',
        msg: '读取失败',
        data: null
      });
      return ;
    })
});



router.post('/account', checkTokenMiddleware, (req, res) => {
  AccountModel.create({
    ...req.body,
    time:moment(req.body.time).toDate() 
  }).then(result => {
    res.json({
      code: '0000',
      msg:'创建成功',
      data: result
    });
  }).catch(err => {
    res.json({
      code: '1002',
      msg: '创建失败',
      data: null
    });
    return ;
  })
  
})

router.delete('/account/:id', checkTokenMiddleware, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({_id:id})
  .then(reslut => {
    res.json({
      code: '0000',
      msg: '删除成功',
      data:{}
    });
  }).catch(err =>{
    res.json({
      code: '1003',
      msg: '删除失败',
      data: null
    });

  });
  
})

//获取单个账单信息
router.get('/account/:id', checkTokenMiddleware, (req, res) => {
  //获取id参数
  let {id} = req.params;
  //查询数据库
  //console.log(res);
  AccountModel.findById(id)
  .then(result => {
    res.json({
      code: '0000',
      msg: '读取成功',
      data: result
    });
    
  }).catch(err => {
    
    res.json({
      
      code: '1004',
      msg: '读取失败',
      data: null
    });
  });
});

//更新单个账单信息

router.patch('/account/:id', checkTokenMiddleware, (req, res) => {
  let {id} = req.params;
  AccountModel.updateOne({_id: id}, req.body)
  .then(result => {
   
    AccountModel.findById(id)
    .then(result => {
      res.json({
        code: '0000',
        msg: '修改成功',
        data: result
      });
    }).catch(err => {
      res.json({
        
        code: '1004',
        msg: '读取失败',
        data: null
      });
    })
  }).catch(err => {
    res.json({
      code: '1005',
      msg: '修改失败',
      data: null
    });
  });
});


module.exports = router;
