import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const result = await Promise.all(entries.map(e => e.isDirectory() ? files(new URL(e.name + '/', directory)) : [new URL(e.name, directory)]))
  return result.flat()
}
const forbidden = /expectedAnswers|answerKeys|criticalIndices|scoreExercise|passScore|function score\(|correct\.map|Configure EMPLOYEE_AUTH_DOMAIN|Immutable grading sources changed/
test('all production chunks and public assets exclude private definitions and source maps', async () => {
  const artifacts = await files(new URL('../dist/', import.meta.url))
  assert.ok(artifacts.some(p => p.pathname.endsWith('.js')), 'Build first')
  const backend = await files(new URL('../functions/src/assessments/definitions/', import.meta.url))
  const privateHashes = new Set(await Promise.all(backend.map(async p => createHash('sha256').update(await readFile(p)).digest('hex'))))
  for (const path of [...artifacts, ...await files(new URL('../public/', import.meta.url))]) {
    assert.ok(!path.pathname.endsWith('.map'), 'Public source map: ' + path.pathname)
    const bytes = await readFile(path)
    assert.ok(!privateHashes.has(createHash('sha256').update(bytes).digest('hex')), 'Copied private source')
    if (/\.(js|mjs|json|html|svg|txt|css)$/.test(path.pathname)) {
      const content = bytes.toString('utf8'); assert.doesNotMatch(content, forbidden)
      assert.doesNotMatch(content, /sourceMappingURL|sourcesContent/)
    }
  }
})
test('public forms retain questions and choices but no expected values, explanations, graders or weights', async () => {
  const forms = JSON.parse(await readFile(new URL('../src/assessments/forms.json', import.meta.url)))
  const fixtures = JSON.parse(gunzipSync(await readFile(new URL('./fixtures/assessment-baseline.json.gz', import.meta.url))))
  const secretKeys = new Set(['expected','expectedAnswers','answer','explanation','explanations','score','scores','passScore','criticalIndices','pointsForQuestion'])
  function inspect(value) { if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) { assert.ok(!secretKeys.has(key), key); inspect(item) } }
  inspect(forms)
  for (const fixture of fixtures) for (const language of ['en','id']) {
    const form = forms.find(f => f.product === fixture.course && f.section === fixture.section && f.assessmentVersion === fixture.version)
    assert.deepEqual(form.copy[language].questions.map(q => ({id:q.id,title:q.title,type:q.type,options:q.options,fields:q.fields})), fixture.copy[language].questions.map(q => ({id:q.id,title:q.title,type:q.type,options:q.options,fields:q.fields})))
  }
})
