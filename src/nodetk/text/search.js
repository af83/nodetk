
// Regexp taken from http://www.regexguru.com/2008/11/detecting-urls-in-a-block-of-text/
var URL_REG_EXP = /\b(?:(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[-A-Z0-9+&@#\/%=~_|$]|((?:mailto:)?[A-Z0-9._%+-]+@[A-Z0-9._%-]+\.[A-Z]{2,4})\b)|”(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[^"\r\n]+”?|’(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[^'\r\n]+’?/ig

exports.extract_URLs = function(text) {
  /* Extract URLs from plain text, returns a list of them.
   * Are detected: http(s), ftp, fail, email addresses.
   * For URLs starting with 'www.', will append a "http:" at beggining.
   *
   * Arguments:
   *  - text: the text in which you are looking for URLs.
   */
  var matches = text.match(URL_REG_EXP);
  if(!matches) return [];
  return matches.map(function(url) {
    if(url.substr(0, 4).toLowerCase() == "www.") {
      url = 'http://' + url;
    }
    return url;
  });
}

