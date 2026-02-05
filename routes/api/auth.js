var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel');
const md5 = require('md5');
const {secret} = require('../../config/config');
const jwt = require('jsonwebtoken');


router.post('/login', (req, res) => {
  let {username, password} = req.body;
  console.log(username, password);
  UserModel.findOne({username: username, password: md5(password)})
  .then(result => {
    if(!result) {
      res.json({
        code: '2002',
        msg: '用户名或密码错误',
        data:null
      });
      return ;
    }

    let token = jwt.sign({
      username: result.username,
      _id: result._id
      }, secret, {
        expiresIn: 60 * 60 * 24 * 7
      });

    res.json({
      code: '0000',
      msg: '登录成功',
      data: token
    });
    
    res.render('success', {msg: '登录成功', url: '/account'});
  }).catch(err => {
    res.status(500).send('登录失败');
    res.json({
      code: '2001',
      msg: '数据库读取失败',
      data:null
    });
  });
});

//退出登录
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

module.exports = router;
