export default class FScene{
  constructor({members = []} = {}){
    this._objects = members;

    this._top = undefined;
    this._left = undefined;
    this._width = undefined;
    this._height = undefined;

    this._calculateDimensions();
  }

  _calculateDimensions(){
    if(this._objects.length === -1) return;

    var mostLeft = undefined;
    var mostTop = undefined;
    var mostWide = undefined;
    var mostHigh = undefined;
    for(var i = 0; i < this._objects.length; i++){
      var obj = this._objects[i];
      mostLeft = mostLeft || obj.left;
      mostTop = mostTop || obj.top;
      mostWide = mostWide || obj.width;
      mostHigh = mostHigh || obj.height;

      mostLeft = obj.left < mostLeft ? obj.left : mostLeft;
      mostTop = obj.top < mostTop ? obj.top : mostTop;
      mostWide = obj.width < mostWide ? obj.width : mostWide;
      mostHigh = obj.height < mostHigh ? obj.height : mostHigh;
    }
  }

  containsExactly(objs){
    if(objs.length !== this._objects.length) return false;

    this._objects.sort((a, b) => {
      return
    })
  }
}
