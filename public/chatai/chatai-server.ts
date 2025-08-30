import { createServer } from "http"
import { parse } from "url"
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { spawn, exec, ChildProcess } from "child_process"

const port = Number(process.env.PORT || '3001')
const indexPath = join(process.cwd(), "public", "chatai", "index.html")

let activeProcess: ChildProcess | null = null;

function killProcessTree(pid: number) {
  if (process.platform === 'win32') {
    exec(`taskkill /pid ${pid} /T /F`, () => {});
  } else {
    try { process.kill(-pid) } catch {}
  }
}

function mapQueryToCommand(query: string) {
  const q = query.toLowerCase()
  if (q.includes("ts") && q.includes("create normal order") && (q.includes("c&d") || q.includes("c and d") || q.includes("basis is c&d"))) {
    return {
      command: "npx",
      args: ["playwright", "test", "e2e/testCase/tradingSlip/TS-01-CreateNormalOrderWithBasisCD.spec.ts", "--headed"],
    }
  }
  if (q.includes("shipment report by division")) {
    return {
      command: "npx",
      args: ["playwright", "test", "e2e/testCase/report/marketing/RE-07-RptShipmentReportByDivision.spec.ts", "--headed"],
    }
  }
  return null
}

const server = createServer((req, res) => {
  const url = parse(req.url || "", true)
  if (req.method === "GET" && url.pathname === "/") {
    if (!existsSync(indexPath)) {
      res.statusCode = 500
      res.end("ChatAI page missing")
      return
    }
    const html = readFileSync(indexPath)
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end(html)
    return
  }
  if (req.method === "GET" && url.pathname === "/run-stream") {
    const query = String((url.query?.q as string) || "")
    const mapped = mapQueryToCommand(query)
    if (!mapped) {
      res.statusCode = 400
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({ ok: false, error: "No matching test case for query" }))
      return
    }
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no"
    })
    const writeLine = (line: string) => {
      if (line.length === 0) return
      res.write(`data: ${line}\n\n`)
    }
    let buffer = ""
    const pushChunk = (chunk: Buffer | string) => {
      buffer += chunk.toString()
      const parts = buffer.split(/\r?\n/)
      // keep last partial line in buffer
      buffer = parts.pop() || ""
      for (const p of parts) writeLine(p)
    }
    const child = spawn(mapped.command, mapped.args, { cwd: process.cwd(), shell: true })
    
    // Store active process to allow killing via /stop-run
    activeProcess = child;
    
    child.stdout.on("data", d => pushChunk(d))
    child.stderr.on("data", d => pushChunk(d))
    child.on("close", code => {
      if (activeProcess === child) activeProcess = null;
      res.write(`event: done\ndata: ${JSON.stringify({ code })}\n\n`)
      res.end()
    })
    req.on("close", () => {
      try { 
        if (child && child.pid) killProcessTree(child.pid) 
        if (activeProcess === child) activeProcess = null;
      } catch {}
    })
    return
  }
  
  if (req.method === "POST" && url.pathname === "/stop-run") {
    if (activeProcess && activeProcess.pid) {
      try {
        killProcessTree(activeProcess.pid);
        activeProcess = null;
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true, message: "Process stopped" }));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: "Failed to stop process" }));
      }
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, message: "No active process" }));
    }
    return
  }
  if (req.method === "POST" && url.pathname === "/run") {
    let body = ""
    req.on("data", chunk => {
      body += chunk
    })
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}")
        const query = String(data.query || "")
        const mapped = mapQueryToCommand(query)
        if (!mapped) {
          res.statusCode = 400
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ ok: false, error: "No matching test case for query" }))
          return
        }
        const child = spawn(mapped.command, mapped.args, { cwd: process.cwd(), shell: true })
        let output = ""
        child.stdout.on("data", d => {
          output += d.toString()
        })
        child.stderr.on("data", d => {
          output += d.toString()
        })
        child.on("close", code => {
          res.statusCode = 200
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ ok: true, code, output }))
        })
      } catch {
        res.statusCode = 400
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ ok: false, error: "Invalid request body" }))
      }
    })
    return
  }
  res.statusCode = 404
  res.end("Not found")
})

server.listen(port, () => {
  process.stdout.write(`ChatAI server listening on http://localhost:${port}/\n`)
})
