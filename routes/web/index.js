var express = require('express');
var router = express.Router();


const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

let checkLoginMiddleware = require('../../middleware/checkLoginMiddleware');

//记账本列表
router.get('/account', checkLoginMiddleware, function(req, res, next) {
  
  AccountModel.find().sort({time: -1})
    .then(data => {
      res.render('list',{account: data, moment: moment});
    })
    .catch(err => {
      res.status(500).send('读取失败~~');
      return ;
    })
});

//添加记录
router.get('/account/create', checkLoginMiddleware, function(req, res, next) {
  res.render('create');
});

router.post('/account', checkLoginMiddleware, (req, res) => {
  AccountModel.create({
    ...req.body,
    time:moment(req.body.time).toDate() 
  }).then(result => {
    res.render('success', {msg: '添加成功~~', url: '/account'});
  }).catch(err => {
    res.status(500).send('插入失败~~');
    return ;
  })
  
})

router.get('/account/:id', checkLoginMiddleware, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({_id:id})
  .then(reslut => {
    res.render('success', {msg: '删除成功~~', url: '/account'});
  }).catch(err =>{
    res.status(500).send('删除失败~~');
  });
  
})

module.exports = router;
