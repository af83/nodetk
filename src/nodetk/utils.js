/* Some every-day useful functions.
 */

exports.extend = function(target, obj1, obj2) {
  /* Merge the contents of two or more objects together into the first object.
   * Returns the target.
   *
   * Arguments:
   *  - target: where to merge
   *  - obj1, obj2...: what to merge.
   */
  target = target || {};
  var objs = Array.prototype.slice.apply(arguments, [1]);
  objs.forEach(function(obj) {
    for(attr in obj) {
      target[attr] = obj[attr];
    }
  });
  return target;
};

