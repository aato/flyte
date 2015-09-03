import FGroup from './FGroup';
import FSelection from './FSelection';
import FGroupMember from './FGroupMember';

export default class FScene extends FGroup{
  constructor({canvas, width = 600, height = 300} = {}){
    super({canvas, width, height, layer: Number.MIN_SAFE_INTEGER});

    this._mouse = {
      prev:{
        x: undefined,
        y: undefined,
        down: undefined
      },
      cur:{
        x: undefined,
        y: undefined,
        down: undefined
      },
      delta:{
        x: undefined,
        y: undefined
      }
    }

    this._mouseSelectionTransparency = 0.8;
    this._mouseSelectionFillStyle = "#D1D1FF";

    this._nextID = (
      () => {
        var index = 0;

        return () => {
          return index++;
        }
    })();

    this.setID(this._nextID())
    this.setScene(this);

    this._selection = new FSelection();
    this._selection.setID(this._nextID());
    this._selection.setScene(this);

    this._drawOrder = [];
    this._flags.drawOrderDirty = true;

    // Allows us to listen for keydown/up event
    this._c.tabIndex = Number.MAX_SAFE_INTEGER;
    // Prevents canvas from being outlined.
    this._c.style.outline = "none";

    this.addEventListener('onmousedown' , this._onMouseDown);
    this.addEventListener('onmouseup'   , this._onMouseUp);
    this.addEventListener('onclick'     , this._onClick);
    this.addEventListener('ondblclick'  , this._onDoubleClick);
    this.addEventListener('onmousemove' , this._onMouseMove);
    this.addEventListener('onmouseout'  , this._onMouseOut);
    this.addEventListener('onkeydown'   , this._onKeyDown);
    this.addEventListener('onkeyup'     , this._onKeyUp);

    this._request = requestFrame('request').bind(window);
    this._cancel = requestFrame('cancel').bind(window);

    this._draw = this.draw.bind(this, this._ctx);
    this._requestID = this._request(this._draw);
  }

  getSelection(){
    return this._selection;
  }

  add(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var toAdd = [];

    for(let obj of objs){
      // If it already belongs to a scene, ignore it.
      if(obj.getScene() && obj.getID()) continue;

      toAdd.push(obj);
    }

    var addedObjs = super.add(toAdd);
    for(let obj of addedObjs){
      // Assign the object a unique ID within the scene.
      obj.setID(this._nextID());
      // Assign this scene to the object.
      obj.setScene(this)
    }

    if(addedObjs.length > 0){
      this._calculateDrawOrder();
      this.setFlag('canvasDirty', true);
    }

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = super.remove(objs);
    var removedSelections = this._selection.remove(objs);
    for(let obj of removedObjs){
      // Remove this object's ID.
      obj.setID(undefined);
      // Remove this scene from this object.
      obj.setScene(undefined)
    }

    if(removedObjs.length > 0){
      this._calculateDrawOrder();
      this.setFlag('canvasDirty', true);
    }

    return removedObjs;
  }

  clear(){
    var removedObjs = super.clear();
    var removedSelections = this._selection.clear();
    for(let obj of removedObjs){
      // Remove this object's ID.
      obj.setID(undefined);
      // Remove this scene from this object.
      obj.setScene(undefined)
    }

    if(removedObjs.length > 0){
      this._calculateDrawOrder();
      this.setFlag('canvasDirty', true);
    }

    return removedObjs;
  }

  select(objs){
    var selectedObjs = this._selection.add(objs);

    if(selectedObjs.length > 0){
      this._calculateDrawOrder();
      this.setFlag('canvasDirty', true);
    }

    return selectedObjs;
  }

  unselect(objs){
    var unselectedObjs = [];

    if(!objs){
      unselectedObjs = this._selection.clear();
    } else {
      unselectedObjs = this._selection.remove(objs);
    }

    if(unselectedObjs.length > 0){
      this._calculateDrawOrder();
      this.setFlag('canvasDirty', true);
    }

    return unselectedObjs;
  }

  _calculateDrawOrder(){
    var sceneObjs = Array.from(this._children);
    if(this._selection.getSize() > 0){
      sceneObjs.push(this._selection);
    }

    this._drawOrder = sceneObjs.sort((a, b) => {
      return a.getPosition().layer - b.getPosition.layer;
    })
  }









