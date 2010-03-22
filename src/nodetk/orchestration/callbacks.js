// Some function to handle lists (or files) of callbacks


exports.get_waiter = function(calls_needed, callback){
  /* Returns a function which will call the given
   * callback once she has been called calls_needed times.
   * If calls_needed is 0, then the callback is immediatly called.
   */
  !calls_needed && callback();
  return function(){
    !--calls_needed && callback();
  }
};


exports.empty_awaiting_callbacks = function(awaiting_callbacks, key, data){
  /* Takes the list of functions present in awaiting_callbacks[key],
   * calls them with data, and delete awaiting_callbacks[key] */
  var to_call = awaiting_callbacks[key] || [];
  // Important! The delete must be done BEFORE the call
  // of the following callbacks (callback at the end!)
  delete awaiting_callbacks[key];
  to_call.forEach(function(callback){
    callback && callback(data);
  });
};


exports.add_awaiting_callbacks = function(awaiting_callbacks, keys, callback){
  /* Add (push) the given callback to every awaiting_callbacks[key] for key in keys.
   * If awaiting_callbacks[key] does not exist, define it as the list [callback].
   */
  keys.forEach(function(key){
    if(awaiting_callbacks[key] == undefined) awaiting_callbacks[key] = [callback];
    else awaiting_callbacks[key].push(callback);
  });
};


var sync_calls = function(fct, args, callback, i/*optional*/) {
  /* Runs the fct synchronously for each given set of args in args.
   * The last arguments of the fct is a callback, called when fct finishes.
   * Callback is called when the last call finished.
   *
   * Arguments:
   *  - args: array of single values (one argument for each call) or
   *    array of arrays (the inside arrays being the arguments).
   */
  if(i === undefined) i = 0;
  if(i < args.length) {
    var args_fct = args[i];
    if (args_fct.forEach === undefined) args_fct = [args_fct];
    fct.apply(this, args_fct.concat([function(){
      sync_calls(fct, args, callback, i+1);
    }]));
  }
  else callback && callback();
};
exports.sync_calls = sync_calls;

