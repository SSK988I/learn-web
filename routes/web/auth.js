var express = require('express');
var router = express.Router();
const UserModel = require('../../models/UserModel');
const md5 = require('md5');

router.get('/', (req, res) => {
  res.redirect('/account');
})

//注册
router.get('/reg', (req, res) => {
  res.render('auth/reg');
});

router.post('/reg', (req, res) => {
  UserModel.create({...req.body, password: md5(req.body.password)})
  .then(result => {
    res.render('success', {msg: '注册成功', url: '/login'});
  }).catch(err => {
    res.status(500).send('注册失败');
  });
});

//登录
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;
  console.log(username, password);
  UserModel.findOne({username: username, password: md5(password)})
  .then(result => {
    if(!result) {
      return res.send('账号或密码错误')
    }
    req.session.username = result.username;
    req.session._id = result._id;
    
    res.render('success', {msg: '登录成功', url: '/account'});
  }).catch(err => {
    res.status(500).send('登录失败');
  });
});

//退出登录
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('success', {msg: '退出成功', url: '/login'});
  })
});

module.exports = router;
