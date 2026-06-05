function hashText(value) {
  let hash = 2166136261

  for (const character of String(value)) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase()
}

export function buildCertificateId({ userId, courseId, submittedAt }) {
  const date = new Date(submittedAt)
  const year = Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear()
  const fingerprint = hashText(`${userId}:${courseId}:${submittedAt}`)

  return `SL-${year}-${fingerprint}`
}
