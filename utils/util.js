const formatTime = date => {
  const datetime = new Date(date);
  const year = datetime.getFullYear()
  const month = datetime.getMonth() + 1
  const day = datetime.getDate()
  const hour = datetime.getHours()
  const minute = datetime.getMinutes()
  const second = datetime.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
