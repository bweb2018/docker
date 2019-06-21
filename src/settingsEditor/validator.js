import { uniq } from 'lodash';

export default function validate(settings, value) {
  try {
    if (Array.isArray(settings)) {
      return settings.every((s) => {
        if (s.condition && value[s.condition.name] !== s.condition.equals) {
          return true;
        }
        return validate(s, value[s.name]);
      });
    }

    if (settings.type === 'text') {
      const { regex, required } = settings;
      return (!required || value) && (!regex || new RegExp(regex).test(value));
    }

    if (settings.type === 'table') {
      const { headers } = settings;
      const uniqueColumns = headers.filter(
        x => typeof x === 'object' && x.unique,
      ).map(
        x => x.name,
      );
      return uniqueColumns.every(
        col => uniq(value.map(row => row[col])).length === value.length,
      );
    }

    return true;
  } catch (ex) {
    return false;
  }
}
