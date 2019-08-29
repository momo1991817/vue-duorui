import Vue from 'vue'
Vue.prototype.$touchstart = touchstart;
Vue.prototype.$touchmove = touchmove;
Vue.prototype.$touchend = touchend;
Vue.prototype.$pageOne = pageOne;
Vue.prototype.$UrlSearch = UrlSearch;


export function touchstart(e, element) {
  if (document.documentElement.scrollTop == 0 && document.body.scrollTop == 0) {
    document.querySelector(".refreshImg").src = "../../../../static/loading/loading-null.png";
    this.startTop = true;
    this.element = document.querySelector("." + element);
    this.refreshImg = document.querySelector(".refreshImg");
    this.startPos = e.touches[0].pageY;
    this.element.style.position = "relative";
    this.element.style.transition = "transform 0s";
  }
}
export function touchmove(e) {
  if (this.startTop) {
    this.transitionHeight = e.touches[0].pageY - this.startPos;

    if (this.transitionHeight > 0 && this.transitionHeight <= 60) {
      this.element.style.transform =
        "translateY(" + this.transitionHeight + "px)";
    }
    if (this.transitionHeight >= 60) {
      this.element.style.transform =
        "translateY(" + 60 + "px)";
    }
  }
}
export function touchend(e) {
  if (this.startTop) {
    this.element.style.transition = "transform 0.5s ease 1s";
    this.element.style.transform = "translateY(0px)";
    if (this.transitionHeight >= 60) {
      this.refreshImg.src = "../../../../static/loading/loading.gif";
      setTimeout(() => {
        this.artList = [];
        this.getList();
        this.isLoading = false;
        setTimeout(() => {
          this.refreshImg.src = "../../../../static/loading/loading-null.png";
        }, 500);
      }, 500);
    }
    this.transitionHeight = 0;
    this.startTop = false;
  }
}
export function pageOne(element) {
  document.documentElement.scrollTop = document.body.scrollTop = 0;
  setTimeout(() => {
    document.querySelector("." + element).style = "";
    document.querySelector("." + element).style.transform =
      "translateY(" + 60 + "px)";
    document.querySelector(".refreshImg").src =
      "../../../../static/loading/loading.gif";
  }, 10);
  setTimeout(() => {
    document.querySelector("." + element).style.transform =
      "translateY(0px)";
    document.querySelector("." + element).style.transition =
      "transform 0.5s ease 1s";

    setTimeout(() => {
      this.artList = [];
      this.getList();
      this.isLoading = false;
      setTimeout(() => {
        document.querySelector(".refreshImg").src = "../../../../static/loading/loading-null.png";
      }, 200);
    }, 800);
  }, 1000);
}

export function UrlSearch(){
  let name,value,str=location.href,num=str.indexOf("?"); //取得整个地址栏
  str=str.substr(num+1); //取得所有参数 stringvar.substr(start [, length ]
  let arr=str.split("&"); //各个参数放到数组里
  for(let i=0;i < arr.length;i++){
    num=arr[i].indexOf("=");
    if(num>0){
      name=arr[i].substring(0,num);
      value=arr[i].substr(num+1);
      this[name]=value;
    }
  }
  return value
}
