export class FCanvas{
  constructor(canvasID){
    // Dummy object for testing.
    if(typeof process === 'object' && process + '' === '[object process]'){
      return {
        width : undefined,
        height : undefined,
        style : {width : '', height : ''},
        getContext : (type) => {
          return {
            save : () => {},
            restore : () => {},
            clearRect : () => {},
            fillStyle : '',
            drawImage : () => {},
            fillRect : () => {}
          }
        },
        onmousedown : (e) => {},
        onmouseup : (e) => {},
        onclick : (e) => {},
        ondblclick : (e) => {},
        onmousemove : (e) => {},
        onmouseout : (e) => {}
      };
    }

    if(canvasID){
      return document.querySelector(canvasID);
    }

    return document.createElement('canvas');
  }
}
