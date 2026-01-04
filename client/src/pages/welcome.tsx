import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PartyPopper, ShoppingBag, Home } from "lucide-react";

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center space-y-8 p-8 rounded-2xl bg-secondary/30 border border-border shadow-xl"
            >
                <div className="flex justify-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <PartyPopper className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-montserrat text-foreground">
                        환영합니다!
                    </h1>
                    <p className="text-muted-foreground font-pretendard">
                        더 온밀의 소중한 회원이 되신 것을 축하드립니다.<br />
                        이제 최고급 베이커리를 집에서 만나보세요.
                    </p>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                    <Link href="/products">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 py-6 text-lg rounded-full">
                            <ShoppingBag className="mr-2 w-5 h-5" />
                            쇼핑하러 가기
                        </Button>
                    </Link>

                    <Link href="/">
                        <Button variant="outline" className="w-full py-6 text-lg rounded-full border-primary/20 hover:bg-primary/5">
                            <Home className="mr-2 w-5 h-5" />
                            홈페이지로 이동
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
