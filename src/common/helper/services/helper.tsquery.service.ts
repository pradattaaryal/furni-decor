export class TSQueryHelperService {
  constructor() {}

  formatPrefixQueryForTsQuery(input: string): string {
    // Split the input into individual words
    const words = input.trim().split(/\s+/);
    // Map each word to add ":*" and join with " & "
    const tsquery = words.map((word) => word + ':*').join(' & ');
    return tsquery;
  }
}
