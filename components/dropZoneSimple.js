Vue.component('drop-zone', {
  template: `<div id="holder" style="width:100%; height:200px; border: 10px dashed #ccc"><slot></slot></div>`,
  mounted: mounted
})

// ----------------
// Drag n drop
// ----------------
function mounted () {
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
    // readFiles(e.dataTransfer.files)
  }
}
