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

exports.count_properties = function(obj) {
  /* Counts and returns the number of properties in obj.
   */
  var count = 0;
  for(property in obj) count++;
  return count;
}

exports.isArray = function(obj) {
  /** Returns True if obj is an Array.
   */
  return obj.constructor == Array;
};

exports.each = function(obj, callback) {
  /** Call callback(attr_name, attr_value) for each attr of obj.
   * Only works on Objects.
   */
  for(var attr in obj) {
    callback(attr, obj[attr]);
  }
};

