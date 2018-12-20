export default function fileReader (files) {
  return files.map(file => {
    // Load content
    let reader = new FileReader()
    reader.onload = function (e) {
      var data = e.target.result
      file.content = data
      // let resp = findData(data)
      // console.log(resp)
    }
    reader.readAsBinaryString(file.original)
  })
}
