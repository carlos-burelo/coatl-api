import { Hono } from 'hono'
import {
  createSnippet,
  deleteSnippet,
  getSnippet,
  getSnippets,
  updateSnippet
} from './handler.ts'

const snippets = new Hono()

snippets.get('/', getSnippets)
snippets.post('/', createSnippet)
snippets.get('/:id', getSnippet)
snippets.put('/:id', updateSnippet)
snippets.delete('/:id', deleteSnippet)

export default snippets