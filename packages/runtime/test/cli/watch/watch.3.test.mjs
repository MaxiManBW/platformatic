import { cp, writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import desm from 'desm'
import { start, createEsmLoggingPlugin } from '../helper.mjs'

const fixturesDir = join(desm(import.meta.url), '..', '..', '..', 'fixtures')

const base = join(desm(import.meta.url), '..', '..', 'tmp')

try {
  await mkdir(base, { recursive: true })
} catch {
}

function saferm (path) {
  return rm(path, { recursive: true, force: true }).catch(() => {})
}

test('watches ESM files', async (t) => {
  const tmpDir = await mkdtemp(join(base, 'watch-'))
  t.after(() => saferm(tmpDir))
  t.diagnostic(`using ${tmpDir}`)
  const configFileSrc = join(fixturesDir, 'configs', 'monorepo.json')
  const configFileDst = join(tmpDir, 'configs', 'monorepo.json')
  const appSrc = join(fixturesDir, 'monorepo')
  const appDst = join(tmpDir, 'monorepo')
  const esmPluginFilePath = join(appDst, 'serviceAppWithMultiplePlugins', 'plugin2.mjs')

  await Promise.all([
    cp(configFileSrc, configFileDst),
    cp(appSrc, appDst, { recursive: true })
  ])

  await writeFile(esmPluginFilePath, createEsmLoggingPlugin('v1', false))
  const { child } = await start('-c', configFileDst)
  t.after(() => child.kill('SIGKILL'))
  await writeFile(esmPluginFilePath, createEsmLoggingPlugin('v2', true))

  for await (const log of child.ndj) {
    if (log.msg === 'RELOADED v2') {
      break
    }
  }
})
