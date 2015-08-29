import FObject from './FObject';

export default class FGroup extends FObject {
  constructor({x = 0, y = 0, width = 100, height = 100, layer = 0, scaleX = 1, scaleY = 1, angle = 0, background = '#DDDDDD', canvas} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});

    this._children = new Set();
  }

  *[Symbol.iterator](){
    var iter = this._children[Symbol.iterator]();

    var value = iter.next();
    while(!value.done){
      yield value.value;
      value = iter.next();
    }
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    for(let obj of objs){

    }
  }

  remove(objs){

  }

  clear(){

  }

  contains(obj){

  }
}
