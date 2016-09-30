var $ = require('jquery');

var cities = {
  labels: ['省份', '市区'],
  data:   {
    '北京':   '北京',
    '上海':   '上海',
    '天津':   '天津',
    '重庆':   '重庆',
    '河北':   ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市'],
    '山西':   ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
    '台湾':   ['台北市', '高雄市', '基隆市', '台中市', '台南市', '新竹市', '嘉义市', '台北县', '宜兰县', '桃园县', '新竹县', '苗栗县', '台中县', '彰化县', '南投县', '云林县', '嘉义县', '台南县', '高雄县', '屏东县', '澎湖县', '台东县'],
    '辽宁':   ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
    '吉林':   ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
    '黑龙江': ['哈尔滨市', '齐齐哈尔市', '鹤岗市',  '双鸭山市', '鸡西市', '大庆市', '伊春市', '牡丹江市', '佳木斯市', '七台河市', '黑河市', '绥化市', '大兴安岭地区'],
    '江苏':   ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
    '浙江':   ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
    '安徽':   ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '巢湖市', '六安市', '亳州市', '池州市', '宣城市'],
    '福建':   ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
    '江西':   ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
    '山东':   ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
    '河南':   ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '济源市'],
    '湖北':   ['武汉市', '黄石市', '十堰市', '荆州市', '宜昌市', '襄樊市', '鄂州市', '荆门市', '孝感市', '黄冈市', '咸宁市', '随州市', '仙桃市', '天门市', '潜江市', '神农架林区', '恩施土家族苗族自治州'],
    '湖南':   ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
    '广东':   ['广州市', '深圳市', '珠海市', '汕头市', '韶关市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
    '甘肃':   ['兰州市', '金昌市', '白银市', '天水市', '嘉峪关市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
    '四川':   ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
    '贵州':   ['安顺市', '铜仁地区', '毕节地区', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
    '海南':   ['海口市', '三亚市', '五指山市', '琼海市', '儋州市', '文昌市', '万宁市', '东方市', '澄迈县', '定安县', '屯昌县', '临高县', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
    '云南':   ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '思茅市', '临沧市', '文山壮族苗族自治州', '红河哈尼族彝族自治州', '西双版纳傣族自治州', '楚雄彝族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈傈族自治州', '迪庆藏族自治州'],
    '青海':   ['西宁市', '海东地区', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
    '陕西':   ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
    '广西':   ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
    '西藏':   ['拉萨市', '那曲地区', '昌都地区', '山南地区', '日喀则地区', '阿里地区', '林芝地区'], 
    '宁夏':   ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
    '新疆':   ['乌鲁木齐', '克拉玛依市', '石河子市', '阿拉尔市', '图木舒克市', '五家渠市', '吐鲁番市', '阿克苏市', '喀什市', '哈密市', '和田市', '阿图什市', '库尔勒市', '昌吉市', '阜康市', '米泉市', '博乐市', '伊宁市', '奎屯市', '塔城市', '乌苏市', '阿勒泰市'],
    '内蒙':   ['呼和浩特', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '锡林郭勒盟', '兴安盟', '阿拉善盟'],
    '澳门':   [],
    '香港':   []
  }
};

$(document).ready(function() {
  $('#address').popupTabs(cities);

  // create job
  $('form.new-job').validate({
    errorPlacement: function(error, element) {
      error.insertBefore(element);
    },
  });

  CKEDITOR.replace('duty');
  CKEDITOR.replace('requirement');

  // update job
  $('form.edit-job').validate({
    errorPlacement: function(error, element) {
      error.insertBefore(element);
    },
  });

  // apply job
  $('.job-title button').click(function() {
    var me = $(this);

    $.post('/jobs/apply', {
      job_id: me.closest('.job-item').data('jobId')
    }, function(data) {
      me.replaceWith("<span class='apply-result'>已申请</span>")
    });
  });

  // pass or refuse applying
  $('.apply-op button').click(function() {
    var me = $(this);
    var confirm = me.closest('.applier').find('.op-message');
    var message;
    var status;

    me.parent().hide();
    confirm.show();

    if (me.text() == '通过') {
      message = '恭喜你通过审核：';
      status = 2;
    } else {
      message = '很遗憾你暂时不适合这个岗位：';
      status = 1;
    }

    confirm.find('textarea').data('status', status).val(message).focus();
  });

  $('.op-message button:first-child').click(function() {
    var me = $(this);
    var c = $(this).closest('.applier');
    var userId = c.data('userId');
    var jobId  = c.data('jobId');
    var t = me.closest('.op-message').find('textarea');
    var status = t.data('status');
    var message = t.val();

    $.post('/job/' + jobId + '/handle_apply', {
      userId:   userId,
      jobId:    jobId,
      status:   status,
      message:  message
    }, function(data) {
      var resultHtml;

      if (status == 1) {
        resultHtml = "<div class='apply-refused'>已拒绝：" + message + "</div>";
      } else {
        resultHtml = "<div class='apply-passed'>已通过：" + message + "</div>";
      }

      me.closest('.op-message').replaceWith(resultHtml);
    });
  });

  $('.op-message button:last-child').click(function() {
    $(this).closest('.op-message').hide();
    $(this).closest('.applier').find('.apply-op').show();
  });
});
