import mimeDb from 'mime-db'

const defaultLanguage = 'python'
export const languages = ['python', 'rust', 'javascript', 'lua']

export const languageMap: { [key: string]: string } = {
  py: languages[0],
  rs: languages[1],
  js: languages[2],
  lua: languages[3]
}

export const getLanguageFromExtension = (extension: string): string => {
  return languageMap[extension] || defaultLanguage
}

export const getLanguageFromFilename = (filename: string): string => {
  const extension = filename.split('.').pop()
  return extension ? getLanguageFromExtension(extension) : defaultLanguage
}

export const parseLanguageFromCodeUrl = (codeUrl: string): string => {
  const extension = codeUrl.split('.').pop()?.split('?')[0]
  return extension ? getLanguageFromExtension(extension) : defaultLanguage
}

export const getLanguageColor = (language: string): string => {
  switch (language) {
    case 'python':
      return 'bg-python'
    case 'rust':
      return 'bg-rust'
    case 'javascript':
      return 'bg-javascript'
    case 'lua':
      return 'bg-lua'
    case 'json':
      return 'bg-json'
    case 'csv':
      return 'bg-csv'
    case 'xml':
      return 'bg-xml'
    case 'html':
      return 'bg-html'
    case 'markdown':
      return 'bg-markdown'
    case 'jpeg':
      return 'bg-jpeg'
    case 'png':
      return 'bg-png'
    case 'heic':
      return 'bg-heic'
    case 'txt':
      return 'bg-txt'
    case 'yaml':
      return 'bg-yaml'
    case 'pdf':
      return 'bg-pdf'
    default:
      return 'bg-gray-400'
  }
}

export const fetchRawContentFromUrl = async (code_url: string): Promise<string> => {
  try {
    const response = await fetch(code_url)
    if (!response.ok) {
      throw new Error(`Error fetching the content: ${response.statusText}`)
    }
    const rawContent = await response.text()
    return rawContent
  } catch (error) {
    console.error('Error fetching raw content:', error)
    throw error
  }
}
export const getExtensionFromContentType = (content_type: string): string => {
  switch (content_type) {
    case 'text/x-python':
      return '.py'
    case 'text/x-rustsrc':
      return '.rs'
    case 'text/javascript':
      return '.js'
    case 'text/x-lua':
      return '.lua'
    default:
      return ''
  }
}

export const getExtensionFromPath = (path: string): string => {
  return path.substring(path.lastIndexOf('.'))
}
export const getContent_type = (language: string): string => {
  switch (language) {
    case 'python':
      return 'text/x-python'
    case 'rust':
      return 'text/x-rustsrc'
    case 'javascript':
      return 'text/javascript'
    case 'lua':
      return 'text/x-lua'
    default:
      return 'text/plain'
  }
}

export const outputRestrictedExtensions = [
  { text: 'JSON', value: '.json' },
  { text: 'CSV', value: '.csv' },
  { text: 'XML', value: '.xml' },
  { text: 'HTML', value: '.html' },
  { text: 'Markdown', value: '.md' },
  { text: 'JPEG', value: '.jpg' },
  { text: 'PNG', value: '.png' },
  { text: 'HEIC', value: '.heic' },
  { text: 'Text', value: '.txt' },
  { text: 'YAML', value: '.yaml' },
  { text: 'PDF', value: '.pdf' }
]

export const outputExtensions = Object.keys(mimeDb).reduce(
  (acc: { text: string; value: string }[], mimeType) => {
    const extensions = mimeDb[mimeType]?.extensions
    if (extensions) {
      extensions.forEach((extension) => {
        acc.push({ text: `${extension.toUpperCase()}`, value: `.${extension}` })
      })
    }
    return acc
  },
  []
)

export const pythonBoilerplate = `def main():
    print("Hello, World!")\n
main()`

export const rustBoilerplate = `fn main() {
    println!("Hello, World!");
}`

export const javascriptBoilerplate = `console.log("Hello, World!");`

export const luaBoilerplate = `print("Hello, World!")`
