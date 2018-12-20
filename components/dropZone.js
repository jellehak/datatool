
// let reader = new FileReader()
// reader.onload = function (e) {
//   var data = e.target.result
//   let resp = findData(data)
//   console.log(resp)
// }
// reader.readAsBinaryString(file)

Vue.component('drop-zone', {
  data: () => ({
    files: []
  }),
  template: `
  <div id="holder" style="width:100%; height:200px; border: 10px dashed #ccc">
    <ul id="example-1">
  <li v-for="item in files">
    {{ item.name }} (size : {{item.size}})
  </li>
</ul>
  </div>`,
  mounted: mounted,
  methods: {
    readFiles: readFiles
  }
})

function readFiles (files) {
  const filesArr = [...files]

  filesArr.map((file) => {
    const {name, size, type, lastModified} = file
    this.files.push({
      name: name,
      size: size,
      type: type,
      lastModified: lastModified,
      original: file
    })

    this.$emit('change', this.files, file)
  })
}

// ----------------
// Drag n drop
// ----------------
function mounted () {
  const readFiles = this.readFiles

  var holder = document.getElementById('holder')
  holder.ondragover = function () {
    this.className = 'hover'
    return false
  }
  holder.ondragend = function () {
    this.className = ''
    return false
  }
  holder.ondrop = function (e) {
    this.className = ''
    e.preventDefault()
    readFiles(e.dataTransfer.files)
  }
}
