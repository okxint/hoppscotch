import { HoppCollection } from "@hoppscotch/data"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { safeParseJSON } from "~/helpers/functional/json"
import { validateGQLCollection } from "./hopp"

const toArray = (val: unknown): unknown[] =>
  Array.isArray(val) ? val : [val]

export const hoppGqlCollectionsImporter = (
  contents: string[]
): E.Either<"INVALID_JSON", HoppCollection[]> => {
  const results: HoppCollection[] = []

  for (const content of contents) {
    const parsed = safeParseJSON(content)
    if (O.isNone(parsed)) return E.left("INVALID_JSON")

    for (const col of toArray(parsed.value)) {
      const validated = validateGQLCollection(col)
      if (O.isNone(validated)) return E.left("INVALID_JSON")
      results.push(validated.value)
    }
  }

  return E.right(results)
}
