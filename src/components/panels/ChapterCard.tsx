import type { Note } from '@/content'
import { Field } from '@/components/content/Field'
import { LinkRow } from '@/components/content/LinkRow'
import { MediaSlot } from '@/components/content/MediaSlot'

/** Short-form note card — world objects of type "note", and /journey sections. */
export function ChapterCard({ note }: { note: Note }) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg">{note.title}</h3>
      {note.body.map((line, i) => (
        <Field key={i} as="p" value={line} className="leading-relaxed" />
      ))}
      {note.images?.map((img) => <MediaSlot key={img.id} image={img} />)}
      {note.links && <LinkRow links={note.links} />}
    </div>
  )
}