  _dispatchEvent(eventType, e, fn){
    var {x, y} = this._getMouseCoords(e);

    this._mouse.prev = {
      x: this._mouse.cur.x ? this._mouse.cur.x : x,
      y: this._mouse.cur.y ? this._mouse.cur.y : y,
      down: this._mouse.cur.down ? Object.assign({}, this._mouse.cur.down) : undefined
    }

    this._mouse.cur.x = x;
    this._mouse.cur.y = y;

    this._mouse.cur = {
      x,
      y,
      down: this._mouse.cur.down ? Object.assign({}, this._mouse.cur.down) : undefined
    }

    if(eventType === 'onmousedown'){
      this._mouse.cur.down = {x, y};
    } else if(eventType === 'onmouseup'){
      this._mouse.cur.down = undefined;
    }

    this._mouse.delta = {
      x: this._mouse.cur.x - this._mouse.prev.x,
      y: this._mouse.cur.y - this._mouse.prev.y
    }

    e.flyte = {mouse: {}};
    Object.assign(e.flyte.mouse, this._mouse);

    // If the mouse is pressed down and the mouse has been moved since last frame.
    if(this._mouse.cur.down && (this._mouse.delta.x > 0 || this._mouse.delta.y > 0)){
      this.setFlag('canvasDirty', true);
    }
      this.setFlag('canvasDirty', true);

    // Has the mouse hit anything? Sort by highest to lowest layer.
    var topObj;
    if(eventType === 'onmousemove'){
      topObj = this.getTopObj(this._mouse.prev.x, this._mouse.prev.y);
    } else {
      topObj = this.getTopObj(this._mouse.cur.x, this._mouse.cur.y);
    }
    // Optional callback function.
    if(fn) fn(e, topObj);

    if(topObj){
      topObj.trigger(eventType, e);
    }
  }

  getTopObj(x, y){
    return this.hitTest({x, y}).sort((a,b) => {
      return b.getPosition().layer - a.getPosition().layer
    })[0];
  }

  _onMouseDown(e){
    this._dispatchEvent('onmousedown', e, (e, topObj) => {
      if(!topObj) {
        this.unselect();
      }
    });
  }

  _onMouseUp(e){
    this._dispatchEvent('onmouseup', e, (e, topObj) => {
      if(this._selection.getSize() === 0){
        let selectionArea = {
          x: this._mouse.cur.x,
          y: this._mouse.cur.y,
          width: this._mouse.cur.x - this._mouse.prev.down.x,
          height: this._mouse.cur.y - this._mouse.prev.down.y
        }

        if(selectionArea.width < 0){
          selectionArea.x = this._mouse.prev.down.x;
          selectionArea.width *= -1;
        }
        if(selectionArea.height < 0){
          selectionArea.y = this._mouse.prev.down.y;
          selectionArea.height *= -1;
        }

        // console.log(selectionArea.x, selectionArea.y);
        // console.log(selectionArea.width, selectionArea.height);

        let objsToSelect = super.hitTest(selectionArea);
        if(objsToSelect.length > 0){
          this.select(objsToSelect);
        }
      }

      if(this._mouse.cur.x !== this._mouse.prev.down.x || this._mouse.cur.y !== this._mouse.prev.down.y){
        this.setFlag('canvasDirty', true);
      }
    });
  }

  _onClick(e){
    this._dispatchEvent('onclick', e);
  }

  _onDoubleClick(e){
    this._dispatchEvent('ondblclick', e);
  }

  _onMouseMove(e){
    this._dispatchEvent('onmousemove', e);
  }

  _onMouseOut(e){
    this._dispatchEvent('onmouseout', e);
  }

  _onKeyDown(e){
    this._dispatchEvent('onkeydown', e);
  }

  _onKeyUp(e){
    this._dispatchEvent('onkeyup', e);
  }

  draw(ctx){
    super.draw(ctx);

    this._request(this._draw);
  }

  _render(){
    // console.log('SCENE RENDER');

    this._ctx.save();
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._ctx.fillStyle = this._background;
      this._ctx.fillRect(0, 0, this._width, this._height);

      if(this._flags.drawOrderDirty){
        this._calculateDrawOrder();
        this.setFlag('drawOrderDirty', false);
      }

      for(let child of this._drawOrder){
        child.draw(this._ctx);
      }

      if(this._mouse.cur.down && this._selection.getDragged() === false){
        this._renderMouseSelection(this._ctx);
      }

    this._ctx.restore();
  }

  _renderMouseSelection(ctx){
    var width = this._mouse.cur.x - this._mouse.cur.down.x;
    var height = this._mouse.cur.y - this._mouse.cur.down.y;

    ctx.save();
      ctx.globalAlpha = this._mouseSelectionTransparency;
      ctx.fillStyle = this._mouseSelectionFillStyle;
      ctx.fillRect(this._mouse.cur.down.x, this._mouse.cur.down.y, width, height);
    ctx.restore();
  }

  _getMouseCoords(e){
    var rect = this._c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return {x, y};
  }

  addEventListener(eventType, fn){
    var addedEventType = super.addEventListener(eventType, fn);

    this._c[addedEventType] = this._events.get(addedEventType);
  }

  hitTest({x, y, width, height, ignore = []} = {}){
    var hitObjs = [];

    var shouldIgnore = (obj) => {
      for(var _class of ignore){
        if(obj instanceof _class){
          return true;
        }
      }

      return false;
    };

    for(let obj of this._drawOrder){
      if(shouldIgnore(obj)) continue;

      if(obj.hitTest({x, y, width, height, againstSelf: true, againstChildren: false}).length > 0){
        hitObjs.push(obj);
      }
    }

    return hitObjs;
  }
}
