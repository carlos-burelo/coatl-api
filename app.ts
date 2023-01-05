import { serve } from "std:server";
import app from "./src/app.ts";

serve(app.fetch);
