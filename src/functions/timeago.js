/* eslint-disable */
export const timeago = () => {
  const o = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 1000 * 60,
    day: 24 * 60 * 1000 * 60,
    week: 7 * 24 * 60 * 1000 * 60,
    month: 30 * 24 * 60 * 1000 * 60,
    year: 365 * 24 * 60 * 1000 * 60
  };
  const obj = {};

  obj.ago = function(nd, s) {
    let r = Math.round,
      pl = function(v, n) {
        if (s === undefined) {
          return `${n} ${v}${n > 1 ? 's' : ''} ago`;
        } else if (v === 'minute') {
          return n + v.substring(0, 3);
        } else if (v === 'm') {
          return '1s';
        } else {
          return n + v.substring(0, 1);
        }
      },
      ts = Date.now() - new Date(nd).getTime(),
      ii;
    for (var i in o) {
      if (r(ts) < o[i]) return pl(ii || 'm', r(ts / (o[ii] || 1)));
      ii = i;
    }
    return pl(i, r(ts / o[i]));
  };

  obj.today = function() {
    const now = new Date();
    const Weekday = new Array(
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    );
    const Month = new Array(
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    );
    return `${Weekday[now.getDay()]}, ${
      Month[now.getMonth()]
    } ${now.getDate()}, ${now.getFullYear()}`;
  };

  obj.timefriendly = function(s) {
    const t = s.match(/(\d).([a-z]*?)s?$/);
    return t[1] * eval(o[t[2]]);
  };

  obj.mintoread = function(text, altcmt, wpm) {
    const m = Math.round(text.split(' ').length / (wpm || 200));
    return (m || '< 1') + (altcmt || ' min to read');
  };

  return obj;
};
