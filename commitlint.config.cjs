module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
    'scope-enum': [
      2,
      'always',
      [
        'gateway',
        'auth',
        'upload',
        'video',
        'job',
        'stats',
        'notification',
        'worker',
        'frontend',
        'infra',
        'deps',
        'repo',
      ],
    ],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'header-max-length': [2, 'always', 100],
  },
};
