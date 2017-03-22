var express = require('express');
var router = express.Router();

// cache
router.get('/std_consts', gControllers.api_cache.stdConsts);
router.get('/cmp_consts', gControllers.api_cache.cmpConsts);


// no cache
router.get('/nc/user_info', gControllers.api_nocache.userInfo);

module.exports = router;
