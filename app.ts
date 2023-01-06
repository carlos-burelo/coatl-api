import { serve } from "std:server"
import app from "./src/app.ts"
import { Database } from "./src/shared/storage.ts"

await Database.init(['posts', 'projects', 'snippets'])
serve(app.fetch)
