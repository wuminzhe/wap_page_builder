if (typeof String.prototype.start_with != 'function') {
  String.prototype.start_with = function (str){
    return this.slice(0, str.length) == str;
  };
}

function inspect(e, options) {
  if(options==null){
    options = {};
  }
  var onlykey = options['onlykey']==null ? false : options['onlykey']
  var prefix = options['prefix']==null ? '' : options['prefix']
  var msg = new Array();
  for (prop in e) {
    if(prop.start_with(prefix)){
      if(onlykey==true){
        msg.push(prop);
      }else{
        msg.push(prop + ": " + e[prop]);
      }
    }

  };

  if(onlykey==true){
    alert(msg.join(', '));
  }else{
    alert(msg.join('\n'));
  }

}

function extend(Child, Parent) {
  var F = function(){};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}

function round_by_ten(num) {
  var tmp = Math.round(num/10);
  return [tmp*10, num-tmp*10];
}

function move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        var k = newIndex - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};

function up(arr, indexes) {
    //indexes必须由大到小，所以得排序
    indexes.sort();
    indexes.reverse();
    
    //调换位置
    for( var i=0; i<indexes.length; i++ ) {
        var index = indexes[i];
        move(arr, index, index+1);
    }
    
    //去掉undefined
    var result = new Array();
    for( var i=0; i<arr.length; i++ ) {
        var item = arr[i];
        if( item!=undefined ) {
            result.push(item);
        }
    }
    
    return result;
}

function ceil(arr, indexes) {
  //indexes必须由小到大，所以得排序
  indexes.sort();
  
  //
  for( var i=0; i<indexes.length; i++ ) {
      var index = indexes[i];
      //为什么要index-i，因为每操作一个，都往前挪了一位
      move(arr, index-i, arr.length-1);
  }
  
  return arr;
}

// function down(arr, indexes) {
//     var arrLength = arr.length;
//     arr.reverse();
//     var newIndexes = [];
//     for( var i=0; i<indexes.length; i++ ) {
//         newIndexes.push(arrLength-indexes[i]-1);
//     }
//     var result = up(arr, newIndexes);
//     return result.reverse();
// }

function isType(obj, className){
  if(obj.constructor.toString().indexOf(className)!=-1){
    return true;
  }else{
    return false
  }
}

function sleep(n) {   
  var start = new Date().getTime();   
  while(true) if(new Date().getTime()-start>n) break;   
}   