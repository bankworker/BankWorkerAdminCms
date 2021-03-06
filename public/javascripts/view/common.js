let loginCookieName = 'bwaLoginUser';
$(document).ready(function () {
  setAlertBell();
  setActiveNav();
  setPaginationStatus();
  addCommonEvent();
  showLoginUser();
});

function setAlertBell() {
  let alertCount = 8;
  if(alertCount > 0){
    $('.icon-bell-alt').addClass('icon-animated-bell');
  }
}

function setActiveNav() {
  let pathname = getActivePath();
  $('.nav-list li.active').removeClass('active');
  $('.nav-list li.open').removeClass('open').removeClass('active');
  let element = $('.nav-list a[href="' + pathname + '"]');
  $(element).parent().addClass('active');
  $(element).parent().parent().parent().addClass('open active');
}

function getActivePath() {
  let pathname = window.location.pathname;
  if(pathname.indexOf('bank/branch') >= 0){
    return '/bank/branch';
  }
  if(pathname.indexOf('bank') >= 0){
    return '/bank';
  }
  if(pathname.indexOf('index') >= 0){
    return '/index';
  }
  if(pathname.indexOf('systemSetting') >= 0){
    return '/systemSetting';
  }
  if(pathname.indexOf('systemAccount') >= 0){
    return '/systemAccount';
  }
  if(pathname.indexOf('order') >= 0){
    return '/order';
  }
  return '';
}

function setPaginationStatus() {
  var currentPageNum = $('#hidden-currentPageNum').val();
  if(currentPageNum !== undefined){
    //设置默认选中的页码
    $('ul.pagination li').each(function () {
      if($.trim($(this).text()) === currentPageNum){
        $(this).addClass('active');
      }
    });

    //设置前一页按钮是否可用
    var firstPageNumber = $.trim($('ul.pagination li').eq(1).text());
    if(currentPageNum === firstPageNumber){
      $('ul.pagination li').eq(0).addClass('disabled');
    }

    //设置后一页按钮是否可用
    var lastPageNumber = $.trim($('ul.pagination li').eq($('ul.pagination li').length - 2).text());
    if(currentPageNum === lastPageNumber){
      $('ul.pagination li').eq($('ul.pagination li').length - 1).addClass('disabled');
    }
  }
}

function addCommonEvent() {
  $('li.logout').click(function () {
    delCookie(loginCookieName);
    location.href = '/';
  });
}

function showLoginUser() {
  let cookie = getCookie(loginCookieName);
  if(cookie !== null){
    let loginUser = JSON.parse(cookie);
    // $('#login-user-photo').attr('src', loginUser.adminPhoto);
    $('li.light-blue span.user-info>span').text(loginUser.adminName);
  }
}

function getLoginUserInfo() {
  var cookie = getCookie(loginCookieName);
  if(cookie !== null){
    return JSON.parse(cookie);
  }

  return '';
}

function getLoginUser() {
  var cookie = getCookie(loginCookieName);
  if(cookie !== null){
    var loginUser = JSON.parse(cookie);
    return loginUser.adminID;
  }

  return 'unknown';
}

function setCookie(name,value) {
  var days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function isDecimal(v) {
  var regu = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  var reg = new RegExp(regu);
  return reg.test(v);
}

function isRate(v) {
  var regu = "^0+[\.][0-9]{0,2}$";
  var re = new RegExp(regu);
  return re.test(v);
}

Date.prototype.format = function (format) {
  var args = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
    var n = args[i];
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
};

function buildUploadRemoteUri(serviceUrl, dirName) {
  let systemName = 'bankWorker';
  return `${serviceUrl}?system=${systemName}&dirName=${dirName}`;
}