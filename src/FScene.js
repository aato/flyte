import FGroup from './FGroup';
import FSelection from './FSelection';

export default class FScene extends FGroup{
  constructor({canvas, width = 600, height = 300} = {}){
    super({canvas, width, height});

    this._prevMouseX = 0;
    this._prevMouseY = 0;

    // Allows us to listen for keydown/up event
    this._c.tabIndex = 9999;
    // Prevents canvas from being outlined.
    this._c.style.outline = "none";

    this._nextID = (
      () => {
        var index = 0;

        return () => {
          return index++;
        }
    })();

    this._id = this._nextID();
    this._scene = this;

    this._selection = new FSelection();
    this._selection.setID(this._nextID());
    this._selection.setScene(this);

    var __onMouseDown = this._onMouseDown.bind(this);
    this._c.onmousedown = __onMouseDown;

    var __onMouseUp = this._onMouseUp.bind(this);
    this._c.onmouseup = __onMouseUp;

    var __onClick = this._onClick.bind(this);
    this._c.onclick = __onClick;

    var __onDoubleClick = this._onDoubleClick.bind(this);
    this._c.ondblclick = __onDoubleClick;

    var __onMouseMove = this._onMouseMove.bind(this);
    this._c.onmousemove = __onMouseMove;

    var __onMouseOut = this._onMouseOut.bind(this);
    this._c.onmouseout = __onMouseOut;

    var __onKeyDown = this._onKeyDown.bind(this);
    this._c.onkeydown = __onKeyDown;

    var __onKeyUp = this._onKeyUp.bind(this);
    this._c.onkeyup = __onKeyUp;

    this._request = requestFrame('request').bind(window);
    this._cancel = requestFrame('cancel').bind(window);

    this._draw = this.draw.bind(this, this._ctx);
    this._requestID = this._request(this._draw);

    this._drawOrder = [];

    this._flags.drawOrderDirty = true;
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
    }

    return addedObjs;
  }

  remove(objs){
    if(!Array.isArray(objs)){
      objs = [objs];
    }

    var removedObjs = super.remove(objs);
    for(let obj of removedObjs){
      // Remove this object's ID.
      obj.setID(undefined);
      // Remove this scene from this object.
      obj.setScene(undefined)
    }

    if(removedObjs.length > 0){
      this._calculateDrawOrder();
    }

    return removedObjs;
  }

  clear(){
    var removedObjs = super.clear();
    for(let obj of removedObjs){
      // Remove this object's ID.
      obj.setID(undefined);
      // Remove this scene from this object.
      obj.setScene(undefined)
    }

    this._drawOrder = [];

    return removedObjs;
  }

  select(objs){
    return this._selection.add(objs);
  }

  unselect(objs){
    if(!objs) return this._selection.clear();

    return this._selection.remove(objs);
  }

  _calculateDrawOrder(){
    this._drawOrder = Array.from(this._children).sort((a, b) => {
      return a.layer - b.layer;
    })
  }













  _onMouseDown(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseUp(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onClick(e){
    var {x, y} = this._getMouseCoords(e);

    console.log(this.hitTest({x, y}));

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onDoubleClick(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseMove(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseOut(e){
    var {x, y} = this._getMouseCoords(e);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onKeyDown(e){
    console.log('down');
  }

  _onKeyUp(e){
    console.log('up');
  }

  draw(ctx){
    super.draw(ctx);

    this._request(this._draw);
  }

  _render(){
    console.log('SCENE RENDER');

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

      if(this._selection.getChildren().size > 0){
        this._selection.draw(this._ctx);
      }

      // Update this object's canvas here.
    this._ctx.restore();
  }

  _getMouseCoords(e){
    var rect = this._c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return {x, y};
  }
}
