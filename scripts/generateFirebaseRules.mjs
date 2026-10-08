import { writeFileSync } from 'node:fs'
import { getSectionExercise } from '../src/data/sectionExercises.js'

const officeFields = ['settings', 'rules', 'projectName', 'ground', 'ruleSet', 'attributes', 'height1', 'height2', 'grade', 'copy', 'drawing', 'length', 'verify', 'grid', 'alignmentCheck']
const validations = []
for (const course of ['tas', 'trb', 'tme']) for (const section of [1, 2, 3]) {
  const exercise = getSectionExercise(course, section)
  const fields = exercise.officePlan ? officeFields : exercise.copy.en.questions.flatMap(question => [question.id, ...(question.fields || []).map(field => field.name)])
  const values = fields.map(field => `answer(a.${field})`)
  for (const question of exercise.copy.en.questions) {
    if (question.type === 'choice' || ['dimensions', 'quantity'].includes(question.type)) values.push(`a.${question.id} in ${JSON.stringify(question.options.map(([value]) => value))}`)
  }
  validations.push(`(d.course == '${course}' && d.section == ${section} && d.assessmentVersion == '${exercise.storageKey.match(/:(v\d+)$/)[1]}'
        && a.keys().hasAll(${JSON.stringify(fields)}) && a.keys().hasOnly(${JSON.stringify(fields)})
        && ${values.join(' && ')})`)
}
const rules = `// Generated from the assessment definitions by npm run firebase:rules.
// Scores are client-calculated; this validates shape, not correctness.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function googleUser() { return signedIn() && request.auth.token.firebase.sign_in_provider == 'google.com'; }
    function admin() {
      return googleUser() && exists(/databases/$(database)/documents/admins/$(request.auth.uid))
        && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.enabled == true;
    }
    function answer(value) { return value is string && value.size() > 0 && value.size() <= 100; }
    function validAnswers(d) {
      let a = d.answers;
      return a is map && (${validations.join('\n        || ')});
    }
    function validAttempt(d, id) {
      let keys = ['attemptId', 'uid', 'name', 'jobTitle', 'employeeId', 'course', 'section', 'answers', 'score', 'maximumScore', 'passed', 'assessmentVersion', 'scoreVerified', 'submittedAt'];
      return d.keys().hasAll(keys) && d.keys().hasOnly(keys)
        && d.attemptId == id && id.matches('^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$')
        && d.uid == request.auth.uid
        && answer(d.name) && d.name.matches('.*\\\\S.*') && answer(d.jobTitle) && d.jobTitle.matches('.*\\\\S.*')
        && d.employeeId is string && d.employeeId.matches('^[0-9]{6}$')
        && d.section is int && d.section >= 1 && d.section <= 3
        && d.score is int && d.score >= 0 && d.score <= 100 && d.maximumScore == 100
        && d.passed is bool && (!d.passed || d.score >= 80)
        && d.scoreVerified == false
        && d.submittedAt is timestamp && d.submittedAt == request.time
        && validAnswers(d);
    }
    match /admins/{uid} {
      allow get: if googleUser() && request.auth.uid == uid;
      allow list, create, update, delete: if false;
    }
    match /testAttempts/{id} {
      allow create: if signedIn() && request.auth.token.firebase.sign_in_provider == 'anonymous' && validAttempt(request.resource.data, id);
      // Permit checking an absent ID so participants can use a create-only transaction.
      allow get: if admin() || (signedIn() && (!exists(/databases/$(database)/documents/testAttempts/$(id)) || resource.data.uid == request.auth.uid));
      allow list: if admin();
      allow update, delete: if false;
    }
  }
}
`
writeFileSync(new URL('../firestore.rules', import.meta.url), rules)

const indexes = []
const equalityFields = ['employeeId', 'course', 'section']
for (let mask = 1; mask < 8; mask++) indexes.push({ collectionGroup: 'testAttempts', queryScope: 'COLLECTION', fields: [...equalityFields.filter((_, index) => mask & (1 << index)).map(fieldPath => ({ fieldPath, order: 'ASCENDING' })), { fieldPath: 'submittedAt', order: 'DESCENDING' }] })
writeFileSync(new URL('../firestore.indexes.json', import.meta.url), JSON.stringify({ indexes, fieldOverrides: [{ collectionGroup: 'testAttempts', fieldPath: 'answers', indexes: [] }] }, null, 2) + '\n')
