import FGroup from './FGroup';
import FSelection from './FSelection';
import FGroupMember from './FGroupMember';

export default class FScene extends FGroup{
  constructor({canvas, width = 600, height = 300} = {}){
    super({canvas, width, height});

    this._prevMouseX = undefined;
    this._prevMouseY = undefined;

    this._mouseDown = undefined;
    this._mouseSelectionTransparency = 0.8;
    this._mouseSelectionFillStyle = "#D1D1FF";

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
      this.setFlag('canvasDirty', true);
    }

    return unselectedObjs;
  }

  _calculateDrawOrder(){
    var sceneObjs = Array.from(this._children);
    sceneObjs.push(this._selection);

    this._drawOrder = sceneObjs.sort((a, b) => {
      return a.layer - b.layer;
    })
  }













  _onMouseDown(e){
    var {x, y} = this._getMouseCoords(e);

    this._mouseDown = {x, y};

    var hitObjs = this.hitTest({x, y});
    if(hitObjs.length > 0){

    } else {
      this.unselect();
    }

    // Issue onMouseDown event to hitObjs[0].


    this.setFlag('canvasDirty', true);

    this._prevMouseX = x;
    this._prevMouseY = y;
  }

  _onMouseUp(e){
    var {x, y} = this._getMouseCoords(e);

    this._selection.setDragged(false);

    this._mouseDown = undefined;
    this.setFlag('canvasDirty', true);

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
    var dx = x - this._prevMouseX;
    var dy = y - this._prevMouseY;

    if(this._mouseDown){
      if(this._selection.getSize() > 0){
        if(this._selection.hitTest({x, y})){
          this._selection.setDragged(true);

          let selectionPos = this._selection.getPosition();

          this._selection.setPosition({x: selectionPos.x + dx, y: selectionPos.y + dy});
        }
      }


      this.setFlag('canvasDirty', true);
    }

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

      // if(this._selection.getChildren().size > 0){
        // this._selection.draw(this._ctx);
      // }

      if(this._mouseDown && this._selection.getDragged() === false){
        this._renderMouseSelection(this._ctx);
      }

    this._ctx.restore();
  }

  _renderMouseSelection(ctx){
    var width = this._prevMouseX - this._mouseDown.x;
    var height = this._prevMouseY - this._mouseDown.y;

    ctx.save();
      ctx.globalAlpha = this._mouseSelectionTransparency;
      ctx.fillStyle = this._mouseSelectionFillStyle;
      ctx.fillRect(this._mouseDown.x, this._mouseDown.y, width, height);
    ctx.restore();
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

      if(obj.hitTest({x, y, width, height})){
        hitObjs.push(obj);
      }
    }

    hitObjs.sort((a, b) => {
      return b.layer - a.layer;
    })

    return hitObjs;
  }

  _getMouseCoords(e){
    var rect = this._c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    return {x, y};
  }
}
