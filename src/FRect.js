import {FCanvas} from "./FCanvas";

export class FRect{
  constructor({top = 0, left = 0, width = 30, height = 30, zIndex = 0, fillStyle = "#000000",
  mouseDownCB, mouseUpCB, mouseMoveCB, clickCB, doubleClickCB} = {}){
    this._top = top;
    this._left = left;
    this._width = width;
    this._height = height;
    this._zIndex = zIndex;
    this._fillStyle = fillStyle;

    this._id = undefined;
    this._scene = undefined;

    this._selected = false;
    this._dragged = false;
    this._hasMouseOver = false;
    this._hasMouseOverScaleCtrl = false;
    this._hasMouseOverDeleteCtrl = false;
    this._selectedScaleCtrl = -1;
    this._dirty = true;
    this._controlsDirty = true;

    this._aspectRatio = this._height / this._width;
    this._preserveAspectRatio = false;

    this._MIN_SIZE = 50;
    this._SCALE_CTRL_RADIUS = 8;
    this._SCALE_CTRL_RR = this._SCALE_CTRL_RADIUS * this._SCALE_CTRL_RADIUS;
    this._DELETE_CTRL_SIZE = this._SCALE_CTRL_RADIUS * 2;
    this._PI2 = Math.PI * 2;

    this.mouseDownCB = mouseDownCB || this.mouseDownCB;
    this.mouseUpCB = mouseUpCB || this.mouseUpCB;
    this.mouseMoveCB = mouseMoveCB || this.mouseMoveCB;
    this.clickCB = clickCB || this.clickCB;
    this.doubleClickCB = doubleClickCB || this.doubleClickCB;

    var canvas = new FCanvas();

    this._c = new FCanvas();
    this._c.width = this._width;
    this._c.height = this._height;
    this._ctx = this._c.getContext('2d');
  }

  mouseDownCB(){

  }

  mouseUpCB(){

  }

  mouseMoveCB(){

  }

  clickCB(){

  }

  doubleClickCB(){
  }

  get id(){
    return this._id;
  }

  get dirty(){
    return this._dirty;
  }

  get top(){
    return this._top;
  }

  set top(top){
    if(top !== this._top){
      this._top = top;
      this._dirty = true;
    }
  }

  get left(){
    return this._left;
  }

  set left(left){
    if(left !== this._left){
      this._left = left;
      this._dirty = true;
    }
  }

  get width(){
    return this._width;
  }

  set width(width){
    if(width !== this._width){
      this._width = width;
      this._c.width = width;
      this._dirty = true;
    }
  }

  get height(){
    return this._height;
  }

  set height(height){
    if(height !== this._height){
      this._height = height;
      this._c.height = height;
      this._dirty = true;
    }
  }

  get zIndex(){
    return this._zIndex;
  }

  set zIndex(zIndex){
    if(zIndex !== this._zIndex){
      this._zIndex = zIndex;
      this._scene._dirtyZIndexes = true;
    }
  }

  get fillStyle(){
    return this._fillStyle;
  }

  set fillStyle(fillStyle){
    if(fillStyle !== this._fillStyle){
      this._fillStyle = fillStyle;
      this._dirty = true;
    }
  }

  get scaleCtrlRadius(){
    return this._SCALE_CTRL_RADIUS;
  }

  get hasMouseOver(){
    return this._hasMouseOver;
  }

  set hasMouseOver(hasMouseOver){
    if(hasMouseOver !== this._hasMouseOver){
      this._hasMouseOver = hasMouseOver;
      this._controlsDirty = true;
    }
  }

  get hasMouseOverScaleCtrl(){
    return this._hasMouseOverScaleCtrl;
  }

  set hasMouseOverScaleCtrl(hasMouseOverScaleCtrl){
    if(hasMouseOverScaleCtrl !== this._hasMouseOverScaleCtrl){
      this._hasMouseOverScaleCtrl = hasMouseOverScaleCtrl;
    }
  }

  get hasMouseOverDeleteCtrl(){
    return this._hasMouseOverDeleteCtrl;
  }

  set hasMouseOverDeleteCtrl(hasMouseOverDeleteCtrl){
    if(hasMouseOverDeleteCtrl !== this._hasMouseOverDeleteCtrl){
      this._hasMouseOverDeleteCtrl = hasMouseOverDeleteCtrl;
    }
  }

