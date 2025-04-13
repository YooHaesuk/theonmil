import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0A]">
      <Card className="w-full max-w-md mx-4 bg-[#111111] border border-[#222222] shadow-lg">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white font-montserrat">404 페이지를 찾을 수 없습니다</h1>
          </div>

          <p className="mt-4 text-sm text-gray-400 font-pretendard mb-6">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          
          <div className="mt-6">
            <Link href="/" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#A78BFA] to-[#EC4899] text-white font-medium transition-all hover:opacity-90 inline-block">
              홈으로 돌아가기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
