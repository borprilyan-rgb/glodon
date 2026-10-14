import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { validateRegistration } from '../../functions/src/registration.js'
import { employeeRules } from '../../scripts/employeeRules.mjs'
const input = () => ({ name: ' Employee ', employeeId: '000123', password: 'password1', registrationId: randomUUID(), recoverySecret: 'a'.repeat(64) })
test('registration preserves leading zeros, trims name, and never normalizes password', () => {
  const data = input(); data.password = ' spaces '; const result = validateRegistration(data)
  assert.equal(result.employeeId, '000123'); assert.equal(result.name, 'Employee'); assert.equal(result.password, ' spaces ')
})
test('invalid fields and privilege/identifier injection are rejected', () => {
  for (const changes of [{employeeId:123456},{employeeId:'12345'},{employeeId:'1234567'},{employeeId:'12a456'},{name:' '},{name:'x'.repeat(101)},{password:'1234567'},{password:'x'.repeat(129)},{role:'admin'},{uid:'victim'},{syntheticEmail:'victim@example.test'},{recoverySecret:'bad'}]) assert.throws(() => validateRegistration({...input(),...changes}))
})
test('candidate rules exactly match the generator and forbid later-phase writes', () => {
  assert.equal(readFileSync(new URL('../../firestore.employee.rules',import.meta.url),'utf8'),employeeRules)
  assert.match(employeeRules,/allow create, update, delete: if false;/)
})