  get selected(){
    return this._selected;
  }

  set selected(selected){
    if(selected !== this._selected){
      this._selected = selected;
      this._controlsDirty = true;
    }
  }

  get dragged(){
    return this._dragged;
  }

  set dragged(dragged){
    this._dragged = dragged;
  }

  get selectedScaleCtrl(){
    return this._selectedScaleCtrl;
  }

  set selectedScaleCtrl(selectedScaleCtrl){
    this._selectedScaleCtrl = selectedScaleCtrl;
  }

  get controlsDirty(){
    return this._controlsDirty;
  }

  _drawBorder(ctx){
    ctx.save();

      ctx.strokeStyle = "grey";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(this._left, this._top);
      ctx.lineTo(this._left + this._width, this._top);
      ctx.lineTo(this._left + this._width, this._top + this._height);
      ctx.lineTo(this._left, this._top + this._height);
      ctx.closePath();
      ctx.stroke();

    ctx.restore();
  }

  _drawDeleteControl(ctx){
    var deleteCtrlTop = this._top - this._DELETE_CTRL_SIZE / 2;
    var deleteCtrlLeft = this._left + this._width - this._SCALE_CTRL_RADIUS -
                         (this._MIN_SIZE - this._SCALE_CTRL_RADIUS * 2) / 2 - this._DELETE_CTRL_SIZE / 2;

    ctx.save();

      if(this._hasMouseOverDeleteCtrl) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
      }

      ctx.beginPath();
      ctx.moveTo(deleteCtrlLeft, deleteCtrlTop);
      ctx.lineTo(deleteCtrlLeft + this._DELETE_CTRL_SIZE, deleteCtrlTop);
      ctx.lineTo(deleteCtrlLeft + this._DELETE_CTRL_SIZE, deleteCtrlTop + this._DELETE_CTRL_SIZE);
      ctx.lineTo(deleteCtrlLeft, deleteCtrlTop + this._DELETE_CTRL_SIZE);
      ctx.closePath();
      ctx.stroke();

