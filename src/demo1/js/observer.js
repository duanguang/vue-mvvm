/**
 * Created by duanguang on 2017/3/13.
 */

function Observer(data) {
    this.data=data;
    this.walk(data);
}

Observer.prototype={
    walk:function (data) {
        var me=this;
        Object.keys(data).forEach(function (key) {
            me.convert(key,data[key]);
        });
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val);
    },
    defineReactive:function (data,key,val) {
        var dep=new Dep();
        var childObj = observe(val);
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:false,
            get:function () {
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set:function (newVal) {
                if(newVal===val){
                    return;
                }
                console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                dep.notify()
            }
        })
    }
}
function observe(data) {
    if(!data||typeof data!='object'){
        return;
    }

    return new Observer(data);
}

var uid = 0;
function Dep() {
    this.id=uid++;
    this.subs = [];
}

Dep.prototype={
    addSub:function (sub) {//添加订阅者
        console.log(sub);
        this.subs.push(sub);
    },
    depend: function() {
        Dep.target.addDep(this);
    },
    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    notify:function () {//通知更新
        this.subs.forEach(function (sub) {
            sub.update();
        })
    }
}
Dep.target = null;