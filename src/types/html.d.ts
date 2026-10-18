/** Page bodies under src/components/site/pages are imported as strings (webpack asset/source). */
declare module '*.html' {
  const content: string
  export default content
}
