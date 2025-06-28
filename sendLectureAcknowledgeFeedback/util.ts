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

/**
 * Takes an array of ranges and generates random number between the start and final item
 */
type getRandomDelayProps = {
    range: number[]
}   
export function getRandomDelay({ range }: getRandomDelayProps) {
  if (!range || range.length < 2) {
    throw new Error("Range must have at least two numbers");
  }
  const start = range.at(0) as number;
  const end = range.at(-1) as number;

  const random = Math.floor(Math.random() * (end - start + 1)) + start;

  return random;
}