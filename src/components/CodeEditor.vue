<script>
import hljs from 'highlight.js'
import CodeEditor from 'simple-code-editor'
import python from 'highlight.js/lib/languages/python'

hljs.registerLanguage('python', python)

export default {
  components: {
    CodeEditor
  }
}

//const model = defineModel<string>()
</script>

<template>
  <CodeEditor/>
</template>
