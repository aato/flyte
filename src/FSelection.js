import FGroup from './FGroup';

export default class FSelection extends FGroup{
  constructor({x, y, width = 0, height = 0, scaleX, scaleY, angle, background, canvas, outlineStyle = 'black', outlineWidth = 2, outlineDash = [], transparency = 0} = {}){
    super({x, y, width, height, layer: Number.MAX_SAFE_INTEGER - 1, scaleX, scaleY, angle, background, canvas});
    if(!x) this._position.x = undefined;
    if(!y) this._position.y = undefined;

    this._outlineStyle    = outlineStyle;
    this._outlineWidth    = outlineWidth;
    this._outlineDash     = outlineDash;
    this._transparency    = transparency;

    this._dragged         = false;

    this._ctx.globalAlpha = this._transparency;
  }

  _onMouseDown(e){
    // console.log('mousedown on selection!');
  }

  _onMouseUp(e){
    this.setDragged(false);
    this._scene.setFlag('canvasDirty', true);
  }

  _onMouseMove(e){
    if(this.getSize() > 0 && e.flyte.mouse.cur.down){
      this.setDragged(true);

      let pos = this.getPosition();
      if(this.setPosition({x: pos.x + e.flyte.mouse.delta.x, y: pos.y + e.flyte.mouse.delta.y})){
        this._scene.setFlag('canvasDirty', true);
      }
    }
  }

  setDragged(dragged){
    this._dragged = dragged;
  }

  getDragged(){
    return this._dragged;
  }

  _draw(ctx){
    super._draw(ctx);

    ctx.save();

      ctx.translate(this._center.x, this._center.y);
      ctx.scale(this._scale.x, this._scale.y);
      ctx.rotate(this._rotation * Math.PI/180);

      ctx.setLineDash(this._outlineDash);
      ctx.lineWidth = this._outlineWidth;
      ctx.strokeStyle = this._outlineStyle;

      ctx.beginPath();
      ctx.rect(-this._width / 2, -this._height / 2, this._width, this._height);
      ctx.stroke();

    ctx.restore();
  }

  getOutlineDash(){
    return this._outlineDash;
  }

  getOutlineWidth(){
    return this._outlineWidth;
  }

  getOutlineStyle(){
    return this._outlineStyle;
  }

  _updatePositionAndDimensions(){
    var leftMost = undefined;
    var rightMost = undefined;
    var topMost = undefined;
    var bottomMost = undefined;

    for(let child of this){
      let childWorldBB = child.getWorldBoundingBox();
      for(let point of childWorldBB){
        if(leftMost === undefined) leftMost = point.x;
        if(rightMost === undefined) rightMost = point.x;
        if(bottomMost === undefined) bottomMost = point.y;
        if(topMost === undefined) topMost = point.y;

        leftMost = point.x < leftMost ? point.x : leftMost;
        rightMost = point.x > rightMost ? point.x : rightMost;
        topMost = point.y < topMost ? point.y : topMost;
        bottomMost = point.y > bottomMost ? point.y : bottomMost;
      }
    }

    var newX = leftMost !== undefined ? leftMost : this._position.x;
    var newY = topMost !== undefined ? topMost : this._position.y;
    var newWidth = leftMost !== undefined && rightMost !== undefined ? (rightMost - leftMost) : 0;
    var newHeight = bottomMost !== undefined && topMost !== undefined ? (bottomMost - topMost) : 0;

    this.setPosition({x: newX, y: newY});
    this.setDimensions({width: newWidth, height: newHeight});

    this._calculateCenter();
  }

  setPosition({x = this._position.x, y = this._position.y, layer = this._position.layer} = {}){
    var originalX = this._position.x !== undefined ? this._position.x : x;
    var originalY = this._position.y !== undefined ? this._position.y : y;

    var selectionPosChanged = super.setPosition({x, y, layer});
    if(!selectionPosChanged) return false;

    var dx = this._position.x - originalX;
    var dy = this._position.y - originalY;

    for(let child of this){
      let childPosition = child.getPosition();
      let childX = childPosition.x;
      let childY = childPosition.y;

      child.setPosition({x: childX + dx, y: childY + dy}, true);
    }

    return true;
  }

  setDimensions({width = this._width, height = this._height} = {}){
    var selectionDimChanged = super.setDimensions({width, height});
    if(!selectionDimChanged) return false;

    this._ctx.globalAlpha = this._transparency;

    // TODO: Scale all children, figure it out...
    return true;
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

    this._position.x = undefined;
    this._position.y = undefined;
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

    this._position.x = undefined;
    this._position.y = undefined;
    this._updatePositionAndDimensions();

    return removedObjs;
  }

  clear(){
    var removedObjs = super.clear();
    for(let obj of removedObjs){
      obj.setSelector(undefined);
    }

    this._position.x = undefined;
    this._position.y = undefined;
    this._updatePositionAndDimensions();

    return removedObjs;
  }
}
