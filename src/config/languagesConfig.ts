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
  { text: 'JSON File', value: '.json' },
  { text: 'CSV File', value: '.csv' },
  { text: 'XML File', value: '.xml' },
  { text: 'HTML File', value: '.html' },
  { text: 'Markdown File', value: '.md' },
  { text: 'JPEG Image', value: '.jpg' },
  { text: 'PNG Image', value: '.png' },
  { text: 'HEIC Image', value: '.heic' },
  { text: 'Text File', value: '.txt' },
  { text: 'YAML File', value: '.yaml' },
  { text: 'PDF File', value: '.pdf' }
]


export const outputExtensions = Object.keys(mimeDb).reduce((acc: { text: string, value: string }[], mimeType) => {
  if (mimeDb[mimeType].extensions) {
    mimeDb[mimeType].extensions.forEach(extension => {
      acc.push({ text: `${extension.toUpperCase()} File`, value: `.${extension}` })
    })
  }
  return acc
}, [])


export const pythonBoilerplate = `def main():
    print("Hello, World!")\n
main()`

export const rustBoilerplate = `fn main() {
    println!("Hello, World!");
}`

export const javascriptBoilerplate = `console.log("Hello, World!");`

export const luaBoilerplate = `print("Hello, World!")`
