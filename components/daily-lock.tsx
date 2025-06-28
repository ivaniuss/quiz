import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar } from "lucide-react"

interface DailyLockProps {
  gameName: string
}

export function DailyLock({ gameName }: DailyLockProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const timeUntilTomorrow = tomorrow.getTime() - new Date().getTime()
  const hoursLeft = Math.floor(timeUntilTomorrow / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg border-2 border-blue-100 text-center">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-2xl text-blue-700 flex items-center justify-center gap-2">
            <Clock className="h-6 w-6" />
            Come Back Tomorrow!
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-6">
            <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-2">You've already completed {gameName} today!</p>
            <p className="text-gray-600">New challenges are released daily at midnight.</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-700 font-semibold">
              Next quiz in: {hoursLeft}h {minutesLeft}m
            </p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>💡 Tip: Bookmark this page and come back daily for new football trivia!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
