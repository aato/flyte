import {FRect} from "./FRect"

export class FImage extends FRect{
  constructor({top = 0, left = 0, width = 30, height = 30, zIndex = 0, fillStyle = "#000000",
  mouseDownCB, mouseUpCB, mouseMoveCB, clickCB, doubleClickCB, image = new Image()} = {}){
    super({top, left, width, height, zIndex, fillStyle, mouseDownCB, mouseUpCB, mouseMoveCB, clickCB, doubleClickCB});

    this.image = image;

    this._preserveAspectRatio = true;
  }

  set image(img){
    this._img = img;
    this.width = this._img.width;
    this.height = this._img.height;
    this._aspectRatio = this._height / this._width;

    this._dirty = true;
  }

  _render(){
    this._ctx.save();

      this._ctx.clearRect(0, 0, this._c.width, this._c.height);
      this._ctx.fillStyle = this._fillStyle;
      this._ctx.fillRect(0, 0, this._width, this._height);

      this._ctx.drawImage(this._img, 0, 0, this._width, this._height);

    this._ctx.restore();
  }

  toJSON(){
    var jsonObj = super.toJSON();

    jsonObj.image = this._c.toDataURL();

    return jsonObj;
  }
}
