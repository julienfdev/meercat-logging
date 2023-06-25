const recursiveRedact = (object: Record<string, any>, deep: number) => {
  if (deep < 20) {
    for (const key in object) {
      if (typeof object[key] === 'object')
        recursiveRedact(object[key], deep + 1);
      if (typeof object[key] === 'string') {
        if (key.includes('pass')) {
          object[key] = 'xxxx-redacted-xxxx';
        }
      }
    }
  }
};

const redactPasswords = (object: Record<string, any>) => {
  recursiveRedact(object, 0);
};

export default redactPasswords;
