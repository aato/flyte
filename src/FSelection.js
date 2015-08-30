import FGroup from './FGroup';

export default class FSelection extends FGroup{
  constructor({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas, children} = {}){
    super({x, y, width, height, layer, scaleX, scaleY, angle, background, canvas});
  }

  _updatePositionAndDimensions(){
    var leftMost = undefined;
    var rightMost = undefined;
    var topMost = undefined;
    var bottomMost = undefined;

    for(let child of this){
      let childWorldBB = child.getWorldBoundingBox();
      for(let point of childWorldBB){
        if(!leftMost) leftMost = point.x;
        if(!rightMost) rightMost = point.x;
        if(!bottomMost) bottomMost = point.y;
        if(!topMost) topMost = point.y;

        leftMost = point.x < leftMost ? point.x : leftMost;
        rightMost = point.x > rightMost ? point.x : rightMost;
        topMost = point.y < topMost ? point.y : topMost;
        bottomMost = point.y > bottomMost ? point.y : bottomMost;
      }
    }

    this._position.x = leftMost || this._position.x;
    this._position.y = topMost || this._position.y;
    this._width =  leftMost && rightMost ? (rightMost - leftMost) : 0;
    this._height = bottomMost && topMost ? (bottomMost - topMost) : 0;

    this._calculateCenter();
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var toAdd = [];

    for(let obj of objs){
      // If it belongs to a different scene, ignore it.
      if(obj.getScene() !== this._scene) continue;

      toAdd.push(obj);
    }

    var addedObjs = super.add(toAdd);
    for(let obj of addedObjs){
      obj.setSelector(this);
    }

    this._updatePositionAndDimensions();

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = super.remove(objs);
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    this._updatePositionAndDimensions();

    return removedObjs;
  }

  clear(){
    var removedObjs = super.clear();
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    this._updatePositionAndDimensions();

    return removedObjs;
  }




























}
