type FormDataEntry = {
  key: string
  contentType?: string
  value: string | Blob
}

export const toFormData = (values: FormDataEntry[]) => {
  const formData = new FormData()

  values.forEach(({ key, value, contentType }) => {
    if (contentType) {
      // Wrap in a Blob to carry the content type, but do NOT pass a filename.
      // RFC 7578 §4.2: the `filename` parameter in Content-Disposition MUST only
      // appear for file parts where the user selected an actual file. Passing the
      // field name as the third argument to `formData.append` would cause browsers
      // (and downstream serialisers) to emit `filename=<fieldname>` for plain text
      // fields, which violates the spec.
      formData.append(
        key,
        new Blob([value], {
          type: contentType,
        })
      )

      return
    }

    formData.append(key, value)
  })

  return formData
}
