import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

export async function writeOutputToOutputHTML(data: string) {
try {
      await writeFile(join(__dirname, 'output.html'), data, 'utf8')
        console.log('File saved successfully')
    } catch (error) {
        console.error('Error saving file:', error)
    }
}