    ctx.restore();
  }

  _drawScaleCtrls(ctx){
    this._drawScaleCtrl(ctx, 0);
    this._drawScaleCtrl(ctx, 1);
    this._drawScaleCtrl(ctx, 2);
    this._drawScaleCtrl(ctx, 3);
  }

  _drawScaleCtrl(ctx, scaleCtrlNumber) {
    var x = undefined;
    var y = undefined;

    switch(scaleCtrlNumber){
      case 0:
        x = this._left;
        y = this._top;
        break;
      case 1:
        x = this._left + this._width;
        y = this._top;
        break;
      case 2:
        x = this._left + this._width;
        y = this._top + this._height;
        break;
      case 3:
        x = this._left;
        y = this._top + this._height;
        break;
    }

    ctx.save();

      if(this._hasMouseOverScaleCtrl){
        ctx.strokeStyle = "#ffffff";
      } else {
        ctx.strokeStyle = "#ffffff";
      }

      ctx.beginPath();
      ctx.arc(x, y, this._SCALE_CTRL_RADIUS, 0, this._PI2, false);
      ctx.closePath();
      ctx.stroke();

    ctx.restore();
  }

  _render(){
    this._ctx.save();

      this._ctx.clearRect(0, 0, this._c.width, this._c.height);
      this._ctx.fillStyle = this._fillStyle;
      this._ctx.fillRect(0, 0, this._width, this._height);

    this._ctx.restore();
  }

  _postRender(ctx, drawBordersAndControls){
    if(drawBordersAndControls && this._controlsDirty){
      this._scene.postRenderCt = this._scene.postRenderCt || 0;
      this._scene.postRenderCt++;
      if(this._hasMouseOver || this._selected){
        this._drawBorder(ctx);
      }

      if(this._selected){
        this._drawScaleCtrls(ctx);

        this._drawDeleteControl(ctx);
      }

      this._controlsDirty = false;
    }
  }

  hitTest(top, left){
    if(top >= this._top && top <= this._top + this._height &&
    left >= this._left && left <= this._left + this._width){
      return true;
    }

    return false;
  }

  deleteCtrlHitTest(x, y){
    var deleteCtrlTop = this._top - this._DELETE_CTRL_SIZE / 2;
    var deleteCtrlLeft = this._left + this._width - this._SCALE_CTRL_RADIUS -
                         (this._MIN_SIZE - this._SCALE_CTRL_RADIUS * 2) / 2 - this._DELETE_CTRL_SIZE / 2;

    if(x >= deleteCtrlLeft && x <= deleteCtrlLeft + this._DELETE_CTRL_SIZE &&
    y >= deleteCtrlTop && y <= deleteCtrlTop + this._DELETE_CTRL_SIZE){
      return true;
    }

    return false;
  }

  scaleCtrlHitTest(x, y){
    var dx, dy;

    // top-left
    dx = x - this._left;
    dy = y - this._top;
    if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 0;
    }
    // top-right
    dx = x - (this._left + this._width);
    dy = y - this._top;
    if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 1;
    }
    // bottom-right
    dx = x - (this._left + this._width);
    dy = y - (this._top + this._height);
    if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 2;
    }
    // bottom-left
    dx = x - this._left;
    dy = y - (this._top + this._height);
    if (dx * dx + dy * dy <= this._SCALE_CTRL_RR) {
        return 3;
    }

    return -1;
  }

  above(obj){
    return this.zIndex > obj.zIndex;
  }

  below(obj){
    return this.zIndex < obj.zIndex;
  }

  onSameLayerAs(obj){
    return this.zIndex === obj.zIndex;
  }

  isSelected(){
    return this._selected;
  }

  isSameObjectAs(obj){
    if(!obj) return undefined;

    return this.id === obj.id;
  }

  translate(dx, dy){
    this.left += dx;
    this.top += dy;

    this._controlsDirty = true;
  }

  scale(dx, dy, relativeToScaleCtrl){
    switch(relativeToScaleCtrl){
      case 0:
        if(this._width - dx >= this._MIN_SIZE && this._scene._prevX <= this._left + this._SCALE_CTRL_RADIUS){
          this.left += dx;
          this.width -= dx;

          if(this._preserveAspectRatio){
            this.top += this._aspectRatio * dx;
            this.height -= this._aspectRatio * dx;
          }
        }

        if(this._height - dy >= this._MIN_SIZE && this._scene._prevY <= this._top + this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio){
          this.top += dy;
          this.height -= dy;
        }
        break;
      case 1:
        if(this._width + dx >= this._MIN_SIZE && this._scene._prevX >= this._left + this._width - this._SCALE_CTRL_RADIUS){
          this.width += dx;

          if(this._preserveAspectRatio){
            this.top -= this._aspectRatio * dx;
            this.height += this._aspectRatio * dx;
          }
        }

        if(this._height - dy >= this._MIN_SIZE && this._scene._prevY <= this._top + this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio){
          this.top += dy;
          this.height -= dy;
        }

        break;
      case 2:
        if(this._width + dx >= this._MIN_SIZE && this._scene._prevX >= this._left + this._width - this._SCALE_CTRL_RADIUS){
          this.width += dx;

          if(this._preserveAspectRatio){
            this.height += this._aspectRatio * dx;
          }
        }

        if(this._height + dy >= this._MIN_SIZE && this._scene._prevY >= this._top + this._height - this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio){
          this.height += dy;
        }

        break;
      case 3:
        if(this._width - dx >= this._MIN_SIZE && this._scene._prevX <= this._left + this._SCALE_CTRL_RADIUS){
          this.left += dx;
          this.width -= dx;

          if(this._preserveAspectRatio){
            this.height -= this._aspectRatio * dx;
          }
        }

        if(this._height + dy >= this._MIN_SIZE && this._scene._prevY >= this._top + this._height - this._SCALE_CTRL_RADIUS && !this._preserveAspectRatio){
          this.height += dy;
        }

        break;
    }

    this._controlsDirty = true;
  }

  toJSON(){
    var jsonObj = {
      id: this._id,
      left: this._left,
      top: this._top,
      width: this._width,
      height: this._height,
      zIndex: this._zIndex,
      fillStyle: this._fillStyle
    }

    return jsonObj;
  }

  draw(ctx, drawSelf, drawBordersAndControls){
    if(this._dirty){
      this._render();
      this._dirty = false;
    }

    if(drawSelf){
      ctx.drawImage(this._c, this._left, this._top);
    }

    this._postRender(ctx, drawBordersAndControls);
  }
}
