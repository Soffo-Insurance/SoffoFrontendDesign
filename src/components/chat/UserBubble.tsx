interface UserBubbleProps {
  content: string
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-md bg-black text-white px-3 py-2">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}
