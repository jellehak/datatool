// exportCsv = window.exportCsv
// const XLSX = window.XLSX
const {FileReader} = window

const jsonToCsv = (items, joiner = ';') => {
  const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
  const header = Object.keys(items[0])
  let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(joiner))
  csv.unshift(header.join(joiner))
  return csv.join('\r\n')
}

Vue.filter('json', value => { return JSON.stringify(value, null, 2) } )

window.vue = new window.Vue({
  el: '#app',

  data: () => ({
    files: [],
    output: '',
    searchend: '',
    data: [],
    code: `
const key = 'ID'
const grouped = _.groupBy(data, item => item[key]);
return Object.values(grouped).map(items => items[0])
`,
  }),

  created() {
    this.data = JSON.parse(localStorage.getItem('data'))
    console.log(this.data)
    this.submit()
  },

  methods: {
    exportCsv () {
      exportCsv(jsonToCsv(this.output), 'dowload.csv', 'text/csv;encoding:utf-8')
    },

    submit (form) {
      // console.log(this.files)

      const data = this.data
      // eval(this.code)
      const result = eval('(function() {' + this.code + '}())');
      this.output = result // JSON.stringify(result)
      // readFiles(this.files)
      // this.output = processAll(this.files, this.filenameregex, this.searchstart, this.searchend)
    },



    change (files, file) {
      this.files.push(file)

      // Preload file contents
      let reader = new FileReader()
      reader.onload = (e) => {
        file.content = e.target.result
        console.log(`File loaded in memory ${file.name}`)

        // Log XLSX info
        // console.log(file.content)
        const sheets = getSheets(file.content)
        // Get first object
        const sheet = getFirstObjectKey(sheets)
        const csv = XLSX.utils.sheet_to_csv(sheet)
        console.log(csv)

        const data = XLSX.utils.sheet_to_json(sheet)
        
        // Save in localStorage
        localStorage.setItem('data',JSON.stringify(data))

        //------------------
        // Sanne Process logic
        //------------------
        // Proces direct
        // console.log(sheets)
      }
      reader.readAsBinaryString(file)
    }
  }
})


// Proces each file
function processAll (files, regexstr, start, end) {
  return files.map(file => {
    const {content, name} = file

    // Get Sheet
    const sheets = getSheets(file.content)
    const sheet = getFirstObjectKey(sheets)
    const csv = XLSX.utils.sheet_to_csv(sheet)

    // Excel likes ; instead of , separators
    data = data.replace(/,/g, ';')
    data = data + '\n'

    console.log(`Processed ${name}`)
    return data
  })
}

// -----------
// Helpers
function getSheets (buf) {
  return XLSX.read(buf, { type: 'binary' }).Sheets
}

function sheetToCSV (sheets, sheetName = '') {
  sheetName = sheetName || getFirstObjectKey(sheets)
  // var workbook = XLSX.read(buf, { type: 'binary' })
  // console.log(workbook.SheetNames)
  return XLSX.utils.sheet_to_csv(getSheets(buf)[sheetName])
}

function getFirstObjectKey (obj) { return obj[Object.keys(obj)[0]] }
