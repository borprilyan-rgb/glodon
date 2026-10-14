import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
const cache = fileURLToPath(new URL('../.cache/', import.meta.url))
async function stagedRelease(mutate) {
  await mkdir(cache, {recursive:true})
  const directory = await mkdtemp(cache + 'assessment-release-')
  try {
    await cp(new URL('../functions/src/assessments/', import.meta.url), directory, {recursive:true})
    await mutate(directory)
    return await import(pathToFileURL(directory + '/registry.js').href)
  } finally {
    assert.ok(directory.startsWith(cache + 'assessment-release-'))
    await rm(directory, {recursive:true,force:true})
  }
}
test('changing an existing public form without its immutable pairing fails closed', async () => {
  await assert.rejects(stagedRelease(async directory => {
    const forms = JSON.parse(await readFile(directory + '/forms.json'))
    forms[0].copy.en.questions[0].title = 'Tampered question'
    await writeFile(directory + '/forms.json', JSON.stringify(forms))
  }), /Invalid assessment release pairing/)
})
test('changing archived grading sources without a new immutable release fails closed', async () => {
  await assert.rejects(stagedRelease(async directory => {
    const path = directory + '/definitions/docxAssessment.js'
    await writeFile(path, (await readFile(path,'utf8')).replace('const passScore = 70','const passScore = 0'))
  }), /Immutable grading sources changed/)
})
