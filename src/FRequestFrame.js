export class FRequestFrame{
  constructor(requestType){
    // Dummy object for testing.
    if(typeof process === 'object' && process + '' === '[object process]'){
      return () => {};
    }

    return requestFrame(requestType).bind(window);
  }
}
