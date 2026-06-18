/**
 * Prepares resources for portable build:
 *  1. Builds the Spring Boot JAR (mvnw package -DskipTests)
 *  2. Copies the JAR to resources/backend/app.jar
 *  3. Downloads and extracts JRE 21 (Windows x64) to resources/jre/ if not present
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, copyFileSync, readdirSync, renameSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import { createWriteStream } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BACKEND_DIR = join(ROOT, '..', 'Kitchapp-Backend')
const RESOURCES_BACKEND = join(ROOT, 'resources', 'backend')
const RESOURCES_JRE = join(ROOT, 'resources', 'jre')

// Eclipse Temurin JRE 21 Windows x64 (zip)
const JRE_URL =
  'https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jre_x64_windows_hotspot_21.0.5_11.zip'
const JRE_ZIP = join(ROOT, 'resources', 'jre-download.zip')
const JRE_TMP = join(ROOT, 'resources', '_jre_tmp')

// ── 1. Build backend ─────────────────────────────────────────────────────────
console.log('Building Spring Boot backend…')
const mvnCmd = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw'
execSync(`${mvnCmd} package -DskipTests`, { cwd: BACKEND_DIR, stdio: 'inherit' })

// ── 2. Copy JAR ──────────────────────────────────────────────────────────────
const targetDir = join(BACKEND_DIR, 'target')
const jars = readdirSync(targetDir).filter(
  (f) => f.endsWith('.jar') && !f.endsWith('-plain.jar')
)
if (jars.length === 0) throw new Error('No JAR found in target/')
const jarSrc = join(targetDir, jars[0])
mkdirSync(RESOURCES_BACKEND, { recursive: true })
copyFileSync(jarSrc, join(RESOURCES_BACKEND, 'app.jar'))
console.log(`Copied ${jars[0]} → resources/backend/app.jar`)

// ── 3. Download JRE if missing ────────────────────────────────────────────────
if (existsSync(join(RESOURCES_JRE, 'bin', 'java.exe'))) {
  console.log('JRE already present, skipping download.')
  process.exit(0)
}

console.log('Downloading JRE 21 (this may take a few minutes)…')
mkdirSync(join(ROOT, 'resources'), { recursive: true })

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    function get(u) {
      https.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location)
          return
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} downloading JRE`))
          return
        }
        const total = parseInt(res.headers['content-length'] || '0', 10)
        let received = 0
        const out = createWriteStream(dest)
        res.on('data', (chunk) => {
          received += chunk.length
          if (total) process.stdout.write(`\r  ${((received / total) * 100).toFixed(1)}%`)
        })
        res.pipe(out)
        out.on('finish', () => { out.close(); process.stdout.write('\n'); resolve() })
        out.on('error', reject)
      }).on('error', reject)
    }
    get(url)
  })
}

await downloadFile(JRE_URL, JRE_ZIP)

console.log('Extracting JRE…')
mkdirSync(JRE_TMP, { recursive: true })

// Use PowerShell Expand-Archive on Windows, unzip on Unix
if (process.platform === 'win32') {
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -Path '${JRE_ZIP}' -DestinationPath '${JRE_TMP}' -Force"`,
    { stdio: 'inherit' }
  )
} else {
  execSync(`unzip -q "${JRE_ZIP}" -d "${JRE_TMP}"`, { stdio: 'inherit' })
}

const extracted = readdirSync(JRE_TMP)
const jreFolder = extracted.find((f) => f.startsWith('jdk-') || f.startsWith('jre-'))
if (!jreFolder) throw new Error(`Could not find extracted JRE folder in: ${extracted.join(', ')}`)

if (existsSync(RESOURCES_JRE)) rmSync(RESOURCES_JRE, { recursive: true, force: true })
renameSync(join(JRE_TMP, jreFolder), RESOURCES_JRE)
rmSync(JRE_TMP, { recursive: true, force: true })
rmSync(JRE_ZIP, { force: true })

console.log('JRE ready at resources/jre/')
