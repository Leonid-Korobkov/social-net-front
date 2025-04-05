import CardSkeleton from "@/components/ui/CardSkeleton";

export default function Loading() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
